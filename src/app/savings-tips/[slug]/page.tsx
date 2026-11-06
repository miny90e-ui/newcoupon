import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, BadgeCheck, CheckCircle2, Info, ListChecks, ListOrdered, type LucideIcon, Star, Wrench } from "lucide-react";
import { savingsPost, type SavingsPost } from "@/lib/savings-posts";
import { CHECKLIST, TIPS, TROUBLESHOOT } from "@/config/savings-guides";
import { PostCard, PostImage, PostMeta, Sticker, TONE_CYCLE, postLabel, postTone } from "@/components/savings-post-card";
import { ReviewSummary } from "@/components/shopper-reviews";
import { CouponHowTo } from "@/components/coupon-how-to";
import { CouponReveal } from "@/components/coupon-reveal";
import { RevealTrigger } from "@/components/reveal-trigger";
import { savingsSlug } from "@/lib/seo";
import { SITE_NAME, cn, siteUrl } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ c?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await savingsPost((await params).slug);
  if (!found) return {};
  const { post } = found;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/savings-tips/${post.slug}` },
    openGraph: post.image ? { images: [post.image] } : undefined,
  };
}

/** A section of the article on its own coloured panel, headed by a round icon. */
function Panel({
  icon: Icon,
  title,
  className,
  iconClass,
  children,
}: {
  icon: LucideIcon;
  title: string;
  className: string;
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("mt-5 rounded-2xl p-4 ring-1 ring-black/5 sm:mt-6 sm:p-6", className)}>
      <h2 className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight sm:text-xl">
        <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", iconClass)}>
          <Icon className="size-4" aria-hidden />
        </span>
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** The code as a coupon ticket: the saving on a gold stub, the offer and Get Code beside it. */
function DealTicket({ post }: { post: SavingsPost }) {
  const { store, coupon } = post;
  if (!store || !coupon) return null;
  // "10% OFF" shows as a big "10%" over "off"; a label like "FREE SHIP" shows as it is.
  const off = /\s+off$/i.test(coupon.discountLabel ?? "");
  const amount = coupon.discountLabel?.replace(/\s+off$/i, "");
  return (
    <div className="mt-5 flex overflow-hidden rounded-2xl bg-white text-ink shadow-[0_18px_40px_-16px_rgb(0_0_0/0.6)]">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-gold px-2 py-3 text-center sm:w-28">
        <span className="text-[26px] font-extrabold leading-none tracking-tight sm:text-3xl">{amount ?? "Deal"}</span>
        {off && <span className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.2em]">off</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 border-l-2 border-dashed border-line p-3 sm:flex-row sm:items-center sm:p-4">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 text-xs font-bold text-brand">
            <BadgeCheck className="size-3.5" aria-hidden />
            {coupon.code ? "Code tested this week" : "Deal checked this week"}
          </p>
          <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug">{coupon.title}</p>
        </div>
        <RevealTrigger
          couponId={coupon.id}
          label={`${coupon.code ? "Get code" : "Get deal"}: ${store.name} — ${coupon.title}`}
          className={cn("btn min-h-10 shrink-0 px-6 font-bold hover:brightness-110", postTone(post).solid)}
        >
          {coupon.code ? "Get Code" : "Get Deal"}
        </RevealTrigger>
      </div>
    </div>
  );
}

function DealArticle({ post }: { post: SavingsPost }) {
  const { store, coupon, reviews } = post;
  if (!store || !coupon) return null;
  const tone = postTone(post);
  const words = post.offer ?? coupon.title;
  const offer = words.charAt(0).toLowerCase() + words.slice(1);
  const cta = coupon.code ? "Get Code" : "Get Deal";
  const steps = [
    <>
      Tap <strong>{cta}</strong> above. {store.name} opens in a new tab{coupon.code ? " and the code is shown here" : ""}.
    </>,
    ...(coupon.code
      ? [
          <>Copy the code and add what you want to your {store.name} cart.</>,
          <>Paste it in the discount or promo code box at checkout and apply it.</>,
        ]
      : []),
  ];
  return (
    <>
      <p className="text-[15px] leading-relaxed text-body sm:text-base">
        Right now you can get {offer} at {store.name}
        {coupon.code ? (
          <>
            {" "}
            with code <strong className="rounded bg-gold/40 px-1 font-mono text-ink">{coupon.code}</strong>. We tried it in {store.name}
            &apos;s own cart, it applied, and we check it again every week.
          </>
        ) : (
          "."
        )}
      </p>

      <Panel icon={Star} title={`What shoppers say about ${store.name}`} className="bg-[#fff7d6]" iconClass="bg-gold text-ink">
        {reviews ? (
          <ReviewSummary reviews={reviews} />
        ) : (
          <p className="text-sm leading-relaxed text-body">
            We couldn&apos;t find a review site with 10 or more reviews of {store.name} yet, so we don&apos;t show a rating. We&apos;ll add
            one as soon as there is.
          </p>
        )}
      </Panel>

      <Panel icon={ListOrdered} title={coupon.code ? `How to use your ${store.name} code` : `How to get this ${store.name} deal`} className={tone.tint} iconClass={tone.solid}>
        <ol className={cn("grid gap-2", steps.length > 1 && "sm:grid-cols-3")}>
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl bg-white/80 p-3 text-sm leading-relaxed text-body sm:flex-col sm:gap-2"
            >
              <span
                className={cn("grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-extrabold", tone.solid)}
              >
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </Panel>

      {coupon.description && (
        <Panel icon={Info} title="Good to know" className="bg-[#e6ecee]" iconClass="bg-ink text-white">
          <p className="text-[15px] leading-relaxed text-body">{coupon.description}</p>
        </Panel>
      )}

      <Link
        href={`/stores/${store.slug}`}
        className="group mt-6 flex items-center gap-3 rounded-2xl bg-ink p-4 text-white transition hover:bg-ink-soft"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-extrabold">All {store.name} promo codes</span>
          <span className="block text-sm text-white/75">Every {store.name} coupon and deal we have, on one page.</span>
        </span>
        <ArrowRight className="size-5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5" aria-hidden />
      </Link>
    </>
  );
}

function PayLessGuide() {
  return (
    <>
      <p className="text-[15px] leading-relaxed text-body sm:text-base">
        Small habits add up. These eight cost nothing, take a minute and work at almost any online store.
      </p>
      <ol className="mt-5 grid gap-3 sm:grid-cols-2">
        {TIPS.map((t, i) => {
          const tone = TONE_CYCLE[i % TONE_CYCLE.length];
          return (
            <li key={t.title} className={cn("flex gap-3 rounded-2xl p-3 ring-1 ring-black/5 sm:p-4", tone.tint)}>
              <span className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.photo} alt="" loading="lazy" className="size-16 rounded-xl object-cover sm:size-20" />
                <span
                  className={cn(
                    "absolute -left-1.5 -top-1.5 grid size-7 place-items-center rounded-full text-[13px] font-extrabold ring-2 ring-white",
                    tone.solid,
                  )}
                >
                  {i + 1}
                </span>
              </span>
              <div>
                <h2 className={cn("text-[15px] font-bold leading-snug", tone.text)}>{t.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-body">{t.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <Panel icon={ListChecks} title="Before you pay: a 30-second checklist" className="bg-brand-tint" iconClass="bg-brand text-white">
        <ul className="space-y-2">
          {CHECKLIST.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-[15px] text-body">
              <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

function HowToGuide() {
  return (
    <>
      <p className="text-[15px] leading-relaxed text-body sm:text-base">
        Using a code takes three steps. Here they are, and what to do if a code doesn&apos;t go through.
      </p>
      <div className="mt-5 overflow-hidden rounded-[20px] bg-gradient-to-br from-brand to-ink px-4 py-6 sm:px-8 sm:py-8">
        <CouponHowTo photo="/tips/cart.webp" kicker="3 steps" />
      </div>
      <Panel icon={Wrench} title="Code won't apply?" className="bg-[#fff7d6]" iconClass="bg-gold text-ink">
        <ul className="grid gap-2 sm:grid-cols-2">
          {TROUBLESHOOT.map((t) => (
            <li key={t.title} className="rounded-xl bg-white/80 p-3">
              <h3 className="text-[15px] font-bold text-[#8a5300]">{t.title}</h3>
              <p className="mt-0.5 text-sm leading-relaxed text-body">{t.body}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

export default async function SavingsPostPage({ params, searchParams }: Props) {
  const [{ slug }, { c }] = await Promise.all([params, searchParams]);
  const found = await savingsPost(slug);
  if (!found) {
    // Articles used to live at /savings-tips/<store>-promo-code.
    const old = slug.match(/^(.+)-promo-code$/);
    if (old) permanentRedirect(`/savings-tips/${savingsSlug(old[1])}`);
    notFound();
  }
  const { post, related } = found;
  const tone = postTone(post);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? [post.image] : undefined,
    author: { "@type": "Organization", name: SITE_NAME, url: siteUrl("/about") },
    publisher: { "@type": "Organization", name: SITE_NAME, url: siteUrl("/") },
    mainEntityOfPage: siteUrl(`/savings-tips/${post.slug}`),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className={cn("relative overflow-hidden bg-gradient-to-br text-white", tone.hero)}>
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div aria-hidden className="absolute -right-24 -top-24 size-80 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-28 -left-10 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="container-page relative py-5 sm:py-10">
          <div className="mx-auto max-w-5xl">
            <nav aria-label="Breadcrumb" className="truncate text-xs text-white/70">
              <Link href="/" className="hover:text-white hover:underline">
                Home
              </Link>
              <span aria-hidden> › </span>
              <Link href="/savings-tips" className="hover:text-white hover:underline">
                Savings Tips
              </Link>
              <span aria-hidden> › </span>
              <span className="text-white">{post.store?.name ?? "Guide"}</span>
            </nav>
            <div className={cn("mt-3 grid items-center gap-5 sm:gap-10", post.image && "sm:grid-cols-[1.3fr_1fr]")}>
              <div>
                <p className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
                  {postLabel(post)}
                  {post.kind === "deal" && <span className="text-gold">&nbsp;· Verified {post.coupon?.code ? "code" : "deal"}</span>}
                </p>
                <h1 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight text-white sm:text-[32px]">{post.title}</h1>
                <PostMeta post={post} onDark className="mt-2" />
                {post.kind === "deal" && <DealTicket post={post} />}
              </div>
              {post.image && (
                <div className="relative order-first sm:order-none">
                  <PostImage
                    post={post}
                    wide
                    className="aspect-[2/1] w-full rounded-2xl shadow-[0_24px_48px_-16px_rgb(0_0_0/0.6)] ring-4 ring-white/20 sm:aspect-[4/3] sm:rotate-2"
                  />
                  {post.kind === "deal" && <Sticker post={post} className="absolute -bottom-2.5 left-4 px-3 py-1.5 text-sm" />}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-b from-brand-tint to-canvas">
        <div className="container-page py-6 sm:py-10">
          <article className="mx-auto max-w-3xl">
            {post.kind === "deal" ? <DealArticle post={post} /> : post.slug === "ways-to-pay-less" ? <PayLessGuide /> : <HowToGuide />}
          </article>

          {related.length > 0 && (
            <section aria-labelledby="more-title" className="mx-auto mt-10 max-w-5xl">
              <h2 id="more-title" className="text-lg font-extrabold tracking-tight sm:text-xl">
                More savings tips
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {related.map((p, i) => (
                  <li key={p.slug} className={cn(i === 2 && "max-lg:hidden")}>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      <CouponReveal couponId={c} />
    </>
  );
}
