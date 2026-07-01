import {
  forwardRef,
  useId,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      hint,
      error,
      className,
      wrapperClassName,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;
    const describedBy =
      [ariaDescribedBy, hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("flex w-full flex-col gap-3", wrapperClassName)}>
        {label && (
          <label
            htmlFor={textareaId}
            className="font-subheading text-s3 font-semibold text-foreground"
          >
            {label}
          </label>
        )}

        {hint && (
          <p id={hintId} className="text-b2 text-foreground">
            {hint}
          </p>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            "min-h-[180px] w-full resize-y rounded-2xl border border-transparent bg-[rgba(41,0,75,0.25)] p-6 text-b1 text-foreground outline-none placeholder:text-white/50 hover:bg-[rgba(41,0,75,0.35)] focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-300",
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
  },
);
