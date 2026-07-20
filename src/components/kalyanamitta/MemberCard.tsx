import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MemberCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  batch: string | number;
  avatar?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isActionLoading?: boolean;
  isActionDisabled?: boolean;
  isSecondaryActionDisabled?: boolean;
}

export function MemberCard({
  name,
  batch,
  avatar,
  actionLabel = "Kenalan",
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  isActionLoading = false,
  isActionDisabled = false,
  isSecondaryActionDisabled = false,
  className,
  ...props
}: MemberCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[144px] w-full items-center gap-3 rounded-3xl border border-white/10 bg-blue-200/25 p-4 lg:min-h-[164px] lg:gap-4",
        className,
      )}
      {...props}
    >
      <div
        data-testid="member-avatar"
        className="grid size-28 shrink-0 place-items-center overflow-hidden rounded-2xl bg-background lg:h-[132px] lg:w-[42%] lg:rounded-xl"
      >
        {avatar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-3 lg:gap-5">
        <div className="min-w-0 max-w-full">
          <h3 className="break-words font-subheading text-s4 leading-tight sm:text-s3">
            {name}
          </h3>
          <p className="mt-2 text-b3">Angkatan {batch}</p>
        </div>
        <div className="flex w-full flex-wrap gap-2">
          <button
            type="button"
            onClick={onAction}
            disabled={isActionLoading || isActionDisabled || !onAction}
            className="min-h-[43px] min-w-[116px] flex-1 rounded-2xl bg-purple-600 px-4 py-2.5 text-b3 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isActionLoading ? "Memproses..." : actionLabel}
          </button>
          {secondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              disabled={isSecondaryActionDisabled || !onSecondaryAction}
              className="min-h-[43px] min-w-[116px] flex-1 rounded-2xl border border-yellow-100/60 bg-yellow-100/10 px-4 py-2.5 text-b3 text-yellow-50 transition-colors hover:bg-yellow-100/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {secondaryActionLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
