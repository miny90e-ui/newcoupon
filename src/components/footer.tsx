import Link from "next/link";
import { Logo } from "./logo";

const COLS = [
  {
    title: "Shop",
    links: [
      { href: "/stores", label: "All stores" },
      { href: "/categories", label: "Categories" },
      { href: "/deals", label: "Best deals" },
      { href: "/savings-tips", label: "Savings tips" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/contact", label: "Contact" },
      { href: "/disclosure", label: "Affiliate disclosure" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy policy" },
      { href: "/terms", label: "Terms of use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            New Coupon collects coupon codes and deals from stores across every category, so you can pay less
            for the things you already planned to buy.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">{c.title}</h2>
            <ul className="mt-3 space-y-1">
              {c.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-flex min-h-9 items-center text-sm hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} New Coupon. All rights reserved.</p>
          <p>
            We may earn a commission when you shop through our links.{" "}
            <Link href="/disclosure" className="underline underline-offset-2 hover:text-white">
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
