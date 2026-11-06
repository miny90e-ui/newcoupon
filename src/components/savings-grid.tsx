"use client";

import { useState } from "react";
import type { SavingsPost } from "@/lib/savings-posts";
import { cn } from "@/lib/utils";
import { PostCard, postLabel } from "./savings-post-card";

/** The article grid on /savings-tips, with a chip per category (and one for the guides) to narrow it. */
export function SavingsGrid({ posts }: { posts: SavingsPost[] }) {
  const [topic, setTopic] = useState("All");
  const counts = new Map<string, number>();
  for (const p of posts) counts.set(postLabel(p), (counts.get(postLabel(p)) ?? 0) + 1);
  // Biggest topics first, the guides last.
  const topics = [...counts.keys()].sort((a, b) => (a === "Guide" ? 1 : b === "Guide" ? -1 : counts.get(b)! - counts.get(a)!));
  const shown = topic === "All" ? posts : posts.filter((p) => postLabel(p) === topic);

  return (
    <>
      <div role="group" aria-label="Filter by topic" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...topics].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={cn(
              "inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold transition-colors",
              topic === t ? "bg-ink text-white shadow" : "bg-white text-ink ring-1 ring-line hover:ring-ink"
            )}
          >
            {t === "Guide" ? "Guides" : t}
            <span className={cn("rounded-full px-1.5 text-[11px]", topic === t ? "bg-white/20" : "bg-canvas text-muted")}>
              {t === "All" ? posts.length : counts.get(t)}
            </span>
          </button>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {shown.map((p) => (
          <li key={p.slug}>
            <PostCard post={p} />
          </li>
        ))}
      </ul>
    </>
  );
}
