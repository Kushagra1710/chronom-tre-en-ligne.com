import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Meet Wearlivo, a fashion editorial focused on affordable, wearable outfit ideas, practical style guidance and current trends.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/about",
  title: "About",
});

export default function AboutPage() {
  return (
    <InformationPage
      description={description}
      eyebrow="Behind the edit"
      path="/about"
      title="About Wearlivo"
    >
      <section>
        <h2>Affordable style, made wearable</h2>
        <p>
          Wearlivo is a fashion editorial website focused on affordable, wearable and
          Gen Z-friendly outfit inspiration. It translates style ideas into combinations
          that can work for college, first jobs, weekends and everyday life.
        </p>
      </section>
      <section>
        <h2>What Wearlivo covers</h2>
        <p>
          The publication covers outfit formulas, wardrobe planning, colour and fit,
          practical style guides and fashion movements worth understanding. Trends are
          treated as inspiration rather than instructions to buy a new wardrobe.
        </p>
      </section>
      <section>
        <h2>Who it is for</h2>
        <p>
          Wearlivo is for readers building personal style around real schedules and
          realistic budgets. Advice aims to be clear enough for someone starting out,
          while leaving room for different bodies, climates, dress codes and tastes.
        </p>
      </section>
      <section>
        <h2>Editorial approach</h2>
        <p>
          Stories begin with usefulness: repeatability, comfort, proportion, care and
          the clothes a reader may already own. Wearlivo does not claim professional
          stylist credentials, brand partnerships or product testing that has not taken
          place.
        </p>
      </section>
      <section>
        <h2>Commercial transparency</h2>
        <p>
          There are no active affiliate links today. If affiliate relationships are
          introduced, applicable articles will carry a clear disclosure near the
          relevant content and the site-wide Affiliate Disclosure will be updated.
        </p>
      </section>
      <section>
        <h2>Pre-launch visuals</h2>
        <p>
          The current site uses clearly abstract local placeholders while the Wearlivo
          identity and properly licensed editorial photography are being prepared.
        </p>
      </section>
    </InformationPage>
  );
}
