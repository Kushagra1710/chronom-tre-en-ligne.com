import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { OwnerReviewNotice } from "@/components/editorial/owner-review-notice";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Read the pre-launch Wearlivo privacy notice and the current status of forms, accounts, analytics and advertising.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/privacy-policy",
  title: "Privacy Policy",
});

export default function PrivacyPolicyPage() {
  return (
    <InformationPage
      description={description}
      eyebrow={`Pre-launch notice · ${siteConfig.ownerReview.effectiveDate ?? "Owner review required"}`}
      path="/privacy-policy"
      title="Privacy Policy"
    >
      <section>
        <h2>What the current site does not collect</h2>
        <p>
          Wearlivo currently has no user accounts, authentication, payments, comments,
          connected newsletter provider, analytics service, active AdSense account or
          external form backend. The disabled newsletter and contact previews do not
          submit or store information.
        </p>
      </section>
      <section>
        <h2>Cookies and advertising</h2>
        <p>
          Wearlivo does not currently load advertising cookies, analytics cookies or
          third-party marketing trackers. No cookie banner is active because those
          services are not enabled.
        </p>
      </section>
      <section>
        <h2>Technical website delivery</h2>
        <p>
          When the site is hosted publicly, infrastructure providers may process
          ordinary technical request information needed to deliver, monitor and secure
          the website. The final hosting configuration and provider documentation must
          be reviewed before launch.
        </p>
      </section>
      <section>
        <h2>Future services</h2>
        <p>
          If analytics, advertising, affiliate tools, newsletter delivery or a working
          contact service is added later, this notice and any required consent controls
          must be updated before that service begins collecting data.
        </p>
      </section>
      <OwnerReviewNotice
        items={[
          `Legal owner or data-controller: ${siteConfig.ownerReview.legalName ?? "[OWNER REVIEW REQUIRED]"}`,
          `Privacy/contact email: ${siteConfig.ownerReview.contactEmail ?? "[OWNER REVIEW REQUIRED]"}`,
          `Applicable jurisdiction: ${siteConfig.ownerReview.jurisdiction ?? "[OWNER REVIEW REQUIRED]"}`,
          `Legally reviewed effective date: ${siteConfig.ownerReview.effectiveDate ?? "[OWNER REVIEW REQUIRED]"}`,
        ]}
      />
      <section>
        <h2>Review status</h2>
        <p>
          This page records the site’s current pre-launch configuration. It is not
          legal advice and must receive an appropriate owner and jurisdiction-specific
          review before deployment.
        </p>
      </section>
    </InformationPage>
  );
}
