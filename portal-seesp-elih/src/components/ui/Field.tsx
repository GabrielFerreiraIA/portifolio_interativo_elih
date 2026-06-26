import { forwardRef } from "react";
import type { InputHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

const fieldBase =
  "w-full min-h-[48px] rounded-[10px] bg-white/[0.04] border border-platinum/15 px-4 py-3 text-sm text-platinum placeholder:text-platinum/40 transition-colors focus:outline-none focus:border-platinum/50 focus:bg-white/[0.06]";

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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-platinum/80">
        {label} {required && <span className="text-platinum/50">*</span>}
      </label>
      {children}
      {hint && !error && <span className="text-[11px] text-platinum/45">{hint}</span>}
      {error && (
        <span role="alert" className="text-[11px] text-platinum/90 flex items-center gap-1">
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-platinum/70" />
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
          className={cn(fieldBase, error && "border-platinum/60", className)}
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
        className={cn(fieldBase, "appearance-none bg-deep-navy", error && "border-platinum/60", className)}
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
