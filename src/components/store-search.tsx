"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import type { StoreSummary } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { StoreLogo } from "./store-logo";

const MAX_RESULTS = 6;

// One request per page view, shared by every search box on the page.
let storesRequest: Promise<StoreSummary[]> | null = null;
function loadStores() {
  storesRequest ??= fetch("/api/stores/suggest")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((d: { stores: StoreSummary[] }) => d.stores)
    .catch(() => {
      storesRequest = null;
      return [];
    });
  return storesRequest;
}

/** Lower-case, accents stripped ("Café" → "cafe"), with a map back to the original characters. */
function fold(s: string) {
  let out = "";
  const map: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i] === "đ" || s[i] === "Đ" ? "d" : s[i].normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    for (let j = 0; j < ch.length; j++) {
      out += ch[j];
      map.push(i);
    }
  }
  return { out, map };
}

type Match = { store: StoreSummary; start: number; end: number; rank: number };

/** Stores whose name contains the query: name starts with it first, then a word starts with it, then anywhere. */
function matchStores(stores: StoreSummary[], query: string): Match[] {
  const q = fold(query.trim()).out;
  const compact = q.replace(/\s+/g, "");
  if (!q) return [];
  const found: Match[] = [];
  for (const store of stores) {
    const { out, map } = fold(store.name);
    const i = out.indexOf(q);
    if (i >= 0) {
      const rank = i === 0 ? 0 : /[a-z0-9]/.test(out[i - 1]) ? 2 : 1;
      found.push({ store, start: map[i], end: map[i + q.length - 1] + 1, rank });
    } else if (compact && out.replace(/\s+/g, "").includes(compact)) {
      found.push({ store, start: -1, end: -1, rank: 3 });
    }
  }
  return found.sort((a, b) => a.rank - b.rank || b.store.offers - a.store.offers || a.store.name.localeCompare(b.store.name));
}

/**
 * Search box that suggests stores as you type (any part of the name, accents ignored).
 * Arrow keys + Enter open a store; Enter with nothing picked runs the normal search.
 */
