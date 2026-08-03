import type { Metadata } from "next";

import { InformationPage } from "@/components/editorial/information-page";
import { OwnerReviewNotice } from "@/components/editorial/owner-review-notice";
import { siteConfig } from "@/config/site";
import { createPageMetadata } from "@/lib/seo/metadata";

const description =
  "Contact Wearlivo about editorial feedback and corrections once its verified contact channel opens.";

export const metadata: Metadata = createPageMetadata({
  description,
  path: "/contact",
  title: "Contact",
});

export default function ContactPage() {
  return (
    <InformationPage
      description={description}
      eyebrow="Get in touch"
      path="/contact"
      title="Contact Wearlivo"
    >
      <section>
        <h2>Editorial enquiries</h2>
        <p>
          The future contact channel will be used for corrections, accessibility
          feedback and general editorial enquiries. The form below is a layout preview
          and cannot send a message.
        </p>
        <p>
          <strong className="font-semibold text-ink">Contact email:</strong>{" "}
          {siteConfig.ownerReview.contactEmail ??
            "[OWNER REVIEW REQUIRED: add a verified contact email]"}
        </p>
      </section>
      <OwnerReviewNotice
        items={["Verified contact email and enquiry-handling process."]}
      />
      <form
        aria-describedby="contact-status"
        className="border border-border bg-surface p-6 sm:p-8"
      >
        <fieldset className="space-y-5" disabled>
          <div>
            <label
              className="text-xs font-bold uppercase tracking-[0.15em] text-ink"
              htmlFor="contact-topic"
            >
              Topic
            </label>
            <select
              className="mt-2 min-h-12 w-full border border-border bg-canvas px-4 disabled:cursor-not-allowed disabled:opacity-70"
              id="contact-topic"
              name="topic"
            >
              <option>Editorial correction</option>
              <option>Accessibility feedback</option>
              <option>General enquiry</option>
            </select>
          </div>
          <div>
            <label
              className="text-xs font-bold uppercase tracking-[0.15em] text-ink"
              htmlFor="contact-name"
            >
              Name
            </label>
            <input
              className="mt-2 min-h-12 w-full border border-border bg-canvas px-4 disabled:cursor-not-allowed disabled:opacity-70"
              id="contact-name"
              name="name"
              type="text"
            />
          </div>
          <div>
            <label
              className="text-xs font-bold uppercase tracking-[0.15em] text-ink"
              htmlFor="contact-email"
            >
              Email
            </label>
            <input
              className="mt-2 min-h-12 w-full border border-border bg-canvas px-4 disabled:cursor-not-allowed disabled:opacity-70"
              id="contact-email"
              name="email"
              type="email"
            />
          </div>
          <div>
            <label
              className="text-xs font-bold uppercase tracking-[0.15em] text-ink"
              htmlFor="contact-message"
            >
              Message
            </label>
            <textarea
              className="mt-2 min-h-32 w-full resize-y border border-border bg-canvas p-4 disabled:cursor-not-allowed disabled:opacity-70"
              id="contact-message"
              name="message"
            />
          </div>
          <button
            className="min-h-12 bg-ink px-6 text-xs font-bold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-55"
            type="submit"
          >
            Send message
          </button>
        </fieldset>
        <p className="mt-4 text-sm" id="contact-status">
          Preview only—the form has no backend and collects no information.
        </p>
      </form>
    </InformationPage>
  );
}
