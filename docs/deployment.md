# Production deployment

Wearlivo is prepared for a standard Next.js deployment on Vercel. The canonical
origin is `https://wearlivo.com`, and `package.json`, `.nvmrc`, and
`.node-version` all select Node.js 24.x. No Vercel project, GitHub remote, DNS
record, or external account is connected by this repository.

## Production configuration

- Vercel can detect the Next.js App Router project without a `vercel.json` file.
- Use Node.js 24.x. The `engines.node` value in `package.json` is authoritative.
- There are currently no required environment variables. Do not create empty or
  speculative values in Vercel.
- Keep secrets out of `NEXT_PUBLIC_*` variables and out of Git. Add a secret to
  Vercel only when a future approved integration actually requires it.
- Production metadata, canonical links, RSS, robots, sitemap, and structured data
  derive their origin from `siteConfig.url`, which is `https://wearlivo.com`.

## 1. Publish the local repository to GitHub

Do this only after reviewing every pending file and approving a push.

1. In GitHub, create an empty repository named `Wearlivo` under the intended
   owner. Do not initialize it with a README, license, or `.gitignore`, because
   this local project already has history.
2. In the project directory, rerun the four quality checks shown in the README.
3. Review and commit the intended files. `AGENTS.md` is locally excluded through
   `.git/info/exclude` and must remain untracked.
4. Connect and push the repository. For the repository previously identified for
   this project, the commands would be:

```bash
git status --short
git add --all
git status --short
git commit -m "chore: prepare Wearlivo for production deployment"
git remote add origin https://github.com/Kushagra1710/Wearlivo.git
git push -u origin main
```

If `origin` already exists at that point, inspect it with `git remote -v` and use
`git remote set-url origin <correct-url>` only if the existing URL is wrong.

## 2. Import and deploy in Vercel

1. Sign in to Vercel and choose **Add New → Project**.
2. Connect the intended GitHub account if necessary, then import the Wearlivo
   repository.
3. On **Configure Project**, confirm:
   - Framework Preset: **Next.js**
   - Root Directory: repository root (`.`)
   - Install Command: default (`npm install`)
   - Build Command: default (`next build`, equivalent to `npm run build`)
   - Output Directory: Next.js default; do not override it
4. In the project’s build/runtime settings, confirm **Node.js 24.x**. The
   repository’s `engines.node` entry also instructs Vercel to use 24.x.
5. Leave **Environment Variables** empty. Wearlivo currently requires none.
6. Select **Deploy** and wait for the production build to finish.
7. Open the generated `*.vercel.app` URL and test the home page, blog and
   category empty states, search, legal pages, `/sitemap.xml`, `/robots.txt`,
   and `/feed.xml`. Confirm removed and unknown article URLs return 404. When
   real articles are added, test each published article route as well.

Vercel creates preview deployments for non-production branches and production
deployments from the configured production branch, normally `main`.

## 3. Add the custom domains in Vercel

1. Open the Wearlivo Vercel project and go to **Settings → Domains**.
2. Add `wearlivo.com`.
3. Add `www.wearlivo.com` separately.
4. Keep `wearlivo.com` as the primary public/canonical domain, matching the
   source configuration.
5. Edit `www.wearlivo.com`, choose the option to redirect it to another domain,
   select `wearlivo.com`, and use a permanent redirect.
6. Vercel will display the exact DNS records needed for each domain. Copy those
   displayed values; do not substitute generic records from a tutorial.

Vercel domain references:
[adding a custom domain](https://vercel.com/docs/domains/set-up-custom-domain) and
[redirecting a domain](https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting).

## 4. Add Vercel-provided DNS records in Hostinger

Do not change nameservers unless Vercel explicitly requires that for this exact
project. A normal external-DNS connection should only require record changes.

1. Before changing anything, record or export the existing Hostinger DNS zone.
2. In hPanel, open **Domains → Domain portfolio → Manage → DNS / Nameservers**
   for `wearlivo.com`. Depending on the Hostinger plan, the editor may instead
   appear under the website’s **Advanced → DNS Zone Editor**.
3. In the Vercel domain screen, copy the exact record type, host/name, value, and
   any requested TTL for `wearlivo.com`; add that record in Hostinger.
4. Repeat with the exact record Vercel provides for `www.wearlivo.com`.
5. Change only conflicting web records that Vercel identifies. Preserve all
   unrelated MX, SPF, DKIM, DMARC, verification, email, and subdomain records.
6. Return to Vercel’s Domains screen and wait for both entries to show as valid.
   DNS propagation can take time; Hostinger advises that changes may take up to
   24 hours.
7. After Vercel provisions TLS, verify:
   - `https://wearlivo.com` loads securely;
   - `https://www.wearlivo.com` permanently redirects to the apex domain;
   - canonical tags use `https://wearlivo.com`;
   - existing email delivery still works.

Hostinger reference:
[using the DNS Zone Editor](https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/).

## Post-deployment smoke test

After the domain is live, rerun the launch checklist against the custom domain.
Keep advertising, analytics, newsletter submission, the contact form backend,
and affiliate integrations disabled until each receives a separate approval and
its privacy/consent requirements have been reviewed.
