"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    id,
    label,
    error,
    hint,
    className,
    wrapperClassName,
    "aria-describedby": ariaDescribedBy,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy =
    [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex w-full flex-col gap-3", wrapperClassName)}>
      <label
        htmlFor={inputId}
        className="font-subheading text-s3 font-semibold text-foreground"
      >
        {label}
      </label>

      {hint && (
        <p id={hintId} className="text-b2 text-foreground">
          {hint}
        </p>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          "h-[50px] w-full rounded-2xl border border-transparent bg-[rgba(140,88,183,0.3)] px-6 font-body text-b3 text-purple-50 outline-none placeholder:text-purple-200 hover:bg-[rgba(140,88,183,0.4)] focus:border-purple-200 focus:bg-[rgba(140,88,183,0.6)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-300 sm:text-b1",
          className,
        )}
        {...props}
      />

      {error && (
        <p id={errorId} role="alert" className="text-b2 text-red-300">
          {error}
        </p>
      )}
    </div>
  );
});
