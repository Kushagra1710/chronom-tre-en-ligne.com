# Wearlivo

Wearlivo is a mobile-first fashion editorial publication for affordable outfit inspiration, practical style guides, and wearable fashion trends.

The repository currently contains the Phase 1 application and design foundation. Editorial pages, reusable site components, and the MDX publishing system will be added in later approved phases.

## Technology

- Next.js App Router
- React Server Components by default
- Strict TypeScript
- Tailwind CSS
- Bodoni Moda and Manrope through `next/font`
- Repository-managed MDX content

## Local development

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
