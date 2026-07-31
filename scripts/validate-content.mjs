import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const contentRoot = path.join(projectRoot, "content");
const categoryDirectories = [
  "outfit-ideas",
  "style-guides",
  "fashion-trends",
];

let mdxFileCount = 0;

for (const category of categoryDirectories) {
  const directory = path.join(contentRoot, category);
  let entries;

  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Missing or unreadable content directory: ${directory}\n${message}`);
  }

  mdxFileCount += entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".mdx"),
  ).length;
}

console.log(
  `Content directory structure is valid (${mdxFileCount} MDX files found).`,
);
