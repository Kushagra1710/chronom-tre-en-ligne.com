import { SITE_URL } from "../lib/site";
import { tools } from "../lib/tools";
import type { APIRoute } from "astro";
export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...tools.map((tool) => tool.href), "/outils/", "/chronometres/", "/minuteurs/", "/minuteurs-concentration/", "/a-propos/", "/confidentialite/", "/conditions-utilisation/", "/contact/"].map((path) => `<url><loc>${SITE_URL}${path}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
