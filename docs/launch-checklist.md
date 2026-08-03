# Wearlivo launch checklist

Unchecked items are launch blockers or require an owner’s manual review. Checked
items describe the repository’s current technical state, not an external legal
or account approval.

## Ownership and editorial

- [ ] Explicitly confirm that the legal name, contact email, jurisdiction, and
  effective date in `src/config/site.ts` are final public values.
- [ ] Have the Privacy Policy, Terms and Conditions, Disclaimer, Affiliate
  Disclosure, and contact wording reviewed for the actual launch jurisdiction.
- [x] Replace the Wearlivo text-logo fallback with the owner-approved logo.
- [ ] Replace every abstract placeholder with original or properly licensed
  fashion imagery and keep meaningful alt text and license records.
- [ ] Publish at least 8–10 polished, owner-reviewed articles; the content
  directories are currently empty and ready for real launch articles.
- [ ] Add a final favicon and test it in browsers and saved bookmarks.
- [ ] Replace the generated placeholder social image with the final approved
  sharing image and test its 1200×630 preview.
- [ ] Add the verified Pinterest profile URL to `siteConfig.social.pinterest`.
- [ ] Verify the public contact channel receives mail. The contact form must stay
  visibly unavailable until a backend and privacy handling are approved.

## Discovery and quality assurance

- [ ] Inspect `/sitemap.xml` on the final domain and confirm it contains only
  canonical published pages.
- [ ] Inspect `/robots.txt` on the final domain and confirm it points to the
  canonical sitemap.
- [ ] Inspect `/feed.xml` in an RSS reader and confirm drafts are absent.
- [ ] Test navigation, typography, images, forms/placeholders, and article pages
  on representative mobile devices.
- [ ] Repeat the visual and keyboard-navigation test on desktop browsers.
- [ ] Crawl or manually check internal and external links on the deployed site.
- [x] Local lint, strict TypeScript, zero-content validation, and production
  build pass for the current source.

## Deployment and integrations

- [ ] Review the final Git diff, commit only intended files, and push after owner
  approval; keep `AGENTS.md` local-only.
- [ ] Verify the temporary Vercel URL before connecting DNS.
- [ ] Verify apex HTTPS and the permanent `www` redirect after DNS propagation.
- [x] Advertising is disabled and no `ads.txt` or provider script is published.
- [x] Analytics and third-party marketing scripts are absent.
- [x] Newsletter submission and contact-form backends remain disconnected.
