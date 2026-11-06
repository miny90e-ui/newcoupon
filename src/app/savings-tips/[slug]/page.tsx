import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { savingsPost, type SavingsPost } from "@/lib/savings-posts";
import { CHECKLIST, TIPS, TROUBLESHOOT } from "@/config/savings-guides";
import { PostImage, PostMeta, PostRow } from "@/components/savings-post-card";
import { ReviewSummary } from "@/components/shopper-reviews";
import { CouponHowTo } from "@/components/coupon-how-to";
import { CouponReveal } from "@/components/coupon-reveal";
import { RevealTrigger } from "@/components/reveal-trigger";
import { StoreLogo } from "@/components/store-logo";

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

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-lg font-extrabold tracking-tight text-ink sm:text-xl">{children}</h2>;
}

function DealArticle({ post }: { post: SavingsPost }) {
  const { store, coupon, reviews } = post;
  if (!store || !coupon) return null;
  const words = post.offer ?? coupon.title;
  const offer = words.charAt(0).toLowerCase() + words.slice(1);
  return (
    <>
      <p className="mt-5 text-[15px] leading-relaxed text-body sm:text-base">
        Right now you can get {offer} at {store.name}
        {coupon.code ? (
          <>
            {" "}with code <strong className="font-mono text-ink">{coupon.code}</strong>. We tried it in {store.name}&apos;s own
            cart, it applied, and we check it again every week.
          </>
        ) : (
          "."
        )}
      </p>

      <div className="card mt-5 flex items-center gap-3 p-4">
        <StoreLogo name={store.name} logoUrl={store.logoUrl} className="size-12 shrink-0 rounded-lg text-xs" />
        <div className="min-w-0 flex-1">
          {coupon.discountLabel && <p className="text-xs font-extrabold uppercase text-brand">{coupon.discountLabel}</p>}
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-ink">{coupon.title}</p>
        </div>
        <RevealTrigger
          couponId={coupon.id}
          label={`${coupon.code ? "Get code" : "Get deal"}: ${store.name} — ${coupon.title}`}
          className="btn-primary min-h-10 shrink-0 px-4"
        >
          {coupon.code ? "Get Code" : "Get Deal"}
        </RevealTrigger>
      </div>

      <H2>What shoppers say about {store.name}</H2>
      <div className="mt-3">
        {reviews ? (
          <ReviewSummary reviews={reviews} />
        ) : (
          <p className="text-sm leading-relaxed text-body">
            We couldn&apos;t find a review site with 10 or more reviews of {store.name} yet, so we don&apos;t show a rating.
            We&apos;ll add one as soon as there is.
          </p>
        )}
      </div>

      <H2>How to use your {store.name} code</H2>
      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-relaxed text-body marker:font-bold marker:text-brand">
        <li>Tap <strong>{coupon.code ? "Get Code" : "Get Deal"}</strong> above. {store.name} opens in a new tab{coupon.code ? " and the code is shown here" : ""}.</li>
        {coupon.code && <li>Copy the code and add what you want to your {store.name} cart.</li>}
        {coupon.code && <li>Paste it in the discount or promo code box at checkout and apply it.</li>}
      </ol>

      {coupon.description && (
        <>
          <H2>Good to know</H2>
          <p className="mt-3 text-[15px] leading-relaxed text-body">{coupon.description}</p>
        </>
      )}
    </>
  );
}

function PayLessGuide() {
  return (
    <>
      <p className="mt-5 text-[15px] leading-relaxed text-body sm:text-base">
        Small habits add up. These eight cost nothing, take a minute and work at almost any online store.
      </p>
      <ol className="mt-5 space-y-4">
        {TIPS.map((t, i) => (
          <li key={t.title} className="flex gap-3 sm:gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={t.photo} alt="" loading="lazy" className="size-16 shrink-0 rounded-xl object-cover sm:size-20" />
            <div>
              <h2 className="text-[15px] font-bold leading-snug text-ink sm:text-base">
                {i + 1}. {t.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-body">{t.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <H2>Before you pay: a 30-second checklist</H2>
      <ul className="mt-3 space-y-2">
        {CHECKLIST.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[15px] text-body">
            <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-brand" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

function HowToGuide() {
  return (
    <>
      <p className="mt-5 text-[15px] leading-relaxed text-body sm:text-base">
        Using a code takes three steps. Here they are, and what to do if a code doesn&apos;t go through.
      </p>
      <div className="mt-5 overflow-hidden rounded-[20px] bg-brand px-4 py-6 sm:px-8 sm:py-8">
        <CouponHowTo photo="/tips/cart.webp" kicker="3 steps" />
      </div>
      <H2>Code won&apos;t apply?</H2>
      <ul className="mt-3 space-y-3">
        {TROUBLESHOOT.map((t) => (
          <li key={t.title}>
            <h3 className="text-[15px] font-bold text-ink">{t.title}</h3>
            <p className="mt-0.5 text-sm leading-relaxed text-body">{t.body}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default async function SavingsPostPage({ params, searchParams }: Props) {
  const [{ slug }, { c }] = await Promise.all([params, searchParams]);
  const found = await savingsPost(slug);
  if (!found) notFound();
  const { post, related } = found;

  return (
    <div className="container-page py-6 sm:py-10">
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="truncate text-xs text-muted">
          <Link href="/" className="hover:text-ink hover:underline">Home</Link>
          <span aria-hidden> › </span>
          <Link href="/savings-tips" className="hover:text-ink hover:underline">Savings Tips</Link>
          <span aria-hidden> › </span>
          <span className="text-ink">{post.store?.name ?? "Guide"}</span>
        </nav>
        <h1 className="mt-2 text-[22px] font-extrabold leading-tight tracking-tight sm:text-3xl">{post.title}</h1>
        <PostMeta post={post} className="mt-2" />
        {post.image && <PostImage post={post} wide className="mt-4 aspect-[2/1] w-full rounded-2xl bg-brand-tint" />}

        {post.kind === "deal" ? <DealArticle post={post} /> : post.slug === "ways-to-pay-less" ? <PayLessGuide /> : <HowToGuide />}

        {related.length > 0 && (
          <section aria-labelledby="more-title" className="mt-10">
            <h2 id="more-title" className="text-lg font-extrabold tracking-tight text-ink">More savings tips</h2>
            <ul className="mt-2 divide-y divide-line border-t border-line">
              {related.map((p) => (
                <li key={p.slug}>
                  <PostRow post={p} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <CouponReveal couponId={c} />
    </div>
  );
}
