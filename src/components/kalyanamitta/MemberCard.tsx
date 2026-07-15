import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MemberCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  batch: string | number;
  avatar?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  isActionLoading?: boolean;
  isActionDisabled?: boolean;
}

export function MemberCard({
  name,
  batch,
  avatar,
  actionLabel = "Kenalan",
  onAction,
  isActionLoading = false,
  isActionDisabled = false,
  className,
  ...props
}: MemberCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[164px] w-full items-center gap-4 rounded-3xl border border-white/10 bg-blue-200/25 p-4",
        className,
      )}
      {...props}
    >
      <div className="grid h-[132px] w-[42%] shrink-0 place-items-center overflow-hidden rounded-xl bg-background">
        {avatar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-6">
        <div className="min-w-0 max-w-full">
          <h3 className="break-words font-subheading text-s4 leading-tight sm:text-s3">
            {name}
          </h3>
          <p className="mt-2 text-b3">Angkatan {batch}</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          disabled={isActionLoading || isActionDisabled || !onAction}
          className="min-h-[45px] w-[139px] rounded-2xl bg-purple-600 px-6 py-2.5 text-b2 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isActionLoading ? "Memproses..." : actionLabel}
        </button>
      </div>
    </article>
  );
}
