import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "./category-icon";

// Per-category photo, accent colour and one-line mood. Photos live in /public/categories
// (free Unsplash licence). Categories added later fall back to a tinted icon tile.
const THEMES: Record<string, { accent: string; tint: string; tagline: string; photo?: string }> = {
  fashion: { accent: "#C2410C", tint: "#FFF3EB", tagline: "Style for less", photo: "/categories/fashion.webp" },
  beauty: { accent: "#BE185D", tint: "#FDEEF5", tagline: "Glow-up savings", photo: "/categories/beauty.webp" },
  electronics: { accent: "#1D4ED8", tint: "#EEF3FF", tagline: "Smarter tech deals", photo: "/categories/electronics.webp" },
  travel: { accent: "#0E7490", tint: "#E9F7FA", tagline: "Go further for less", photo: "/categories/travel.webp" },
  "home-garden": { accent: "#15803D", tint: "#ECF8F0", tagline: "Cozy home finds", photo: "/categories/home-garden.webp" },
  "food-dining": { accent: "#B45309", tint: "#FEF5E7", tagline: "Tasty savings", photo: "/categories/food-dining.webp" },
  "sports-outdoors": { accent: "#4D7C0F", tint: "#F2F9E8", tagline: "Gear up & go", photo: "/categories/sports-outdoors.webp" },
  "health-wellness": { accent: "#7C3AED", tint: "#F4EFFF", tagline: "Feel-good deals", photo: "/categories/health-wellness.webp" },
};
const FALLBACK = { accent: "#0A7D53", tint: "#E7F5EF", tagline: "Coupons & deals" };

type Category = { name: string; slug: string; icon: string | null; description?: string | null; _count?: { stores: number } };

export function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  const theme = { ...FALLBACK, ...THEMES[category.slug] };
  const stores = category._count?.stores ?? 0;
  // Phones: photo on top (more room, more mood). sm and up: the original single-row card.
  const media = large ? "size-20" : "aspect-[4/3] w-full sm:aspect-auto sm:size-14";
  return (
    <Link
      href={`/categories/${category.slug}`}
      style={{ "--accent": theme.accent, "--tint": theme.tint } as React.CSSProperties}
      className={`card group relative flex h-full gap-3 overflow-hidden p-3 ${large ? "items-center" : "flex-col sm:flex-row sm:items-center"} transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-lift)]`}
    >
      {/* soft colour wash on hover */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--tint)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <span className={`relative shrink-0 ${media}`}>
        <span className="block size-full overflow-hidden rounded-xl bg-[var(--tint)] sm:rounded-2xl">
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
            <span className="grid size-full place-items-center text-[var(--accent)]">
              <CategoryIcon name={category.icon} className="size-7" />
            </span>
          )}
        </span>
        {theme.photo && (
          <span className={`absolute grid size-7 ${large ? "-bottom-1 -right-1" : "bottom-2 right-2 sm:-bottom-1 sm:-right-1"} place-items-center rounded-full bg-[var(--accent)] text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-110`}>
            <CategoryIcon name={category.icon} className="size-3.5" />
          </span>
        )}
      </span>

      <span className="relative min-w-0 flex-1 px-1 pb-1 sm:p-0">
        <span className={`block font-bold leading-tight text-ink ${large ? "text-lg" : "text-[15px]"}`}>{category.name}</span>
        <span className="mt-0.5 block text-xs font-semibold text-[var(--accent)] sm:truncate sm:text-[13px]">{theme.tagline}</span>
        {large && category.description && <span className="mt-1 block text-sm text-muted">{category.description}</span>}
        {stores > 0 && (
          <span className="mt-0.5 block text-xs text-muted">
            {stores} {stores === 1 ? "store" : "stores"}
          </span>
        )}
      </span>

      <span className="relative hidden size-8 shrink-0 place-items-center rounded-full bg-canvas text-muted transition-colors duration-300 group-hover:bg-[var(--accent)] group-hover:text-white sm:grid">
        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
