import type { HTMLAttributes } from "react";

import { ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface QuotaCardProps extends HTMLAttributes<HTMLElement> {
  label: string;
  completed: number;
  total: number;
}

export function QuotaCard({
  label,
  completed,
  total,
  className,
  ...props
}: QuotaCardProps) {
  const safeTotal = total > 0 ? total : 0;
  const safeCompleted = Math.min(Math.max(completed, 0), safeTotal);
  const percentage = safeTotal ? Math.round((safeCompleted / safeTotal) * 100) : 0;

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-3 rounded-md border border-white/10 bg-blue-200/25 p-[21px]",
        className,
      )}
      {...props}
    >
      <h3 className="font-subheading text-s3 font-semibold">{label}</h3>
      <ProgressBar value={safeCompleted} max={safeTotal || 1} label={`Kuota ${label}`} glow />
      <div className="flex items-center justify-between text-b3">
        <span>
          {safeCompleted}/{safeTotal} Selesai
        </span>
        <span>{percentage}%</span>
      </div>
    </article>
  );
}
