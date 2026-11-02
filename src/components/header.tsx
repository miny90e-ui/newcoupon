import Link from "next/link";
import { Search, User, Heart, LayoutDashboard } from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { StoreSearch } from "./store-search";

export const NAV = [
  { href: "/stores", label: "Stores" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Best Deals" },
  { href: "/savings-tips", label: "Savings Tips" },
];

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <div className="container-page flex h-16 items-center gap-6">
        <Logo light />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="rounded-full px-3.5 py-2 text-[15px] font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <StoreSearch size="sm" placeholder="Search stores or brands" className="ml-auto hidden flex-1 lg:block lg:max-w-sm" />
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/search"
            className="grid size-11 place-items-center rounded-full hover:bg-white/10 lg:hidden"
            aria-label="Search"
          >
            <Search className="size-5" aria-hidden />
          </Link>
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hidden size-11 place-items-center rounded-full hover:bg-white/10 sm:grid" aria-label="Admin panel" title="Admin panel">
              <LayoutDashboard className="size-5" aria-hidden />
            </Link>
          )}
          {user ? (
            <Link href="/account" className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-white/10 sm:flex">
              <Heart className="size-5" aria-hidden />
              Saved
            </Link>
          ) : (
            <Link href="/login" className="hidden min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold hover:bg-white/10 sm:flex">
              <User className="size-5" aria-hidden />
              Sign in
            </Link>
          )}
          <MobileMenu signedIn={!!user} isAdmin={user?.role === "ADMIN"} />
        </div>
      </div>
    </header>
  );
}
