import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "./category-icon";

// Per-category photo and one-line mood. Photos live in /public/categories (free Unsplash licence).
// Colours stay within the brand's three: navy text, green accent, grey secondary text.
const THEMES: Record<string, { tagline: string; photo?: string }> = {
  fashion: { tagline: "Style for less", photo: "/categories/fashion.webp" },
  beauty: { tagline: "Glow-up savings", photo: "/categories/beauty.webp" },
  electronics: { tagline: "Smarter tech deals", photo: "/categories/electronics.webp" },
  travel: { tagline: "Go further for less", photo: "/categories/travel.webp" },
  "home-garden": { tagline: "Cozy home finds", photo: "/categories/home-garden.webp" },
  "food-dining": { tagline: "Tasty savings", photo: "/categories/food-dining.webp" },
  "sports-outdoors": { tagline: "Gear up & go", photo: "/categories/sports-outdoors.webp" },
  "health-wellness": { tagline: "Feel-good deals", photo: "/categories/health-wellness.webp" },
};
const FALLBACK = { tagline: "Coupons & deals" };

/** The mood photo for a category, if it has one. */
export function categoryPhoto(slug: string | null | undefined) {
  return (slug && THEMES[slug]?.photo) || null;
}

type Category = { name: string; slug: string; icon: string | null; description?: string | null; _count?: { stores: number } };

export function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  const theme = { ...FALLBACK, ...THEMES[category.slug] };
  const stores = category._count?.stores ?? 0;
  // Phones: photo on top (more room, more mood). sm and up: the original single-row card.
  const media = large ? "size-20" : "aspect-[4/3] w-full sm:aspect-auto sm:size-14";
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`card group relative flex h-full gap-3 overflow-hidden p-3 ${large ? "items-center" : "flex-col sm:flex-row sm:items-center"} transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-lift)]`}
    >
      {/* soft colour wash on hover */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-tint to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className={`relative shrink-0 ${media}`}>
        <span className="block size-full overflow-hidden rounded-xl bg-brand-tint sm:rounded-2xl">
          {theme.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={theme.photo}
              alt=""
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          ) : (
            <span className="grid size-full place-items-center text-brand">
              <CategoryIcon name={category.icon} className="size-7" />
            </span>
          )}
        </span>
        {theme.photo && (
          <span className={`absolute grid size-7 ${large ? "-bottom-1 -right-1" : "bottom-2 right-2 sm:-bottom-1 sm:-right-1"} place-items-center rounded-full bg-brand text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-110`}>
            <CategoryIcon name={category.icon} className="size-3.5" />
          </span>
        )}
      </span>

      <span className="relative min-w-0 flex-1 px-1 pb-1 sm:p-0">
        <span className={`block font-bold leading-tight text-ink ${large ? "text-lg" : "text-[15px]"}`}>{category.name}</span>
        <span className="mt-0.5 block text-xs font-medium text-muted sm:truncate sm:text-[13px]">{theme.tagline}</span>
        {large && category.description && <span className="mt-1 block text-sm text-muted">{category.description}</span>}
        {stores > 0 && (
          <span className="mt-0.5 block text-xs text-muted">
            {stores} {stores === 1 ? "store" : "stores"}
          </span>
        )}
      </span>

      <span className="relative hidden size-8 shrink-0 place-items-center rounded-full bg-canvas text-muted transition-colors duration-300 group-hover:bg-brand group-hover:text-white sm:grid">
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
