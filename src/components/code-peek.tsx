import { cn } from "@/lib/utils";

/** "Get Code" button with the last characters of the code peeking out, the familiar coupon-site affordance. */
export function CodePeek({ type, code, className }: { type: "CODE" | "DEAL"; code?: string | null; className?: string }) {
  if (type === "DEAL" || !code) {
    return (
      <span className={cn("inline-flex min-h-11 items-center justify-center rounded-full bg-brand px-5 text-sm font-bold text-white transition-colors group-hover:bg-brand-hover", className)}>
        Get Deal
      </span>
    );
  }
  return (
    <span className={cn("relative inline-flex min-h-11 items-stretch overflow-hidden rounded-full border-2 border-dashed border-brand", className)}>
      <span className="flex items-center justify-end pl-10 pr-3 font-mono text-sm font-bold tracking-wider text-ink">
        {code.slice(-3)}
      </span>
      <span className="absolute inset-y-0 left-0 right-9 flex items-center justify-center rounded-r-[18px] bg-brand px-5 text-sm font-bold text-white transition-[right,background-color] duration-200 group-hover:right-11 group-hover:bg-brand-hover">
        Get Code
      </span>
    </span>
  );
}
