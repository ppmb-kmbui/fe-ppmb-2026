"use client";

import { forwardRef, useId, type ReactNode, type SelectHTMLAttributes } from "react";

import { FACULTIES } from "@/lib/faculty";
import { cn } from "@/lib/cn";

export interface FacultySelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label: ReactNode;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const FacultySelect = forwardRef<HTMLSelectElement, FacultySelectProps>(
  function FacultySelect(
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
          className="font-subheading text-s5 font-semibold text-foreground sm:text-s3"
        >
          {label}
        </label>

        {hint && (
          <p id={hintId} className="text-b2 text-foreground">
            {hint}
          </p>
        )}

        <select
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-[50px] w-full rounded-2xl border border-transparent bg-[rgba(140,88,183,0.3)] px-6 font-body text-b3 text-purple-50 outline-none hover:bg-[rgba(140,88,183,0.4)] focus:border-purple-200 focus:bg-[rgba(140,88,183,0.6)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-300 sm:text-b1",
            className,
          )}
          {...props}
        >
          <option value="" className="bg-purple-950 text-purple-50">
            Pilih fakultas
          </option>
          {FACULTIES.map((faculty) => (
            <option
              key={faculty}
              value={faculty}
              className="bg-purple-950 text-purple-50"
            >
              {faculty}
            </option>
          ))}
        </select>

        {error && (
          <p id={errorId} role="alert" className="text-b2 text-red-300">
            {error}
          </p>
        )}
      </div>
    );
  },
);
