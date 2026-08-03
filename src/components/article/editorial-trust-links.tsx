import Link from "next/link";

const trustLinks = [
  { href: "/about", label: "About Wearlivo" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
] as const;

export function EditorialTrustLinks() {
  return (
    <nav aria-label="Wearlivo editorial information" className="border-y border-border py-6">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-ink-muted">
        About this publication
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
        {trustLinks.map((item) => (
          <li key={item.href}>
            <Link
              className="text-sm font-semibold text-ink underline decoration-border underline-offset-4 transition-colors hover:text-accent"
              href={item.href}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
