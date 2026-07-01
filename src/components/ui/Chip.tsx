import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: ReactNode;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected = false, children, className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-[45px] min-w-[139px] items-center justify-center rounded-2xl px-6 text-b2 text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        selected ? "bg-purple-300/50" : "bg-[#683592]/25 hover:bg-purple-300/30",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
