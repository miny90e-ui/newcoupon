import Link from "next/link";
import { ArrowRight, BadgeCheck, Receipt } from "lucide-react";
import { EXAMPLE_ORDER, type SavingsExample } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { RevealTrigger } from "./reveal-trigger";
import { StoreLogo } from "./store-logo";

// A use count only reads as proof once it's a real crowd.
const SHOW_USES_FROM = 10;
// One receipt column per offer plus the "find your store" card.
const COLS = ["", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

function money(n: number, cents = true) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents || !Number.isInteger(n) ? 2 : 0,
  });
}

/**
 * Bottom of the home page: what the live codes actually take off an example order, as receipts.
 * Worked out from real offers in place of testimonials, so it updates whenever the sheet changes.
 */
export function SavingsProof({
  examples,
  bestPct,
  offers,
  stores,
}: {
  examples: SavingsExample[];
  bestPct: number;
  offers: number;
  stores: number;
}) {
  const stats = [
    { value: offers, label: offers === 1 ? "live offer" : "live offers" },
    { value: stores, label: stores === 1 ? "store" : "stores" },
    ...(bestPct > 0 ? [{ value: `${bestPct}%`, label: "top discount" }] : []),
  ];
  const cards = examples.length + 1;

  return (
    <section className="container-page pt-16" aria-labelledby="savings-title">
      <div className="rounded-[28px] bg-brand-tint p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand">
              <Receipt className="size-4" aria-hidden /> Real savings, worked out
            </p>
            <h2 id="savings-title" className="section-title mt-2">
              What our codes take off your order
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
              Worked out from the codes live on New Coupon today, on an example {money(EXAMPLE_ORDER, false)} order. No
              made-up reviews, just the math. It updates on its own when offers change.
            </p>
          </div>
          <dl className={cn("grid gap-2 sm:gap-3 lg:w-[420px]", stats.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse rounded-2xl bg-white px-3 py-3 text-center shadow-[var(--shadow-card)]">
                <dt className="text-xs font-medium text-muted">{s.label}</dt>
                <dd className="text-2xl font-extrabold text-ink sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className={cn("mt-8 grid gap-4 sm:grid-cols-2", COLS[examples.length])}>
          {examples.map((ex) => {
            const isCode = ex.type === "CODE";
            return (
              <li key={ex.id} className="card relative flex flex-col p-5">
                <div className="flex items-center gap-3 pr-20">
                  <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-surface p-1">
                    <StoreLogo name={ex.store.name} logoUrl={ex.store.logoUrl} className="size-full rounded-lg text-xs" />
                  </span>
                  <span className="min-w-0">
                    <Link href={`/stores/${ex.store.slug}`} className="block truncate font-bold text-ink hover:text-brand">
                      {ex.store.name}
                    </Link>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      {ex.clicks >= SHOW_USES_FROM ? (
                        `Grabbed ${ex.clicks.toLocaleString("en-US")} times`
                      ) : (
                        <>
                          <BadgeCheck className="size-3.5 text-brand" aria-hidden /> Verified {isCode ? "code" : "deal"}
                        </>
                      )}
                    </span>
                  </span>
                </div>

                <span
                  aria-hidden
                  className="nc-stamp absolute right-4 top-4 rotate-[-8deg] rounded-lg border-2 border-brand px-2 py-1 text-center text-[11px] font-extrabold uppercase leading-tight text-brand"
                >
                  You save
                  <span className="block text-base">{money(ex.save, false)}</span>
                </span>

                <dl className="mt-5 space-y-2 border-y border-dashed border-line py-4 text-sm tabular-nums">
                  <div className="flex justify-between text-muted">
                    <dt>Example order</dt>
                    <dd>{money(EXAMPLE_ORDER)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 font-semibold text-brand">
                    <dt>
                      {isCode ? "Code" : "Deal"} · {ex.discountLabel}
                    </dt>
                    <dd>−{money(ex.save)}</dd>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-ink">
                    <dt>You pay</dt>
                    <dd>{money(ex.pay)}</dd>
                  </div>
                </dl>

                <RevealTrigger
                  couponId={ex.id}
                  label={`${isCode ? "Get code" : "Get deal"}: ${ex.title}`}
                  className="btn-primary mt-5 w-full cursor-pointer"
                >
                  {isCode ? "Get Code" : "Get Deal"}
                </RevealTrigger>
              </li>
            );
          })}

          <li className={cn(cards % 2 === 1 && "sm:max-lg:col-span-2")}>
            <Link
              href="/stores"
              className="group flex h-full min-h-48 flex-col justify-between rounded-[var(--radius-card)] bg-brand p-6 text-white transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
            >
              <span>
                <span className="block text-xl font-extrabold leading-snug">Shopping somewhere else?</span>
                <span className="mt-2 block text-sm leading-relaxed text-white/80">
                  Find codes for every store we cover, each one checked before it goes live.
                </span>
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-bold">
                Browse {stores} {stores === 1 ? "store" : "stores"}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
