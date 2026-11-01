"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import type { FormState } from "@/app/admin/actions";

/** Wraps an admin form: submits to a server action and shows its error / success message. */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  className,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className={className ?? "space-y-5"}>
      {state?.ok && <p role="status" className="rounded-lg bg-brand-tint px-3 py-2.5 text-sm font-medium text-ink">{state.ok}</p>}
      {state?.error && <p role="alert" className="whitespace-pre-line rounded-lg bg-red-50 px-3 py-2.5 text-sm text-danger">{state.error}</p>}
      {children}
      <button className="btn-primary" disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

export function ConfirmButton({ label = "Delete", message }: { label?: string; message: string }) {
  return (
    <button
      className="btn border border-red-200 bg-surface text-danger hover:bg-red-50"
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
