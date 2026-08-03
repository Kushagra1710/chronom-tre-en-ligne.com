export function AffiliateNotice({ active = false }: { active?: boolean }) {
  return (
    <aside className="my-8 border-y border-border py-4 text-sm leading-6 text-ink-muted">
      <strong className="font-semibold text-ink">Affiliate disclosure:</strong>{" "}
      {active
        ? "This article contains affiliate links. Wearlivo may earn a commission from qualifying purchases, at no additional cost to you."
        : "This article contains no active affiliate links. Any future affiliate relationship will be identified clearly before the relevant link."}
    </aside>
  );
}
