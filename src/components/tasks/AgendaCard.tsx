import type { HTMLAttributes, ReactNode } from "react";
import { FaCalendarDays } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface AgendaCardProps extends HTMLAttributes<HTMLElement> {
  category: string;
  title: string;
  date: string;
  icon?: ReactNode;
}

export function AgendaCard({
  category,
  title,
  date,
  icon,
  className,
  ...props
}: AgendaCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[91px] items-center gap-4 rounded-2xl border border-white/10 bg-blue-200/25 px-4 py-4 md:min-h-[119px] md:gap-6 md:px-6",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full bg-yellow-500 text-purple-900 md:size-10"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <p className="truncate text-b4 md:text-b3">{category}</p>
        <h3 className="truncate font-subheading text-s5 md:text-s3">{title}</h3>
        <p className="mt-1 flex items-center gap-2 text-b4 md:text-b3">
          <FaCalendarDays aria-hidden="true" className="size-3.5 md:size-4" />
          {date}
        </p>
      </div>
    </article>
  );
}
