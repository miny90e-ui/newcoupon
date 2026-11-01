"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Coupon-site convention: the code opens in a new tab (this page with ?c=<id>),
 * while the current tab goes on to the store through our affiliate redirect.
 * If the browser blocks the new tab, we just show the code here.
 */
export function RevealTrigger({
  couponId,
  className,
  children,
  label,
}: {
  couponId: string;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onClick() {
    const next = new URLSearchParams(params.toString());
    next.set("c", couponId);
    const revealUrl = `${pathname}?${next.toString()}`;
    const tab = window.open(revealUrl, "_blank");
    if (tab) {
      window.location.href = `/go/${couponId}`;
    } else {
      router.push(revealUrl, { scroll: false });
    }
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {children}
    </button>
  );
}
