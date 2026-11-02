"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaLabel: string | null;
  href: string;
  imageUrl: string | null;
  bgColor: string | null;
};

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused || hovering || count < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [paused, hovering, count]);

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured offers"
      className="relative"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
    >
      <div className="relative overflow-hidden rounded-[24px] shadow-[var(--shadow-lift)]">
        <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              className="relative flex min-h-[280px] w-full shrink-0 items-center sm:min-h-[340px] lg:min-h-[380px]"
              style={{ backgroundColor: s.bgColor ?? "#0C7A80" }}
            >
              {s.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.imageUrl} alt="" className="absolute inset-0 size-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              )}
              {s.imageUrl && <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />}
              {!s.imageUrl && (
                <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 items-center justify-center md:flex">
                  <div className="absolute size-[420px] rounded-full bg-white/[0.04]" />
                  <div className="absolute size-[280px] rounded-full bg-white/[0.05]" />
                  <div className="relative flex h-40 w-72 rotate-[-6deg] items-stretch rounded-2xl bg-white/95 shadow-2xl">
                    <div className="flex flex-1 flex-col justify-center pl-7">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Coupon</span>
                      <span className="mt-1 text-5xl font-extrabold tracking-tight" style={{ color: s.bgColor ?? "#0C7A80" }}>SAVE</span>
                    </div>
                    <div className="my-4 border-l-2 border-dashed border-line" />
                    <div className="flex w-20 items-center justify-center">
                      <span className="grid size-12 place-items-center rounded-full bg-brand text-2xl font-extrabold text-white">%</span>
                    </div>
                    <span className="absolute -top-3 right-[76px] size-6 rounded-full" style={{ backgroundColor: s.bgColor ?? "#0C7A80" }} />
                    <span className="absolute -bottom-3 right-[76px] size-6 rounded-full" style={{ backgroundColor: s.bgColor ?? "#0C7A80" }} />
                  </div>
                </div>
              )}
              <div className="relative max-w-2xl px-8 py-12 sm:px-14 lg:px-20">
                <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">{s.title}</h2>
                {s.subtitle && <p className="mt-3 max-w-lg text-base text-white/85 sm:text-lg">{s.subtitle}</p>}
                <Link href={s.href} tabIndex={i === index ? 0 : -1} className="btn mt-7 bg-white text-ink hover:bg-brand-tint">
                  {s.ctaLabel || "Shop now"}
                </Link>
              </div>
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 sm:grid text-ink shadow hover:bg-white">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-white/90 sm:grid text-ink shadow hover:bg-white">
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="grid h-11 w-8 cursor-pointer place-items-center"
            >
              <span className={cn("h-1 rounded-full transition-all duration-300", i === index ? "w-7 bg-ink" : "w-4 bg-line")} />
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="ml-1 grid size-11 cursor-pointer place-items-center rounded-full text-muted hover:text-ink"
          >
            {paused ? <Play className="size-4" aria-hidden /> : <Pause className="size-4" aria-hidden />}
          </button>
        </div>
      )}
    </section>
  );
}
