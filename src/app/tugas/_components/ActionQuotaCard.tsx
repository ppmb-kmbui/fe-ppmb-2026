import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { ProgressBar } from "@/components";
import { cn } from "@/lib/cn";

export interface ActionQuotaCardProps extends HTMLAttributes<HTMLElement> {
  label: string;
  completed: number;
  total: number;
  href: string;
  icon?: ReactNode;
}

export function ActionQuotaCard({
  label,
  completed,
  total,
  href,
  icon,
  className,
  ...props
}: ActionQuotaCardProps) {
  const safeTotal = total > 0 ? total : 1;
  const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);
  const percentage = Math.round((safeCompleted / safeTotal) * 100);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-md border border-white/10 bg-blue-200/25 p-[21px] backdrop-blur-sm sm:flex-row sm:items-end",
        className,
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-yellow-500 text-purple-900">
              {icon}
            </span>
          )}
          <h2 className="font-subheading text-s3 font-semibold">{label}</h2>
        </div>
        <ProgressBar
          value={safeCompleted}
          max={safeTotal}
          label={`Progress ${label}`}
          glow
          className="mt-3"
        />
        <div className="mt-2 flex items-center justify-between text-b3">
          <span>
            {safeCompleted}/{safeTotal} Completed
          </span>
          <span>{percentage}%</span>
        </div>
      </div>
      <Link
        href={href}
        className="inline-flex h-[50px] w-full items-center justify-center rounded-2xl bg-primary px-6 text-b1 text-yellow-50 transition-colors hover:bg-primary-hover sm:w-32"
      >
        Kerjakan
      </Link>
    </article>
  );
}
