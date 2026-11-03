"use client";

import { useEffect, useState } from "react";
import { Check, ClipboardCheck, MousePointer2, MousePointerClick, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: MousePointerClick, title: "Click “Get Code”", body: "Pick an offer on New Coupon. The store opens in a new tab." },
  { icon: ClipboardCheck, title: "Copy the code", body: "Tap Copy — the code is saved to your clipboard." },
  { icon: ShoppingBag, title: "Paste it at checkout", body: "Find the promo / discount box, paste, apply. Done." },
];
const STEP_MS = 2800;

/**
 * How-to feature (Savings Tips hero, foot of the home page): the three steps on the left light up in sync with a
 * small looping checkout animation on the right. With reduced motion it shows the final step, still.
 */
export function CouponHowTo({ photo, kicker = "Start here · Tip #1" }: { photo: string; kicker?: string }) {
  const [step, setStep] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setAnimate(false);
      setStep(2);
      return;
    }
    const t = setInterval(() => setStep((s) => (s + 1) % STEPS.length), STEP_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
      {/* Featured tip: the one shoppers look for first */}
      <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-wider text-white/75">{kicker}</p>
        <h2 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">How to use a coupon code</h2>
        <ol className="mt-4 space-y-2">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title}>
              <button
                type="button"
                onClick={() => setStep(i)}
                aria-current={step === i ? "step" : undefined}
                className={cn(
                  "flex w-full cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors duration-300",
                  step === i ? "bg-white text-ink shadow-lg" : "text-white hover:bg-white/10"
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg transition-colors duration-300",
                    step === i ? "bg-brand text-white" : "bg-white/15 text-white"
                  )}
                >
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <span>
                  <span className="block text-[15px] font-bold leading-tight">
                    {i + 1}. {title}
                  </span>
                  <span className={cn("mt-0.5 block text-sm", step === i ? "text-muted" : "text-white/75")}>{body}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Photo + animated demo (decorative; the steps above carry the meaning) */}
      <div aria-hidden className="relative">
        <div className="relative aspect-[5/4] overflow-hidden rounded-2xl sm:aspect-[16/11]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" width={640} height={400} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink/55 via-ink/15 to-transparent" />
        </div>

        <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[300px]">
          <div className="relative h-[178px] overflow-hidden rounded-2xl bg-surface p-4 text-ink shadow-2xl">
            {/* progress */}
            <div className="mb-3 flex gap-1.5">
              {STEPS.map((_, i) => (
                <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                  <span
                    className={cn("block h-full rounded-full bg-brand", step === i && animate && "animate-[nc-progress_linear_forwards]")}
                    style={{
                      width: i < step || (!animate && i <= step) ? "100%" : step === i && animate ? undefined : "0%",
                      animationDuration: `${STEP_MS}ms`,
                    }}
                  />
                </span>
              ))}
            </div>

            {/* step 1: get code */}
            <Panel show={step === 0}>
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-brand-tint text-sm font-extrabold text-brand">MC</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">My Cluck Hut</p>
                  <p className="text-sm font-bold">10% off your order</p>
                </div>
              </div>
              <div className="relative mt-4">
                <span className="flex h-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white animate-[nc-press_2.8s_ease-in-out_infinite]">
                  Get Code
                </span>
                <MousePointer2 className="absolute -bottom-3 right-10 size-6 fill-white text-ink drop-shadow animate-[nc-cursor_2.8s_ease-in-out_infinite]" />
              </div>
            </Panel>

            {/* step 2: copy */}
            <Panel show={step === 1}>
              <p className="text-xs text-muted">Your code</p>
              <div className="mt-1.5 flex items-stretch overflow-hidden rounded-full border-2 border-dashed border-brand">
                <span className="flex flex-1 items-center justify-center py-2 font-mono text-lg font-bold tracking-[0.15em]">MINYU10</span>
                <span className="flex items-center gap-1 bg-brand px-3 text-xs font-bold text-white">
                  <Check className="size-3.5" /> Copied
                </span>
              </div>
              <p className="mt-3 text-xs text-muted">Now switch to the store tab…</p>
            </Panel>

            {/* step 3: paste + total */}
            <Panel show={step === 2}>
              <div className="flex gap-2">
                <span className="flex h-9 flex-1 items-center overflow-hidden rounded-lg border border-line px-2.5 font-mono text-sm font-bold">
                  <span className={cn("inline-block overflow-hidden whitespace-nowrap", animate && step === 2 && "animate-[nc-type_0.9s_steps(7)_forwards]")}>
                    MINYU10
                  </span>
                </span>
                <span className="grid h-9 place-items-center rounded-lg bg-ink px-3 text-xs font-bold text-white">Apply</span>
              </div>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between text-muted">
                  <dt>Subtotal</dt>
                  <dd>$80.00</dd>
                </div>
                <div className="flex justify-between font-semibold text-brand">
                  <dt>Discount (10%)</dt>
                  <dd>−$8.00</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-1 font-extrabold">
                  <dt>Total</dt>
                  <dd>$72.00</dd>
                </div>
              </dl>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Panel({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "absolute inset-x-4 top-9 transition-all duration-500 ease-out",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      {children}
    </div>
  );
}
