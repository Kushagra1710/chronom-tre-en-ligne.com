# Wearlivo

Wearlivo is a mobile-first fashion editorial publication for affordable outfit inspiration, practical style guides, and wearable fashion trends.

The repository currently contains the Phase 7 application foundation, shared
site layout, responsive navigation, reusable editorial components, homepage,
validated MDX content system, publishing routes, category archives, article
reading experience, lightweight server-rendered search, public information
pages, metadata, structured data, sitemap, robots policy, and RSS discovery.
It also includes refined trust/legal pages and a disabled, provider-neutral
advertising-slot architecture for future owner-reviewed monetization.
It also includes production response-header hardening and local-only Git,
Vercel, Hostinger DNS, and launch documentation; no external service has been
connected.

## Technology

- Next.js App Router
- React Server Components by default
- Strict TypeScript
- Tailwind CSS
- Bodoni Moda and Manrope through `next/font`
- Repository-managed MDX content

## Local development

Wearlivo uses Node.js 24 LTS. The repository includes `.nvmrc` and
`.node-version` files, and npm enforces the `24.x` engine declared in
`package.json`.

With `nvm`, activate the supported runtime first:

```bash
nvm install
nvm use
```

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

Useful local routes include `/blog`, `/outfit-ideas`, `/style-guides`,
`/fashion-trends`, `/search`, `/sitemap.xml`, `/robots.txt`, and `/feed.xml`.
Published articles are available beneath `/blog/[slug]`; draft slugs return the
branded not-found page.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run build
```

The canonical production URL is `https://wearlivo.com`. No external account or deployment is connected yet.

## Monetization status

Advertising remains disabled through `ads.enabled = false`. Production renders
no advertising markup, scripts, or reserved space. `/ads.txt` is intentionally
absent until a verified publisher ID exists, and consent requirements must be
reviewed before any advertising, analytics, or marketing scripts are enabled.
See `docs/monetization-readiness.md` for the readiness checklist.

## Deployment preparation

No environment variables are currently required. Before any external action,
follow `docs/deployment.md` and complete `docs/launch-checklist.md`. The project
has not created a GitHub remote, Vercel project, or DNS change.

## Content

Articles are local MDX files in `content/outfit-ideas`, `content/style-guides`,
or `content/fashion-trends`. The file name, frontmatter slug, and category folder
must agree. Run `npm run validate:content` after adding or editing an article;
invalid frontmatter, duplicate slugs, missing cover images, unsafe remote images,
or invalid MDX will fail validation with the relevant filename.
