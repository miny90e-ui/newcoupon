"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, destroySession } from "@/lib/session";
import { clearFailures, recordFailure, tooManyAttempts } from "@/lib/rate-limit";

export type AuthState = { error?: string; fieldErrors?: Record<string, string>; email?: string; name?: string } | undefined;

/** Only allow redirects back into this site. */
function safeNext(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}

const registerSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(80),
  email: z.email("Enter a valid email address").trim().toLowerCase(),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export async function register(_: AuthState, form: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    password: form.get("password"),
  });
  const echo = { email: String(form.get("email") ?? ""), name: String(form.get("name") ?? "") };
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] ??= issue.message;
    return { fieldErrors, ...echo };
  }
  const { name, email, password } = parsed.data;
  if (await db.user.findUnique({ where: { email } })) {
    return { fieldErrors: { email: "An account with this email already exists. Try signing in." }, ...echo };
  }
  const user = await db.user.create({
    data: { name, email, passwordHash: await bcrypt.hash(password, 12) },
  });
  await createSession({ userId: user.id, role: user.role });
  redirect(safeNext(form.get("next")));
}

export async function login(_: AuthState, form: FormData): Promise<AuthState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${email}`;
  if (tooManyAttempts(key)) return { error: "Too many attempts. Please wait 15 minutes and try again.", email };
  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!user || !ok) {
    recordFailure(key);
    return { error: "Email or password is incorrect.", email };
  }
  clearFailures(key);
  await createSession({ userId: user.id, role: user.role });
  const next = safeNext(form.get("next"));
  redirect(user.role === "ADMIN" && next === "/account" ? "/admin" : next);
}

export async function logout() {
  await destroySession();
  redirect("/");
}
