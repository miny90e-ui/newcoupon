import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="New Coupon home">
      <svg viewBox="0 0 64 64" className="size-9" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill={light ? "#ffffff" : "#0b2545"} />
        <path
          d="M14 22a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v5a5 5 0 0 0 0 10v5a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4v-5a5 5 0 0 0 0-10z"
          fill="#0a7d53"
        />
        <path d="m25 39 14-14" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="26" cy="26" r="2.6" fill="#fff" />
        <circle cx="38" cy="38" r="2.6" fill="#fff" />
      </svg>
      <span className="leading-none">
        <span className={`block text-lg font-extrabold tracking-tight ${light ? "text-white" : "text-ink"}`}>
          New Coupon
        </span>
        <span className={`block text-[11px] font-medium ${light ? "text-white/70" : "text-muted"}`}>
          Verified deals, every day
        </span>
      </span>
    </Link>
  );
}
