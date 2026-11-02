"use client";

import { Children, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 5500;

/** Signed distance from `from` to `to` around a ring of `n`, in (-n/2, n/2]. */
function ring(to: number, from: number, n: number) {
  const d = (((to - from) % n) + n) % n;
  return d > n / 2 ? d - n : d;
}

/**
 * Full-width banner row: the current banner in the middle, its neighbours peeking in at the
 * screen edges, sliding on a loop. Peeks are clickable; swipe works on touch screens.
 * With two to four banners the set is repeated so both edges always have a neighbour.
 */
export function BrandCarousel({ labels, children }: { labels: string[]; children: React.ReactNode }) {
  const real = Children.toArray(children);
  const n = real.length;
  const copies = n > 1 ? Math.ceil(5 / n) : 1;
  const total = n * copies;

  const [pos, setPos] = useState({ cur: 0, prev: 0 });
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const go = (target: number) => setPos(({ cur }) => ({ cur: ((target % total) + total) % total, prev: cur }));
  const step = (dir: 1 | -1) => setPos(({ cur }) => ({ cur: (cur + dir + total) % total, prev: cur }));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || hovering || n < 2) return;
    const t = setInterval(() => setPos(({ cur }) => ({ cur: (cur + 1) % total, prev: cur })), INTERVAL_MS);
    return () => clearInterval(t);
  }, [paused, hovering, n, total]);

  if (n === 0) return null;
  const shift = ring(pos.cur, pos.prev, total);
  const active = pos.cur % n;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Top brands"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div
        className="relative h-[396px] touch-pan-y overflow-hidden [--gap:10px] sm:h-[344px] sm:[--gap:20px] lg:h-[384px]"
        onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s || n < 2) return;
          const dx = e.clientX - s.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y)) step(dx < 0 ? 1 : -1);
        }}
      >
        {Array.from({ length: total }, (_, i) => {
          const d = n > 1 ? ring(i, pos.cur, total) : 0;
          const before = n > 1 ? ring(i, pos.prev, total) : 0;
          // A banner that wraps round the ring jumps instead of sliding across the screen.
          const wrapped = d !== before - shift;
          const current = d === 0;
          return (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${(i % n) + 1} of ${n}: ${labels[i % n] ?? ""}`}
              aria-hidden={!current}
              className={cn(
                "absolute left-1/2 top-3 h-[372px] w-[calc(100%-44px)] sm:h-[320px] sm:w-[calc(100%-112px)] lg:h-[360px] lg:w-[min(1160px,calc(100%-176px))]",
                !wrapped && "transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                Math.abs(d) > 1 && Math.abs(before) > 1 && "invisible"
              )}
              style={{ transform: `translateX(calc(${d * 100 - 50}% + ${d} * var(--gap)))` }}
            >
              <div inert={!current} className="h-full">
                {real[i % n]}
              </div>
              {!current && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-hidden
                  onClick={() => go(i)}
                  className="absolute inset-0 cursor-pointer rounded-[24px] bg-canvas/25 transition-colors hover:bg-transparent sm:rounded-[28px]"
                />
              )}
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <div className="mt-1 flex items-center justify-center">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous brand"
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          {labels.map((label, i) => (
            <button
              key={label + i}
              type="button"
              onClick={() => go(pos.cur + ring(i, active, n))}
              aria-label={`Show ${label}`}
              aria-current={i === active}
              className="grid h-11 w-8 cursor-pointer place-items-center"
            >
              <span className={cn("h-1 rounded-full transition-all duration-300", i === active ? "w-7 bg-ink" : "w-4 bg-line")} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next brand"
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play banners" : "Pause banners"}
            className="grid size-11 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:text-ink"
          >
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          </button>
        </div>
      )}
    </section>
  );
}
