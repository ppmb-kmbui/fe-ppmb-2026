import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  label?: string;
  glow?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label = "Progres",
  glow = false,
  className,
  ...props
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      className={cn("h-2 w-full overflow-hidden rounded-md bg-purple-900", className)}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-[inherit] bg-yellow-400 transition-[width] duration-300 motion-reduce:transition-none",
          glow && "shadow-glow-strong",
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
