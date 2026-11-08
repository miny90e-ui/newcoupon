import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, RefreshCw, Sparkles, Star } from "lucide-react";
import { savingsPosts } from "@/lib/savings-posts";
import { reviewsChecked } from "@/components/shopper-reviews";
import { FeaturedPost, Sticker } from "@/components/savings-post-card";
import { SavingsGrid, savingsPage } from "@/components/savings-grid";
import { cn } from "@/lib/utils";

type Props = { searchParams: Promise<{ page?: string; topic?: string }> };

const pageNumber = (page?: string) => Math.max(1, Math.floor(Number(page)) || 1);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, topic } = await searchParams;
  const n = pageNumber(page);
  return {
    title: n > 1 ? `Savings Tips & Shopping Advice — Page ${n}` : "Savings Tips & Shopping Advice",
    description: "Tested promo codes, real shopper ratings and simple habits that cut the price of what you buy online.",
    // Each page of the full list stands on its own; a topic view repeats those posts, so it points back to the list.
    alternates: { canonical: !topic && n > 1 ? `/savings-tips?page=${n}` : "/savings-tips" },
  };
}

// Three products from the top articles, fanned out on the header.
const FAN = [
  "z-0 -mr-6 size-28 -rotate-6 lg:size-36",
  "z-10 size-36 lg:size-44",
  "z-0 -ml-6 size-28 rotate-6 lg:size-36",
];

export default async function SavingsTipsPage({ searchParams }: Props) {
  const [{ page: pageParam, topic }, posts] = await Promise.all([searchParams, savingsPosts()]);
  const page = pageNumber(pageParam);
  // The top slot needs a photo; the first post that has one leads.
  const featured = posts.find((p) => p.image) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  const list = savingsPage(rest, topic, page);
  if (page > list.pages) notFound();
  const deals = posts.filter((p) => p.kind === "deal");
  const fan = deals.filter((p) => p.thumb && p !== featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-ink-soft to-ink text-white">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div aria-hidden className="absolute -right-20 -top-24 size-80 rounded-full bg-gold/25 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 left-1/4 size-72 rounded-full bg-[#4fd1c5]/25 blur-3xl" />
        <div className="container-page relative pb-16 pt-5 sm:pb-20 sm:pt-8">
          <div className="mx-auto grid max-w-5xl items-center gap-6 sm:grid-cols-[1.4fr_1fr]">
            <div>
              <nav aria-label="Breadcrumb" className="text-xs text-white/70">
                <Link href="/" className="hover:text-white hover:underline">Home</Link>
                <span aria-hidden> › </span>
                <span className="text-white">Savings Tips</span>
              </nav>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-gold ring-1 ring-white/20">
                <Sparkles className="size-3.5" aria-hidden />
                Updated every week
              </p>
              <h1 className="mt-2 text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Savings Tips & <span className="text-gold">Shopping Advice</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm text-white/80 sm:text-base">
                Promo codes we tested in each store&apos;s cart, what real shoppers say about the store, and simple habits that
                cut the price of what you buy.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                  <BadgeCheck className="size-3.5 text-gold" aria-hidden />
                  {deals.length} tested codes
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                  <Star className="size-3.5 fill-gold text-gold" aria-hidden />
                  Real shopper ratings
                </li>
                <li className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15">
                  <RefreshCw className="size-3.5 text-gold" aria-hidden />
                  Checked {reviewsChecked()}
                </li>
              </ul>
            </div>
            {fan.length === 3 && (
              <div aria-hidden className="hidden items-center justify-center sm:flex">
                {fan.map((p, i) => (
                  <div key={p.slug} className={cn("relative shrink-0", FAN[i])}>
                    <div
                      className="size-full rounded-2xl bg-white p-1.5 shadow-[0_18px_36px_-12px_rgb(0_0_0/0.6)] motion-safe:animate-[nc-float_5s_ease-in-out_infinite]"
                      style={{ animationDelay: `${i * 0.6}s` }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.thumb!} alt="" className="size-full rounded-xl object-cover" />
                    </div>
                    <Sticker post={p} className="absolute -top-2 left-1/2 -translate-x-1/2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative bg-gradient-to-b from-brand-tint to-canvas pb-10 sm:pb-14">
        <div className="container-page">
          <div className="mx-auto max-w-5xl">
            {featured && page === 1 && (
              <div className="relative -mt-10 sm:-mt-12">
                <FeaturedPost post={featured} />
              </div>
            )}

            <h2 id="latest" className="scroll-mt-20 pt-8 text-lg font-extrabold tracking-tight sm:scroll-mt-24 sm:text-xl">
              Latest tips & tested codes
              {list.pages > 1 && (
                <span className="ml-2 text-sm font-semibold text-muted">
                  Page {page} of {list.pages}
                </span>
              )}
            </h2>
            <div className="mt-3">
              <SavingsGrid list={list} page={page} />
            </div>

            <div className="relative mt-10 overflow-hidden rounded-3xl bg-gold px-5 py-6 sm:flex sm:items-center sm:justify-between sm:px-8">
              <span aria-hidden className="absolute -right-8 -top-10 size-36 rounded-full bg-white/30" />
              <div className="relative">
                <p className="text-lg font-extrabold text-ink sm:text-xl">Shopping somewhere else?</p>
                <p className="mt-0.5 text-sm text-ink/80">Every store we have a working code for, tested the same way.</p>
              </div>
              <Link href="/stores" className="btn-ink relative mt-4 shrink-0 whitespace-nowrap sm:mt-0">
                Browse all stores
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
