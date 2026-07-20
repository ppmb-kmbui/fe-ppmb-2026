import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export type SubmissionStatus = "submitted" | "not-submitted";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: SubmissionStatus;
}

export function StatusBadge({
  status,
  className,
  ...props
}: StatusBadgeProps) {
  const isSubmitted = status === "submitted";

  return (
    <span
      role="status"
      className={cn(
        "inline-flex min-h-[45px] items-center justify-center rounded-2xl border px-3 py-2.5 text-b2 text-foreground",
        isSubmitted
          ? "border-green-400 bg-green-200/50"
          : "border-red-400 bg-red-100/50",
        className,
      )}
      {...props}
    >
      {isSubmitted ? "Sudah Dikumpulkan" : "Belum Dikumpulkan"}
    </span>
  );
}
