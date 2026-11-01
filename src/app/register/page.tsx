import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSession()) redirect("/account");
  return (
    <div className="container-page flex justify-center py-14">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold">Create your account</h1>
        <p className="mt-1 mb-6 text-sm text-muted">Save coupons and come back to them any time. Free, no spam.</p>
        <AuthForm mode="register" next={next} />
      </div>
    </div>
  );
}
