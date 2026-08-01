import { compile } from "@mdx-js/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import {
  getAllPostRecords,
  getAllPublishedPosts,
  getFeaturedPosts,
  getLatestPosts,
  getPostBySlug,
  getPostsByCategory,
  getPreviousNextPosts,
  getRelatedPosts,
} from "../src/lib/content/posts";
import { CONTENT_CATEGORIES } from "../src/lib/content/schema";

async function validateContent(): Promise<void> {
  const posts = await getAllPostRecords();

  await Promise.all(
    posts.map(async (post) => {
      try {
        await compile(post.source, {
          format: "mdx",
          rehypePlugins: [rehypeSlug],
          remarkPlugins: [remarkGfm],
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`${post.filePath}: MDX compilation failed: ${message}`, {
          cause: error,
        });
      }
    }),
  );

  const publishedPosts = await getAllPublishedPosts();
  const draftCount = posts.filter((post) => post.draft).length;
  const publicCollections = [
    await getFeaturedPosts(),
    await getLatestPosts(posts.length),
    ...(await Promise.all(
      CONTENT_CATEGORIES.map((category) => getPostsByCategory(category)),
    )),
  ];

  if (publicCollections.flat().some((post) => post.draft)) {
    throw new Error("Draft filtering failed: a draft appeared in a public collection");
  }

  for (const post of posts) {
    const publicPost = await getPostBySlug(post.slug);
    const previewPost = await getPostBySlug(post.slug, { includeDrafts: true });

    if (!previewPost || (post.draft && publicPost) || (!post.draft && !publicPost)) {
      throw new Error(`Draft-safe slug lookup failed for ${post.filePath}`);
    }
  }

  const firstPublishedPost = publishedPosts[0];

  if (firstPublishedPost) {
    const relatedPosts = await getRelatedPosts(firstPublishedPost.slug);
    const adjacentPosts = await getPreviousNextPosts(firstPublishedPost.slug);

    if (
      relatedPosts.some((post) => post.draft) ||
      adjacentPosts.previous?.draft ||
      adjacentPosts.next?.draft
    ) {
      throw new Error("Draft filtering failed in related or adjacent posts");
    }
  }

  console.log(
    `Validated ${posts.length} MDX posts (${publishedPosts.length} published, ${draftCount} drafts).`,
  );
  console.log("Frontmatter, unique slugs, folder matching and MDX compilation passed.");
}

validateContent().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Content validation failed:\n${message}`);
  process.exitCode = 1;
});
