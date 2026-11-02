/** Small server-rendered form field helpers for the admin panel. */

export function TextField({
  name, label, defaultValue, required, type = "text", hint, placeholder,
}: {
  name: string; label: string; defaultValue?: string | number | null; required?: boolean; type?: string; hint?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}{required && <span className="text-danger"> *</span>}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} placeholder={placeholder}
        aria-describedby={hint ? `${name}-hint` : undefined} className="input" />
      {hint && <p id={`${name}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextArea({ name, label, defaultValue, hint }: { name: string; label: string; defaultValue?: string | null; hint?: string }) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <textarea id={name} name={name} rows={3} defaultValue={defaultValue ?? ""} className="input py-2" aria-describedby={hint ? `${name}-hint` : undefined} />
      {hint && <p id={`${name}-hint`} className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function Checkbox({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm font-medium text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="size-5 accent-[#0c7a80]" />
      {label}
    </label>
  );
}

export function Select({
  name, label, options, defaultValue, required, empty,
}: {
  name: string; label: string; options: { value: string; label: string }[]; defaultValue?: string | null; required?: boolean; empty?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}{required && <span className="text-danger"> *</span>}</label>
      <select id={name} name={name} defaultValue={defaultValue ?? ""} required={required} className="input">
        {empty !== undefined && <option value="">{empty}</option>}
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function toDateInput(d: Date | null | undefined) {
  return d ? d.toISOString().slice(0, 10) : "";
}
