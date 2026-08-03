import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Read Wearlivo’s editorial disclaimer covering general fashion information, fit, care and pre-launch placeholders.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/disclaimer",
  title: "Disclaimer",
});

export default function DisclaimerPage() {
  return (
    <InformationPage
      description={description}
      eyebrow="Editorial context"
      path="/disclaimer"
      title="Disclaimer"
    >
      <section>
        <h2>General fashion information</h2>
        <p>
          Wearlivo articles provide general editorial style guidance. Fit, sizing,
          comfort, care needs and dress-code suitability vary by person, garment and
          setting, so readers should use their own judgement.
        </p>
      </section>
      <section>
        <h2>Products, prices and availability</h2>
        <p>
          Product quality, colours, sizing, availability and prices can change or differ
          from what an article describes. Readers should verify current product details
          directly with the retailer before purchasing.
        </p>
      </section>
      <section>
        <h2>External retailers</h2>
        <p>
          External retailers control their own inventory, pricing, delivery, returns,
          warranties and privacy practices. Wearlivo does not currently sell products
          or process orders and cannot control a retailer’s service or policies.
        </p>
      </section>
      <section>
        <h2>Pre-launch content</h2>
        <p>
          Abstract local images are placeholders rather than product photography.
          Future articles will not claim partnerships, endorsements or tested product
          results without an appropriate factual basis and disclosure.
        </p>
      </section>
    </InformationPage>
  );
}