export function StoreSearch({
  size = "lg",
  placeholder = "Search a store or brand",
  defaultValue = "",
  autoFocus,
  className,
}: {
  size?: "lg" | "sm";
  placeholder?: string;
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const id = useId();
  const inputId = `${id}-q`;
  const listId = `${id}-list`;

  const [value, setValue] = useState(defaultValue);
  const [stores, setStores] = useState<StoreSummary[] | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const q = value.trim();
  const results = useMemo(() => (stores && q ? matchStores(stores, q).slice(0, MAX_RESULTS) : []), [stores, q]);
  const popular = useMemo(
    () => (stores ?? []).filter((s) => s.offers > 0).sort((a, b) => b.offers - a.offers).slice(0, 5),
    [stores]
  );
  const items: Match[] = q ? results : popular.map((store) => ({ store, start: -1, end: -1, rank: 0 }));
  const count = items.length + (q ? 1 : 0);
  const visible = open && count > 0;

  function prime() {
    if (!stores) loadStores().then(setStores);
  }

  function go(store: StoreSummary) {
    setOpen(false);
    setActive(-1);
    router.push(`/stores/${store.slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      if (count === 0) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a < 0 && step < 0 ? count - 1 : (a + step + count) % count));
    } else if (e.key === "Enter" && visible && active >= 0 && active < items.length) {
      e.preventDefault();
      go(items[active].store);
    } else if (e.key === "Escape" && visible) {
      e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  }

  const lg = size === "lg";

  return (
    <form ref={formRef} action="/search" role="search" onSubmit={() => setOpen(false)} className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        Search stores and coupons
      </label>
      <div
        className={cn(
          "relative flex items-center rounded-full bg-white transition-shadow duration-300",
          lg
            ? "p-1.5 pl-4 shadow-[0_14px_36px_-14px_rgb(12_122_128/0.55)] ring-1 ring-line focus-within:shadow-[0_0_0_6px_rgb(12_122_128/0.14),0_14px_36px_-14px_rgb(12_122_128/0.55)] focus-within:ring-2 focus-within:ring-brand sm:pl-5"
            : "focus-within:ring-2 focus-within:ring-ink/40"
        )}
      >
        <Search
          className={cn("pointer-events-none shrink-0", lg ? "size-5 text-brand" : "absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted")}
          aria-hidden
        />
        <input
          id={inputId}
          name="q"
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setActive(-1);
            setOpen(true);
            prime();
          }}
          onFocus={() => {
            setOpen(true);
            prime();
          }}
          onBlur={() => {
            setOpen(false);
            setActive(-1);
          }}
          onPointerEnter={prime}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          role="combobox"
          aria-expanded={visible}
          aria-controls={visible ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={visible && active >= 0 ? `${listId}-${active}` : undefined}
          className={cn(
            "min-w-0 flex-1 bg-transparent text-body placeholder:text-muted focus:outline-none focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none",
            lg ? "h-12 px-3 text-base" : "h-11 w-full rounded-full pl-10 pr-4 text-[15px]"
          )}
        />

        {lg && value && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setValue("");
              setActive(-1);
            }}
            aria-label="Clear search"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
        {lg && (
          <button className="btn-primary h-12 shrink-0 px-4 text-[15px] sm:px-7">
            <Search className="size-5 sm:hidden" aria-hidden />
            <span className="max-sm:sr-only">Search</span>
          </button>
        )}
      </div>

      {visible && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className={cn(
            "absolute top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-[0_18px_40px_-12px_rgb(15_46_51/0.28)] motion-safe:animate-[nc-drop_160ms_ease-out]",
            lg ? "inset-x-0" : "right-0 w-[min(26rem,calc(100vw-2rem))]"
          )}
        >
          <p className="px-4 pb-1 pt-3 text-xs font-bold uppercase tracking-wider text-muted">
            {q ? "Stores" : "Popular stores"}
          </p>
          {q && stores && items.length === 0 && (
            <p className="px-4 pb-2 pt-1 text-sm text-muted">No store names contain “{q}”.</p>
          )}
          <ul id={listId} role="listbox" aria-label={q ? `Stores matching ${q}` : "Popular stores"} className="pb-1">
            {items.map(({ store: s, start, end }, i) => (
              <li
                key={s.slug}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={active === i}
                onClick={() => go(s)}
                onMouseMove={() => setActive(i)}
                className={cn("flex min-h-14 cursor-pointer items-center gap-3 px-4 py-2 transition-colors", active === i && "bg-brand-tint")}
              >
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-line bg-surface p-1">
                  <StoreLogo name={s.name} logoUrl={s.logoUrl} className="size-full rounded-md text-[11px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-ink">
                    {start < 0 ? (
                      s.name
                    ) : (
                      <>
                        {s.name.slice(0, start)}
                        <mark className="rounded-sm bg-brand/15 px-px font-extrabold text-brand">{s.name.slice(start, end)}</mark>
                        {s.name.slice(end)}
                      </>
                    )}
                  </span>
                  <span className="block truncate text-xs text-muted">
                    {[s.category, s.offers > 0 ? `${s.offers} ${s.offers === 1 ? "offer" : "offers"}` : "No active offers"]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
                {s.bestOffer && (
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-bold text-brand",
                      active === i ? "bg-white" : "bg-brand-tint"
                    )}
                  >
                    {s.bestOffer}
                  </span>
                )}
              </li>
            ))}
            {q && (
              <li
                id={`${listId}-${items.length}`}
                role="option"
                aria-selected={active === items.length}
                onClick={() => formRef.current?.requestSubmit()}
                onMouseMove={() => setActive(items.length)}
                className={cn(
                  "flex min-h-12 cursor-pointer items-center gap-3 border-t border-line px-4 text-sm font-semibold text-brand transition-colors",
                  active === items.length && "bg-brand-tint"
                )}
              >
                <Search className="size-4 shrink-0" aria-hidden />
                <span className="min-w-0 flex-1 truncate">See all results for “{q}”</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden />
              </li>
            )}
          </ul>
        </div>
      )}
      <p role="status" className="sr-only">
        {visible && q && stores ? `${results.length} ${results.length === 1 ? "store" : "stores"} found` : ""}
      </p>
    </form>
  );
}
