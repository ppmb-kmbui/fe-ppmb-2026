import type { HTMLAttributes } from "react";
import { FaCalendarDays } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface AgendaCardProps extends HTMLAttributes<HTMLElement> {
  category: string;
  title: string;
  date: string;
}

export function AgendaCard({
  category,
  title,
  date,
  className,
  ...props
}: AgendaCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[119px] items-center gap-6 rounded-2xl border border-white/10 bg-blue-200/25 px-6 py-4",
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-white" />
      <div className="flex min-w-0 flex-col">
        <p className="text-b3">{category}</p>
        <h3 className="font-subheading text-s3">{title}</h3>
        <p className="mt-1 flex items-center gap-2 text-b3">
          <FaCalendarDays aria-hidden="true" className="size-4" />
          {date}
        </p>
      </div>
    </article>
  );
}
