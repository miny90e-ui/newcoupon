"use client";

import { useEffect, useState } from "react";

const UNITS = [
  { label: "d", ms: 86_400_000 },
  { label: "h", ms: 3_600_000 },
  { label: "m", ms: 60_000 },
  { label: "s", ms: 1000 },
];

/**
 * Black Friday countdown: "Starts in" until the sale opens, then "Ends in" until Cyber Monday is over.
 * Renders dashes on the server and fills in after load, so server and browser clocks never clash.
 */
export function Countdown({ starts, ends }: { starts: number; ends: number }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const live = now !== null && now >= starts;
  let left = now === null ? -1 : Math.max(0, (live ? ends : starts) - now);

  return (
    <span role="timer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
      {live ? "Live now · ends in" : "Starts in"}
      <span className="inline-flex gap-1">
        {UNITS.map(({ label, ms }) => {
          let value = "--";
          if (left >= 0) {
            const n = Math.floor(left / ms);
            left -= n * ms;
            value = label === "d" ? String(n) : String(n).padStart(2, "0");
          }
          return (
            <span key={label} className="min-w-[2.6em] rounded-md bg-white/10 px-1.5 py-0.5 text-center font-bold tabular-nums text-white">
              {value}
              <span className="font-medium text-white/60">{label}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
