"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, ExternalLink, X } from "lucide-react";
import { StoreLogo } from "./store-logo";

type Props = {
  id: string;
  title: string;
  code: string | null;
  storeName: string;
  storeLogo: string | null;
  storeSlug: string;
  description: string | null;
  expires: string | null;
};

export function CouponModal(p: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  function close() {
    setOpen(false);
    const next = new URLSearchParams(params.toString());
    next.delete("c");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function copy() {
    if (!p.code) return;
    try {
      await navigator.clipboard.writeText(p.code);
    } catch {
      const el = document.getElementById("coupon-code-text");
      if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={close}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="coupon-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-t-3xl bg-surface p-6 pb-8 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 grid size-11 cursor-pointer place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink"
        >
          <X className="size-5" aria-hidden />
        </button>
        <div className="flex flex-col items-center text-center">
          <StoreLogo name={p.storeName} logoUrl={p.storeLogo} className="size-16 text-lg" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">{p.storeName}</p>
          <h2 id="coupon-modal-title" className="mt-1 text-xl font-bold leading-snug sm:text-2xl">
            {p.title}
          </h2>
          {p.description && <p className="mt-2 text-sm text-muted">{p.description}</p>}

          {p.code ? (
            <>
              <p className="mt-6 text-sm text-muted">Copy this code and paste it at checkout</p>
              <div className="mt-2 flex w-full items-stretch overflow-hidden rounded-full border-2 border-dashed border-brand">
                <span id="coupon-code-text" className="flex flex-1 items-center justify-center px-4 py-3 font-mono text-xl font-bold tracking-[0.15em] text-ink select-all">
                  {p.code}
                </span>
                <button type="button" onClick={copy} className="inline-flex min-w-28 cursor-pointer items-center justify-center gap-1.5 bg-brand px-5 text-sm font-bold text-white hover:bg-brand-hover">
                  {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p role="status" aria-live="polite" className="sr-only">
                {copied ? "Code copied to clipboard" : ""}
              </p>
            </>
          ) : (
            <p className="mt-6 rounded-xl bg-brand-tint px-4 py-3 text-sm font-medium text-ink">
              No code needed — the discount is applied automatically on the store&apos;s site.
            </p>
          )}

          <a href={`/go/${p.id}`} target="_blank" rel="nofollow sponsored noopener" className="btn-ink mt-5 w-full">
            Go to {p.storeName} <ExternalLink className="size-4" aria-hidden />
          </a>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 text-xs text-muted">
            {p.expires && <span>Expires {p.expires}</span>}
            <a href={`/stores/${p.storeSlug}`} className="underline underline-offset-2 hover:text-ink">
              More {p.storeName} coupons
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
