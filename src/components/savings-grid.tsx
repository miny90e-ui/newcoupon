import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SavingsPost } from "@/lib/savings-posts";
import { cn, slugify } from "@/lib/utils";
import { PostCard, postLabel } from "./savings-post-card";

// Nine cards fill three rows of the desktop grid; with the lead post on top, a page holds ten articles.
export const POSTS_PER_PAGE = 9;

/** One page of the article list, narrowed to a topic ("beauty", "guide") when one is picked. */
export function savingsPage(posts: SavingsPost[], topic: string | undefined, page: number) {
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(postLabel(p), (counts.get(postLabel(p)) ?? 0) + 1);
  // Biggest topics first, the guides last.
  const topics = [...counts.keys()]
    .sort((a, b) => (a === "Guide" ? 1 : b === "Guide" ? -1 : counts.get(b)! - counts.get(a)!))
    .map((label) => ({ label, slug: slugify(label), count: counts.get(label)! }));
  const current = topics.find((t) => t.slug === topic);
  const matching = current ? posts.filter((p) => postLabel(p) === current.label) : posts;
  const pages = Math.max(1, Math.ceil(matching.length / POSTS_PER_PAGE));
  return {
    topics,
    topic: current?.slug,
    total: posts.length,
    pages,
    shown: matching.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE),
  };
}

/** Address of a list page; the #latest anchor lands the visitor on the list, not the header. */
export function savingsHref(topic: string | undefined, page: number) {
  const q = new URLSearchParams();
  if (topic) q.set("topic", topic);
  if (page > 1) q.set("page", String(page));
  const s = q.toString();
  return `/savings-tips${s ? `?${s}` : ""}#latest`;
}

/** The article grid on /savings-tips: a chip per category (and one for the guides), the cards, then page links. */
export function SavingsGrid({ list, page }: { list: ReturnType<typeof savingsPage>; page: number }) {
  const { topics, topic, total, pages, shown } = list;
  const chips = [{ label: "All", slug: undefined, count: total }, ...topics];

  return (
    <>
      <nav aria-label="Filter by topic" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {chips.map((t) => {
          const on = t.slug === topic;
          return (
            <Link
              key={t.label}
              href={savingsHref(t.slug, 1)}
              aria-current={on ? "true" : undefined}
              className={cn(
                "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
                on ? "bg-ink text-white shadow" : "bg-white text-ink ring-1 ring-line hover:ring-ink"
              )}
            >
              {t.label === "Guide" ? "Guides" : t.label}
              <span className={cn("rounded-full px-1.5 text-[11px]", on ? "bg-white/20" : "bg-canvas text-muted")}>{t.count}</span>
            </Link>
          );
        })}
      </nav>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
      {pages > 1 && <Pager topic={topic} page={page} pages={pages} />}
    </>
  );
}

const PAGE_BOX = "inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 text-sm font-bold transition-colors";

/** Previous / 1 2 3 / Next. With many pages, the ones far from the current page fold into "…". */
function Pager({ topic, page, pages }: { topic?: string; page: number; pages: number }) {
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  return (
    <nav aria-label="Pages" className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
      {page > 1 && (
        <Link href={savingsHref(topic, page - 1)} rel="prev" className={cn(PAGE_BOX, "bg-white text-ink ring-1 ring-line hover:ring-ink")}>
          <ChevronLeft className="size-4" aria-hidden />
          <span className="max-sm:sr-only">Previous</span>
        </Link>
      )}
      {nums.map((n, i) => (
        <span key={n} className="contents">
          {i > 0 && n - nums[i - 1] > 1 && (
            <span aria-hidden className="px-1 text-muted">
              …
            </span>
          )}
          {n === page ? (
            <span aria-current="page" className={cn(PAGE_BOX, "bg-ink text-white shadow")}>
              {n}
            </span>
          ) : (
            <Link href={savingsHref(topic, n)} aria-label={`Page ${n}`} className={cn(PAGE_BOX, "bg-white text-ink ring-1 ring-line hover:ring-ink")}>
              {n}
            </Link>
          )}
        </span>
      ))}
      {page < pages && (
        <Link href={savingsHref(topic, page + 1)} rel="next" className={cn(PAGE_BOX, "bg-gold text-ink hover:bg-gold/85")}>
          <span className="max-sm:sr-only">Next</span>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
