"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { login, register, type AuthState } from "@/app/actions/auth";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(mode === "login" ? login : register, undefined);
  const fe = state?.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next ?? ""} />
      {state?.error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}
      {mode === "register" && (
        <Field id="name" label="Name" autoComplete="name" defaultValue={state?.name} error={fe.name} />
      )}
      <Field id="email" label="Email" type="email" autoComplete="email" defaultValue={state?.email} error={fe.email} />
      <Field
        id="password"
        label="Password"
        type="password"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        hint={mode === "register" ? "At least 8 characters." : undefined}
        error={fe.password}
      />
      <button className="btn-primary w-full" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "login" ? (
          <>New here? <Link className="link" href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Create an account</Link></>
        ) : (
          <>Already have an account? <Link className="link" href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}>Sign in</Link></>
        )}
      </p>
    </form>
  );
}

function Field({
  id, label, type = "text", autoComplete, defaultValue, error, hint,
}: {
  id: string; label: string; type?: string; autoComplete?: string; defaultValue?: string; error?: string; hint?: string;
}) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input
        id={id} name={id} type={type} autoComplete={autoComplete} defaultValue={defaultValue} required
        aria-invalid={!!error} aria-describedby={describedBy}
        className={`input ${error ? "border-danger" : ""}`}
      />
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
