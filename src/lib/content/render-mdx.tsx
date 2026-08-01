import type { ReactElement } from "react";

import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/mdx/mdx-components";

import type { PostRecord } from "./posts";
import { ContentValidationError } from "./schema";

export async function renderPostMdx(post: PostRecord): Promise<ReactElement> {
  try {
    const { content } = await compileMDX({
      components: mdxComponents,
      options: {
        mdxOptions: {
          format: "mdx",
          rehypePlugins: [rehypeSlug],
          remarkPlugins: [remarkGfm],
        },
      },
      source: post.source,
    });

    return content;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new ContentValidationError(
      post.filePath,
      `MDX compilation failed: ${message}`,
      { cause: error },
    );
  }
}
