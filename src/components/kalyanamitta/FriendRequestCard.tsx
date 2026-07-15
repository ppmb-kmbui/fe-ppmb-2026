import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface FriendRequestCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  batch: string | number;
  avatar?: ReactNode;
  onAccept?: () => void;
  onReject?: () => void;
  isLoading?: boolean;
}

export function FriendRequestCard({
  name,
  batch,
  avatar,
  onAccept,
  onReject,
  isLoading = false,
  className,
  ...props
}: FriendRequestCardProps) {
  return (
    <article
      className={cn(
        "flex min-h-[184px] w-full flex-col gap-4 rounded-3xl bg-blue-200/25 p-4",
        className,
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start justify-between gap-4">
        <div className="grid h-[91px] w-[134px] shrink-0 place-items-center overflow-hidden rounded-lg bg-background">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="break-words font-subheading text-s4 leading-tight sm:text-s3">
            {name}
          </h3>
          <p className="mt-2 text-b2">Angkatan {batch}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onAccept}
          disabled={isLoading}
          className="min-h-[45px] rounded-2xl bg-purple-600 px-4 text-b2 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Memproses..." : "Terima"}
        </button>
        <button
          type="button"
          onClick={onReject}
          disabled={isLoading}
          className="min-h-[45px] rounded-2xl border border-yellow-500 bg-white/25 px-4 text-b2 hover:bg-white/35 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Tolak
        </button>
      </div>
    </article>
  );
}
