import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type FieldBase = {
  label?: string;
  hint?: string;
  invalid?: boolean;
  containerClassName?: string;
};

type InputFieldProps = FieldBase &
  React.InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaFieldProps = FieldBase &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type FieldProps = InputFieldProps | TextareaFieldProps;

const baseInput =
  "w-full rounded-tile border bg-ink/45 px-4 text-[15px] text-copy placeholder:text-copy-muted/70 transition duration-200 ease-[var(--ease-out)] focus:outline-none focus:bg-ink/65 focus:border-copy/55";

export const Field = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FieldProps
>(function Field(
  { label, hint, invalid, containerClassName, className, id, ...rest },
  ref,
) {
  const fieldId =
    id ?? (label ? `field-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label ? (
        <label
          htmlFor={fieldId}
          className="text-[12px] font-semibold tracking-[0.12em] uppercase text-copy-muted"
        >
          {label}
        </label>
      ) : null}
      {rest.multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          id={fieldId}
          className={cn(
            baseInput,
            "min-h-32 resize-none py-3",
            invalid ? "border-coral" : "border-line",
            className,
          )}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={fieldId}
          className={cn(
            baseInput,
            "min-h-12",
            invalid ? "border-coral" : "border-line",
            className,
          )}
          {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {hint ? (
        <p
          className={cn(
            "text-[12px] leading-5",
            invalid ? "text-coral" : "text-copy-faint",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
});
