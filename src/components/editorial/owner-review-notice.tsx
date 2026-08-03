export function OwnerReviewNotice({ items }: { items: readonly string[] }) {
  return (
    <aside className="border-l-2 border-gold bg-surface p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.17em] text-accent">
        Owner review required
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-ink-muted">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
