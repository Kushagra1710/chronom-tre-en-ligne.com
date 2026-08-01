import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import {
  CONTENT_CATEGORIES,
  ContentValidationError,
  type ContentCategory,
  type ValidatedFrontmatter,
  validateFrontmatter,
} from "./schema";

const projectRoot = process.cwd();
const contentRoot = path.join(projectRoot, "content");
const safeSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type PostMetadata = Omit<ValidatedFrontmatter, "readingTime"> & {
  readingTime: string;
};

export type PostRecord = PostMetadata & {
  filePath: string;
  source: string;
};

export type DuplicateSlug = {
  files: string[];
  slug: string;
};

export type PreviousNextPosts = {
  next: PostMetadata | null;
  previous: PostMetadata | null;
};

function toMetadata(post: PostRecord): PostMetadata {
  return {
    author: post.author,
    category: post.category,
    coverImage: post.coverImage,
    description: post.description,
    draft: post.draft,
    featured: post.featured,
    hasAffiliateLinks: post.hasAffiliateLinks,
    imageAlt: post.imageAlt,
    publishedAt: post.publishedAt,
    readingTime: post.readingTime,
    seoDescription: post.seoDescription,
    seoTitle: post.seoTitle,
    slug: post.slug,
    tags: post.tags,
    title: post.title,
    updatedAt: post.updatedAt,
  };
}

function sortNewestFirst<T extends Pick<PostMetadata, "publishedAt" | "slug">>(
  posts: T[],
): T[] {
  return posts.sort(
    (left, right) =>
      right.publishedAt.localeCompare(left.publishedAt) ||
      left.slug.localeCompare(right.slug),
  );
}

export function calculateReadingTime(source: string): string {
  const minutes = Math.max(1, Math.ceil(readingTime(source).minutes));
  return `${minutes} min read`;
}

function validateMdxSource(source: string, filePath: string): void {
  const sourceWithoutCodeFences = source.replace(/```[\s\S]*?```/g, "");

  if (/^\s*(?:export|import)\s/m.test(sourceWithoutCodeFences)) {
    throw new ContentValidationError(
      filePath,
      "MDX import and export statements are not allowed; use the controlled component map",
    );
  }

  if (
    /!\[[^\]]*\]\(\s*(?:https?:)?\/\//i.test(sourceWithoutCodeFences) ||
    /<(?:ArticleImage|img)\b[^>]*\bsrc\s*=\s*["'](?:https?:)?\/\//i.test(
      sourceWithoutCodeFences,
    )
  ) {
    throw new ContentValidationError(
      filePath,
      "remote MDX images are not allowed; use a local /images/ path",
    );
  }
}

async function readPostFile(
  category: ContentCategory,
  absolutePath: string,
): Promise<PostRecord> {
  const filePath = path.relative(projectRoot, absolutePath);
  let parsedMatter: matter.GrayMatterFile<string>;

  try {
    const fileContents = await readFile(absolutePath, "utf8");
    parsedMatter = matter(fileContents);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ContentValidationError(filePath, `could not parse MDX: ${message}`, {
      cause: error,
    });
  }

  const frontmatter = validateFrontmatter(parsedMatter.data, filePath);
  const filenameSlug = path.basename(absolutePath, ".mdx");

  if (frontmatter.slug !== filenameSlug) {
    throw new ContentValidationError(
      filePath,
      `slug "${frontmatter.slug}" must match filename "${filenameSlug}.mdx"`,
    );
  }

  if (frontmatter.category !== category) {
    throw new ContentValidationError(
      filePath,
      `category "${frontmatter.category}" must match folder "${category}"`,
    );
  }

  const coverImagePath = path.join(
    projectRoot,
    "public",
    frontmatter.coverImage.slice(1),
  );

  try {
    await access(coverImagePath);
  } catch (error) {
    throw new ContentValidationError(
      filePath,
      `coverImage does not exist: ${frontmatter.coverImage}`,
      { cause: error },
    );
  }

  if (parsedMatter.content.trim().length === 0) {
    throw new ContentValidationError(filePath, "article body cannot be empty");
  }

  validateMdxSource(parsedMatter.content, filePath);

  return {
    ...frontmatter,
    filePath,
    readingTime:
      frontmatter.readingTime ?? calculateReadingTime(parsedMatter.content),
    source: parsedMatter.content,
  };
}

