import Link from "next/link";
import { Sparkles, Zap } from "lucide-react";
import type { StoreSummary } from "@/lib/queries";
import { Countdown } from "./countdown";

/**
 * Black Friday is the day after US Thanksgiving (the 4th Thursday of November) and the sale runs to the
 * end of Cyber Monday, in US Eastern time (UTC-5 then). The home page wears the Black Friday look from
 * 1 November until the sale is over, then goes back to normal on its own, every year.
 */
export function blackFriday(now = new Date()) {
  const year = now.getUTCFullYear();
  const firstThursday = 1 + ((4 - new Date(Date.UTC(year, 10, 1)).getUTCDay() + 7) % 7);
  const thanksgiving = firstThursday + 21;
  const showFrom = new Date(Date.UTC(year, 10, 1, 5));
  const starts = new Date(Date.UTC(year, 10, thanksgiving + 1, 5));
  const ends = new Date(Date.UTC(year, 10, thanksgiving + 5, 5));
  if (now < showFrom || now >= ends) return null;
  return { starts, ends };
}

// Sparkles scattered over the backdrop: position, size, twinkle delay.
const SPARKS = [
  { at: "left-[6%] top-[22%]", size: "size-3", delay: "0s" },
  { at: "left-[16%] bottom-[14%]", size: "size-2.5", delay: "1.1s" },
  { at: "left-[30%] top-[10%]", size: "size-2", delay: "0.6s" },
  { at: "right-[18%] bottom-[12%]", size: "size-3", delay: "1.6s" },
  { at: "right-[28%] top-[12%]", size: "size-2.5", delay: "0.3s" },
  { at: "right-[5%] bottom-[26%]", size: "size-2", delay: "0.9s" },
];

const TAGS = [
  { at: "left-8 top-1/2 -translate-y-1/2 -rotate-6", delay: "0s" },
  { at: "right-8 top-1/2 -translate-y-1/2 rotate-6", delay: "1.2s" },
];

/** Home page title panel for the Black Friday season: night-black sale backdrop, gold accents, live countdown. */
export function BlackFridayHero({ starts, ends, offers }: { starts: Date; ends: Date; offers: StoreSummary[] }) {
  const day = starts.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

  return (
    <section className="container-page pt-5 sm:pt-6">
      <div className="relative isolate overflow-hidden rounded-[24px] bg-night px-4 pb-7 pt-6 text-center text-white sm:px-10 sm:pt-7">
        {/* Backdrop: red and gold glow, outlined BLACK FRIDAY lettering, sparkles, hazard-tape edge */}
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 size-80 rounded-full bg-[#ff3b3b]/35 blur-3xl" />
          <div className="absolute -bottom-28 -right-20 size-96 rounded-full bg-gold/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1px,transparent_1px)] [background-size:16px_16px]" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[88px] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.07)] sm:text-[150px] lg:text-[190px]">
            Black Friday
          </span>
          {SPARKS.map(({ at, size, delay }) => (
            <Sparkles
              key={at}
              className={`absolute ${at} ${size} text-gold motion-safe:animate-[nc-twinkle_2.4s_ease-in-out_infinite]`}
              style={{ animationDelay: delay }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-2 bg-[repeating-linear-gradient(-45deg,var(--color-gold)_0_10px,var(--color-night)_10px_20px)]" />
        </div>

        <PriceTags offers={offers} />

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-night">
            <Zap className="size-3.5 fill-current" aria-hidden /> Black Friday · {day}
          </p>
          <Countdown starts={starts.getTime()} ends={ends.getTime()} />
        </div>
        <h1 className="mx-auto mt-3 max-w-4xl text-[24px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px] lg:text-[34px]">
          Black Friday&apos;s <span className="text-gold">best coupons</span> are right here
        </h1>
        <p className="mx-auto mt-1.5 max-w-3xl text-sm text-white/70">
          The biggest sale of the year, every code checked by our team.{" "}
          <Link href="/disclosure" className="underline underline-offset-2 hover:text-white">
            We may earn a commission
          </Link>{" "}
          from our links.
        </p>
      </div>
    </section>
  );
}

/** Gold sale tags with the best live offers, floating either side of the title on wide screens. */
function PriceTags({ offers }: { offers: StoreSummary[] }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
      {TAGS.map(({ at, delay }, i) => {
        const s = offers[i];
        if (!s?.bestOffer) return null;
        return (
          <div key={at} className={`absolute ${at}`}>
            <div className="motion-safe:animate-[nc-float_6s_ease-in-out_infinite]" style={{ animationDelay: delay }}>
              <div className="relative rounded-xl bg-gold py-2.5 pl-7 pr-4 text-left text-night shadow-[0_12px_30px_-8px_rgb(255_210_63/0.45)]">
                <span className="absolute left-2.5 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-night" />
                <span className="block text-lg font-black leading-none">{s.bestOffer}</span>
                <span className="mt-1 block max-w-28 truncate text-xs font-semibold">{s.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
