export function ProsePage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div className="container-page py-12">
      <article className="card mx-auto max-w-3xl p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {updated && <p className="mt-2 text-sm text-muted">Last updated {updated}</p>}
        <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-body [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_a]:font-medium [&_a]:text-brand [&_a]:underline">
          {children}
        </div>
      </article>
    </div>
  );
}
