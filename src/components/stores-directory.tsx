"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { StoreLogo } from "./store-logo";

export type DirectoryStore = {
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string | null;
  offers: number;
  bestOffer: string | null;
};

const LETTERS = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"];

function letterOf(name: string) {
  const first = name.trim()[0]?.toUpperCase() ?? "#";
  return /[A-Z]/.test(first) ? first : "#";
}

/** A–Z store directory with an instant name filter. Server-rendered first, so every store link is in the HTML. */
export function StoresDirectory({ stores }: { stores: DirectoryStore[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    const map = new Map<string, DirectoryStore[]>();
    for (const s of stores) {
      if (q && !s.name.toLowerCase().includes(q) && !s.category?.toLowerCase().includes(q)) continue;
      const l = letterOf(s.name);
      map.set(l, [...(map.get(l) ?? []), s]);
    }
    return LETTERS.filter((l) => map.has(l)).map((l) => [l, map.get(l)!] as const);
  }, [stores, q]);

  const available = new Set(groups.map(([l]) => l));
  const shown = groups.reduce((n, [, list]) => n + list.length, 0);

  return (
    <>
      <div className="sticky top-14 z-20 sm:top-16 -mx-4 mt-8 border-y border-line bg-canvas/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-2xl sm:border sm:bg-surface/95 sm:px-4 sm:shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative lg:w-64">
            <label htmlFor="store-filter" className="sr-only">Filter stores</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              id="store-filter"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter stores"
              className="input h-11 rounded-full pl-10 pr-10"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear filter"
                className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted hover:text-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            )}
          </div>
          <nav aria-label="Jump to letter" className="-mx-1 overflow-x-auto [scrollbar-width:none] lg:ml-auto [&::-webkit-scrollbar]:hidden">
            <ul className="flex min-w-max px-1">
              {LETTERS.map((l) =>
                available.has(l) ? (
                  <li key={l}>
                    <a
                      href={`#letter-${l}`}
                      className="grid h-9 w-8 place-items-center rounded-lg text-sm font-bold text-ink transition-colors hover:bg-brand hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ) : (
                  <li key={l}>
                    <span aria-disabled="true" className="grid h-9 w-8 place-items-center rounded-lg text-sm font-medium text-muted/40">
                      {l}
                    </span>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-sm text-muted">
        {q ? `${shown} ${shown === 1 ? "store matches" : "stores match"} “${query.trim()}”` : null}
      </p>

      {groups.length === 0 ? (
        <div className="card mt-2 p-10 text-center">
          <p className="text-muted">No stores match “{query.trim()}”.</p>
          <button type="button" onClick={() => setQuery("")} className="btn-outline mt-4">
            Show all stores
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(([letter, list]) => (
            <section key={letter} id={`letter-${letter}`} aria-labelledby={`h-${letter}`} className="scroll-mt-48 lg:scroll-mt-36">
              <div className="flex items-center gap-3">
                <h2 id={`h-${letter}`} className="grid size-10 place-items-center rounded-xl bg-ink text-lg font-extrabold text-white">
                  {letter}
                </h2>
                <span className="h-px flex-1 bg-line" aria-hidden />
                <span className="text-xs font-medium text-muted">
                  {list.length} {list.length === 1 ? "store" : "stores"}
                </span>
              </div>
              <ul className="mt-4 grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/stores/${s.slug}`}
                      className="card group flex h-full items-center gap-4 p-4 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-lift)]"
                    >
                      <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface p-1.5">
                        <StoreLogo name={s.name} logoUrl={s.logoUrl} className="size-full rounded-lg text-base" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-ink group-hover:text-brand">{s.name}</span>
                        {s.category && <span className="block truncate text-xs text-muted">{s.category}</span>}
                        <span className="mt-2 flex flex-wrap items-center gap-1.5">
                          {s.bestOffer && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-xs font-bold text-brand">
                              <Tag className="size-3" aria-hidden /> {s.bestOffer}
                            </span>
                          )}
                          <span className="text-xs font-medium text-muted">
                            {s.offers > 0 ? `${s.offers} ${s.offers === 1 ? "offer" : "offers"}` : "No active offers"}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
