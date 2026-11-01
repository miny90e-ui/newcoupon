import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSession()) redirect(next?.startsWith("/") ? next : "/account");
  return (
    <div className="container-page flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold">Sign in</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Sign in to see the coupons you saved.</p>
        <AuthForm mode="login" next={next} />
      </div>
    </div>
  );
}
