import type { Metadata } from "next";
import Link from "next/link";
import { savingsPosts } from "@/lib/savings-posts";
import { FeaturedPost, PostRow } from "@/components/savings-post-card";

export const metadata: Metadata = {
  title: "Savings Tips & Shopping Advice",
  description: "Tested promo codes, real shopper ratings and simple habits that cut the price of what you buy online.",
  alternates: { canonical: "/savings-tips" },
};

export default async function SavingsTipsPage() {
  const posts = await savingsPosts();
  // The top slot needs a photo; the first post that has one leads.
  const featured = posts.find((p) => p.image) ?? posts[0];
  const rest = posts.filter((p) => p !== featured);
  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <Link href="/" className="hover:text-ink hover:underline">Home</Link>
          <span aria-hidden> › </span>
          <span className="text-ink">Savings Tips</span>
        </nav>
        <h1 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Savings Tips & Shopping Advice</h1>
        <p className="mt-1 text-sm text-muted">
          Tested promo codes, real shopper ratings and simple habits that cut the price of what you buy.
        </p>

        {featured && (
          <div className="mt-5">
            <FeaturedPost post={featured} />
          </div>
        )}

        <ul className="mt-5 divide-y divide-line border-t border-line">
          {rest.map((p) => (
            <li key={p.slug}>
              <PostRow post={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
