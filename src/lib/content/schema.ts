import { z } from "zod";

export const CONTENT_CATEGORIES = [
  "outfit-ideas",
  "style-guides",
  "fashion-trends",
] as const;

export const contentCategorySchema = z.enum(CONTENT_CATEGORIES);

const isoDateSchema = z.preprocess(
  (value) =>
    value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must use YYYY-MM-DD format")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
    }, "must be a real calendar date"),
);

const nullableDateSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  isoDateSchema.nullable(),
);

const nullableSeoTitleSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().trim().min(1).max(70).nullable(),
);

const nullableSeoDescriptionSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z.string().trim().min(20).max(170).nullable(),
);

const nullableReadingTimeSchema = z.preprocess(
  (value) => (value === "" || value === undefined ? null : value),
  z
    .string()
    .trim()
    .regex(/^[1-9]\d* min read$/, 'must look like "6 min read"')
    .nullable(),
);

const tagsSchema = z
  .array(z.string().trim().min(1, "tag entries cannot be empty").max(60))
  .min(1, "at least one tag is required")
  .max(12, "use no more than 12 focused tags")
  .superRefine((tags, context) => {
    const normalizedTags = tags.map((tag) => tag.toLocaleLowerCase("en"));
    const duplicates = normalizedTags.filter(
      (tag, index) => normalizedTags.indexOf(tag) !== index,
    );

    if (duplicates.length > 0) {
      context.addIssue({
        code: "custom",
        message: `duplicate tags are not allowed: ${[...new Set(duplicates)].join(", ")}`,
      });
    }
  });

export const frontmatterSchema = z
  .object({
    title: z.string().trim().min(1, "title cannot be empty").max(120),
    slug: z
      .string()
      .trim()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "must contain lowercase letters, numbers and single hyphens only",
      ),
    description: z
      .string()
      .trim()
      .min(1, "description cannot be empty")
      .max(220),
    publishedAt: isoDateSchema,
    updatedAt: nullableDateSchema,
    category: contentCategorySchema,
    author: z.string().trim().min(1, "author cannot be empty").max(80),
    coverImage: z
      .string()
      .trim()
      .regex(
        /^\/images\/[a-z0-9/_-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i,
        "must be a local path beneath /images/",
      )
      .refine((value) => !value.includes(".."), "cannot traverse directories"),
    imageAlt: z.string().trim().min(1, "imageAlt cannot be empty").max(180),
    featured: z.boolean().default(false),
    tags: tagsSchema,
    readingTime: nullableReadingTimeSchema,
    draft: z.boolean().default(true),
    seoTitle: nullableSeoTitleSchema,
    seoDescription: nullableSeoDescriptionSchema,
    hasAffiliateLinks: z.boolean().default(false),
  })
  .strict()
  .superRefine((frontmatter, context) => {
    if (
      frontmatter.updatedAt !== null &&
      frontmatter.updatedAt < frontmatter.publishedAt
    ) {
      context.addIssue({
        code: "custom",
        message: "updatedAt cannot be before publishedAt",
        path: ["updatedAt"],
      });
    }
  });

export type ContentCategory = z.infer<typeof contentCategorySchema>;
export type ValidatedFrontmatter = z.infer<typeof frontmatterSchema>;

export class ContentValidationError extends Error {
  constructor(
    public readonly filePath: string,
    message: string,
    options?: ErrorOptions,
  ) {
    super(`${filePath}: ${message}`, options);
    this.name = "ContentValidationError";
  }
}

export function validateFrontmatter(
  value: unknown,
  filePath: string,
): ValidatedFrontmatter {
  const result = frontmatterSchema.safeParse(value);

  if (result.success) {
    return result.data;
  }

  const details = result.error.issues
    .map((issue) => {
      const field = issue.path.length > 0 ? issue.path.join(".") : "frontmatter";
      return `${field}: ${issue.message}`;
    })
    .join("; ");

  throw new ContentValidationError(filePath, details);
}
