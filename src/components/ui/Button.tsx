import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      className,
      disabled = false,
      isLoading = false,
      type = "button",
      ...props
    },
    ref,
  ) {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex h-[63px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-subheading text-s3 font-semibold leading-none text-yellow-50 transition-colors hover:bg-primary-hover hover:text-yellow-100 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        {isLoading && (
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
          />
        )}
        <span>{children}</span>
      </button>
    );
  },
);
