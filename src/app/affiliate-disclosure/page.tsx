import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Learn how Wearlivo will identify affiliate relationships and review its current pre-launch affiliate status.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/affiliate-disclosure",
  title: "Affiliate Disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <InformationPage
      description={description}
      eyebrow="Editorial transparency"
      path="/affiliate-disclosure"
      title="Affiliate Disclosure"
    >
      <section>
        <h2>Current status</h2>
        <p>
          Wearlivo does not currently publish active affiliate links, and no
          affiliate network or merchant account is connected.
        </p>
      </section>
      <section>
        <h2>How future affiliate links may work</h2>
        <p>
          Wearlivo may use affiliate links in the future. If a reader purchases through
          certain marked links, Wearlivo may earn a commission. The reader should not
          pay an additional amount because of that commission, although the retailer
          remains responsible for the final displayed price.
        </p>
      </section>
      <section>
        <h2>Disclosure near applicable content</h2>
        <p>
          Articles containing affiliate links will show a clear notice near the
          beginning of the relevant content. Affiliate URLs will not be added until a
          real programme is configured and the page has been reviewed.
        </p>
      </section>
      <section>
        <h2>Commercial influence</h2>
        <p>
          If compensation affects the placement or prominence of a product, that
          relationship should be stated clearly. Compensated placement will not be
          described as guaranteed impartial advice, and no partnership will be claimed
          without an actual agreement.
        </p>
      </section>
      <section>
        <h2>No named programme yet</h2>
        <p>
          Wearlivo does not currently claim participation in any affiliate network or
          retailer programme. This page will be updated when a verified relationship is
          configured.
        </p>
      </section>
    </InformationPage>
  );
}
