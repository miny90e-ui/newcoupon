"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/stores", label: "Stores" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Best Deals" },
];

export function MobileMenu({ signedIn, isAdmin }: { signedIn: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    ...LINKS,
    signedIn ? { href: "/account", label: "Saved coupons" } : { href: "/login", label: "Sign in" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin panel" }] : []),
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-white/10"
      >
        {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
      </button>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="absolute inset-x-0 top-16 border-t border-white/10 bg-ink pb-4 shadow-lg">
          <ul className="container-page flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex min-h-12 items-center border-b border-white/10 text-base font-semibold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