async function readCategoryPosts(category: ContentCategory): Promise<PostRecord[]> {
  const directory = path.join(contentRoot, category);
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    throw new ContentValidationError(
      path.relative(projectRoot, directory),
      "content category directory is missing or unreadable",
      { cause: error },
    );
  }

  const nestedDirectory = entries.find((entry) => entry.isDirectory());

  if (nestedDirectory) {
    throw new ContentValidationError(
      path.join(path.relative(projectRoot, directory), nestedDirectory.name),
      "nested content directories are not supported",
    );
  }

  return Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((entry) => readPostFile(category, path.join(directory, entry.name))),
  );
}

export function detectDuplicateSlugs(posts: readonly PostRecord[]): DuplicateSlug[] {
  const filesBySlug = new Map<string, string[]>();

  for (const post of posts) {
    const files = filesBySlug.get(post.slug) ?? [];
    files.push(post.filePath);
    filesBySlug.set(post.slug, files);
  }

  return [...filesBySlug.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([slug, files]) => ({ files, slug }));
}

export async function getAllPostRecords(): Promise<PostRecord[]> {
  const posts = (
    await Promise.all(CONTENT_CATEGORIES.map((category) => readCategoryPosts(category)))
  ).flat();
  const duplicates = detectDuplicateSlugs(posts);

  if (duplicates.length > 0) {
    const details = duplicates
      .map(({ files, slug }) => `"${slug}" appears in ${files.join(", ")}`)
      .join("; ");
    throw new ContentValidationError("content", `duplicate slugs detected: ${details}`);
  }

  return sortNewestFirst(posts);
}

async function getPublishedPostRecords(): Promise<PostRecord[]> {
  return (await getAllPostRecords()).filter((post) => !post.draft);
}

export async function getAllPublishedPosts(): Promise<PostMetadata[]> {
  return (await getPublishedPostRecords()).map(toMetadata);
}

export async function getPostBySlug(
  slug: string,
  options: { includeDrafts?: boolean } = {},
): Promise<PostRecord | null> {
  if (!safeSlugPattern.test(slug)) {
    return null;
  }

  const posts = options.includeDrafts
    ? await getAllPostRecords()
    : await getPublishedPostRecords();

  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostsByCategory(
  category: ContentCategory,
): Promise<PostMetadata[]> {
  return (await getPublishedPostRecords())
    .filter((post) => post.category === category)
    .map(toMetadata);
}

export async function getFeaturedPosts(limit?: number): Promise<PostMetadata[]> {
  const posts = (await getPublishedPostRecords())
    .filter((post) => post.featured)
    .map(toMetadata);

  return limit === undefined ? posts : posts.slice(0, Math.max(0, limit));
}

export async function getLatestPosts(limit = 6): Promise<PostMetadata[]> {
  return (await getPublishedPostRecords())
    .slice(0, Math.max(0, limit))
    .map(toMetadata);
}

export async function getRelatedPosts(
  slug: string,
  limit = 3,
): Promise<PostMetadata[]> {
  const posts = await getPublishedPostRecords();
  const currentPost = posts.find((post) => post.slug === slug);

  if (!currentPost) {
    return [];
  }

  const currentTags = new Set(
    currentPost.tags.map((tag) => tag.toLocaleLowerCase("en")),
  );

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const sharedTags = post.tags.filter((tag) =>
        currentTags.has(tag.toLocaleLowerCase("en")),
      ).length;
      const score = sharedTags * 2 + (post.category === currentPost.category ? 1 : 0);
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.post.publishedAt.localeCompare(left.post.publishedAt),
    )
    .slice(0, Math.max(0, limit))
    .map(({ post }) => toMetadata(post));
}

export async function getPreviousNextPosts(
  slug: string,
): Promise<PreviousNextPosts> {
  const posts = (await getPublishedPostRecords()).sort(
    (left, right) =>
      left.publishedAt.localeCompare(right.publishedAt) ||
      left.slug.localeCompare(right.slug),
  );
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return { next: null, previous: null };
  }

  const previousPost = posts[currentIndex - 1];
  const nextPost = posts[currentIndex + 1];

  return {
    next: nextPost ? toMetadata(nextPost) : null,
    previous: previousPost ? toMetadata(previousPost) : null,
  };
}
