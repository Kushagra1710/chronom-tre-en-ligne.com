# Wearlivo

Wearlivo is a mobile-first fashion editorial publication for affordable outfit inspiration, practical style guides, and wearable fashion trends.

The repository currently contains the Phase 3 application foundation, shared
site layout, responsive navigation, reusable editorial components, and the
complete visual homepage. It also includes the validated MDX content system and
eight demonstration articles. Publishing routes will be added in a later phase.

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

## Quality checks

```bash
npm run lint
npm run typecheck
npm run validate:content
npm run build
```

The canonical production URL is `https://wearlivo.com`. No external account or deployment is connected yet.

## Content

Articles are local MDX files in `content/outfit-ideas`, `content/style-guides`,
or `content/fashion-trends`. The file name, frontmatter slug, and category folder
must agree. Run `npm run validate:content` after adding or editing an article;
invalid frontmatter, duplicate slugs, missing cover images, unsafe remote images,
or invalid MDX will fail validation with the relevant filename.
