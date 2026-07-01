import type { DetailsHTMLAttributes, ReactNode } from "react";
import { FaChevronDown } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface DropdownProps
  extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, "title"> {
  title: ReactNode;
  children: ReactNode;
  contentClassName?: string;
}

export function Dropdown({
  title,
  children,
  className,
  contentClassName,
  ...props
}: DropdownProps) {
  return (
    <details className={cn("group w-full", className)} {...props}>
      <summary className="flex min-h-[75px] cursor-pointer list-none items-center justify-between rounded-2xl bg-purple-500/25 px-5 py-4 font-subheading text-s3 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <FaChevronDown
          aria-hidden="true"
          className="size-7 shrink-0 text-secondary transition-transform group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>

      <div
        className={cn(
          "mt-5 rounded-md border border-white/10 bg-blue-100/25 p-[21px] text-b1 text-foreground backdrop-blur-panel",
          contentClassName,
        )}
      >
        {children}
      </div>
    </details>
  );
}
