import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">This page has expired — like a bad coupon</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Go home</Link>
        <Link href="/deals" className="btn-outline">Best deals</Link>
      </div>
    </div>
  );
}
