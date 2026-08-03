# Monetization readiness

Wearlivo does not currently load advertising, analytics, affiliate, newsletter,
or consent scripts. No AdSense approval is assumed or guaranteed.

## Advertising

The single advertising feature flag is `ads.enabled` in `src/config/ads.ts` and
must remain `false` until a provider is approved and configured. `AdSlot`
supports these provider-neutral placements:

- `article-after-introduction`
- `article-middle`
- `article-end`
- `article-sidebar`
- `home-between-sections`
- `archive-lower`

Disabled slots render nothing in production, including no wrapper or reserved
space. Development may show labelled, non-interactive layout previews. The
`article-middle` placement is registered for a future heading-safe insertion
point; it is not mounted in current articles.

## ads.txt

`/ads.txt` is intentionally absent. Add `public/ads.txt` only after AdSense
approval and receipt of a verified publisher ID. Never publish an example or
placeholder publisher record.

## Consent review

Before enabling AdSense, Google Analytics, or any third-party marketing tool:

1. Identify the services, cookies, storage, and data transfers involved.
2. Review consent requirements for the jurisdictions in scope.
3. Update the Privacy Policy and owner contact information.
4. Implement the smallest compliant consent mechanism before loading scripts.

No cookie banner is appropriate while none of those tracking technologies is
active.

## Owner confirmation required

The `siteConfig.ownerReview` fields are populated from owner-provided edits, but
all four values still require explicit confirmation as final before public
launch:

- verified contact email;
- legal owner or data-controller name;
- governing jurisdiction;
- reviewed policy effective date.
