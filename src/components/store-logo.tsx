import { cn, monogram } from "@/lib/utils";

/** Store logo, or a coloured monogram tile when no logo has been uploaded. */
export function StoreLogo({
  name,
  logoUrl,
  className,
}: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={`${name} logo`} loading="lazy" className={cn("object-contain", className)} />
    );
  }
  const m = monogram(name);
  return (
    <div
      role="img"
      aria-label={`${name} logo`}
      className={cn("grid place-items-center rounded-xl font-extrabold tracking-tight text-white", className)}
      style={{ backgroundColor: m.color }}
    >
      <span className="text-[min(2.2em,40px)]">{m.letters}</span>
    </div>
  );
}
