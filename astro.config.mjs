// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
export default defineConfig({
  site: "https://wearlivo.com",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  adapter: cloudflare(),
});