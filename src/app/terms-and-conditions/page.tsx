import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { OwnerReviewNotice } from "@/components/editorial/owner-review-notice";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Read Wearlivo’s pre-launch terms notice for using its independent fashion editorial website.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/terms-and-conditions",
  title: "Terms and Conditions",
});

export default function TermsPage() {
  return (
    <InformationPage
      description={description}
      eyebrow={`Pre-launch notice · ${siteConfig.ownerReview.effectiveDate ?? "Owner review required"}`}
      path="/terms-and-conditions"
      title="Terms and Conditions"
    >
      <section>
        <h2>Informational and editorial use</h2>
        <p>
          Wearlivo publishes general fashion inspiration and wardrobe guidance. The
          site is free to read and does not currently sell products, process payments,
          offer subscriptions or provide user accounts.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          Readers may browse and share links to public pages. Do not disrupt the site,
          bypass security controls, scrape it in a way that harms availability or reuse
          its material in a way that misrepresents the source.
        </p>
      </section>
      <section>
        <h2>Intellectual property</h2>
        <p>
          Wearlivo’s original editorial text, visual identity and site presentation may
          not be republished as another publication’s work. Any third-party names or
          marks remain the property of their respective owners.
        </p>
      </section>
      <section>
        <h2>External links</h2>
        <p>
          Future articles may link to external websites for reference or commerce.
          Those websites control their own content, prices, availability, privacy and
          terms; a link does not create a partnership or endorsement by itself.
        </p>
      </section>
      <section>
        <h2>Availability and changes</h2>
        <p>
          Articles and site features may be corrected, updated, reorganised or removed.
          Continuous availability is not guaranteed, particularly during pre-launch
          development.
        </p>
      </section>
      <section>
        <h2>Responsibility</h2>
        <p>
          Readers should use editorial guidance in light of their own fit, comfort,
          dress-code and purchasing needs. Wearlivo cannot control decisions made from
          general information or the actions of external websites.
        </p>
      </section>
      <OwnerReviewNotice
        items={[
          `Legal owner: ${siteConfig.ownerReview.legalName ?? "[OWNER REVIEW REQUIRED]"}`,
          `Governing law and jurisdiction: ${siteConfig.ownerReview.jurisdiction ?? "[OWNER REVIEW REQUIRED]"}`,
          `Legally reviewed effective date: ${siteConfig.ownerReview.effectiveDate ?? "[OWNER REVIEW REQUIRED]"}`,
        ]}
      />
      <section>
        <h2>Review status</h2>
        <p>
          These are concise pre-launch terms, not legal advice. They require an
          appropriate legal review before the public production launch.
        </p>
      </section>
    </InformationPage>
  );
}
