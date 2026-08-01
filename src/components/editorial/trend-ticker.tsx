import { trendTopics } from "@/data/homepage";

function TopicList() {
  return (
    <>
      {trendTopics.map((topic) => (
        <span className="flex items-center gap-6" key={topic}>
          <span>{topic}</span>
          <span aria-hidden="true" className="text-gold">
            ✦
          </span>
        </span>
      ))}
    </>
  );
}

export function TrendTicker() {
  return (
    <section aria-label="Fashion topics" className="overflow-hidden bg-ink py-4 text-white">
      <p className="sr-only">Current topics: {trendTopics.join(", ")}</p>
      <div aria-hidden="true" className="ticker-track flex w-max gap-6 whitespace-nowrap">
        <div className="flex gap-6 pr-6 text-xs font-bold uppercase tracking-[0.2em]">
          <TopicList />
        </div>
        <div className="flex gap-6 pr-6 text-xs font-bold uppercase tracking-[0.2em]">
          <TopicList />
        </div>
      </div>
    </section>
  );
}
