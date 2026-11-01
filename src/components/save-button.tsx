"use client";

import { useOptimistic, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleSaved } from "@/app/actions/saved";
import { cn } from "@/lib/utils";

export function SaveButton({ couponId, saved, className }: { couponId: string; saved: boolean; className?: string }) {
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <button
      type="button"
      aria-pressed={optimistic}
      aria-label={optimistic ? "Remove from saved coupons" : "Save coupon"}
      title={optimistic ? "Saved" : "Save for later"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          setOptimistic(!optimistic);
          const res = await toggleSaved(couponId);
          if (res.needsLogin) router.push(`/login?next=${encodeURIComponent(pathname)}`);
        })
      }
      className={cn(
        "grid size-11 cursor-pointer place-items-center rounded-full bg-surface/90 transition-colors",
        optimistic ? "text-danger" : "text-muted hover:text-danger",
        className
      )}
    >
      <Heart className={cn("size-5", optimistic && "fill-current")} aria-hidden />
    </button>
  );
}
