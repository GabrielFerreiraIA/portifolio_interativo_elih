import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

const fieldBase =
  "w-full min-h-[48px] rounded-md bg-white border border-neutral-300 px-4 py-3 text-sm text-navy-950 placeholder:text-neutral-400 transition-all focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:opacity-50";

function Wrapper({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 text-left font-sans">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-navy-950">
        {label} {required && <span className="text-danger-500">*</span>}
      </label>
      {children}
      {hint && !error && <span className="text-[11px] text-neutral-500">{hint}</span>}
      {error && (
        <span role="alert" className="text-[11px] font-semibold text-danger-500 flex items-center gap-1">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-danger-500" />
          {error}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, required, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name ?? label;
    return (
      <Wrapper label={label} htmlFor={fieldId} required={required} error={error} hint={hint}>
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={Boolean(error)}
          className={cn(fieldBase, error && "border-danger-500 focus:ring-danger-100 focus:border-danger-500", className)}
          {...props}
        />
      </Wrapper>
    );
  }
);
TextField.displayName = "TextField";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  error,
  hint,
  required,
  id,
  options,
  placeholder,
  className,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <Wrapper label={label} htmlFor={fieldId} required={required} error={error} hint={hint}>
      <select
        id={fieldId}
        aria-invalid={Boolean(error)}
        className={cn(fieldBase, "appearance-none bg-white", error && "border-danger-500 focus:ring-danger-100 focus:border-danger-500", className)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Wrapper>
  );
}
