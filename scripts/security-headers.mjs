import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Run after Astro/Cloudflare finish writing the actual deployment HTML. Hash
// its exact inline scripts, rather than allowing all inline JavaScript or eval.
const directory = fileURLToPath(new URL("../dist/client/", import.meta.url));
const htmlFiles = (await readdir(directory, { recursive: true }))
  .filter((name) => name.endsWith(".html"));
if (!htmlFiles.length) throw new Error("No built HTML found for CSP generation");
const hashes = new Set();
for (const file of htmlFiles) {
  const html = await readFile(join(directory, file), "utf8");
  for (const [, attributes, script] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/i.test(attributes) || !script.trim()) continue;
    hashes.add(`'sha256-${createHash("sha256").update(script).digest("base64")}'`);
  }
}
const policy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' ${[...hashes].sort().join(" ")} https://www.googletagmanager.com`,
  "script-src-attr 'none'",
  // Tools update progress/appearance via style attributes. No external styles.
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https://*.google-analytics.com https://*.googletagmanager.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");
const line = `  Content-Security-Policy: ${policy}`;
if (line.length > 2000) throw new Error("CSP exceeds Cloudflare's 2000-character header line limit");
const headerPath = join(directory, "_headers");
// Preserve the public headers and Astro's immutable asset-cache rule. Re-running
// is safe: replace only our generated block instead of accumulating CSPs.
const existing = (await readFile(headerPath, "utf8"))
  .replace(/^  Content-Security-Policy:[^\n]*\n?/gm, "");
if (!/^\/\*$/m.test(existing)) throw new Error("Missing global security header rule");
await writeFile(headerPath, existing.replace(/^\/\*$/m, `/*\n${line}`));
console.log(`Security headers ready: ${htmlFiles.length} HTML pages, ${hashes.size} inline script hashes`);
