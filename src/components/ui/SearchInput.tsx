import { forwardRef, type InputHTMLAttributes } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    { label = "Pencarian", className, id, ...props },
    ref,
  ) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "flex h-[62px] w-full items-center gap-4 rounded-2xl border border-blue-400 px-6 text-purple-200 focus-within:ring-2 focus-within:ring-yellow-400",
          className,
        )}
      >
        <span className="sr-only">{label}</span>
        <FaMagnifyingGlass aria-hidden="true" className="size-5 shrink-0 text-blue-300" />
        <input
          ref={ref}
          id={id}
          type="search"
          className="min-w-0 flex-1 bg-transparent text-b1 text-foreground outline-none placeholder:text-purple-200"
          {...props}
        />
      </label>
    );
  },
);
