import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";
import { LateSubmissionBadge } from "./LateSubmissionBadge";

export interface ParticipantCardProps extends HTMLAttributes<HTMLElement> {
  name: string;
  batch: string | number;
  progress: number;
  lateTaskCount?: number;
  avatar?: ReactNode;
  href?: string;
}

function ParticipantCardContent({
  name,
  batch,
  progress,
  avatar,
  lateTaskCount = 0,
}: Pick<ParticipantCardProps, "name" | "batch" | "progress" | "avatar" | "lateTaskCount">) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <>
      <div className="h-[132px] min-w-0 flex-1 overflow-hidden rounded-xl bg-background">
        {avatar}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="truncate font-subheading text-s5 md:text-s3">{name}</h3>
        <p className="text-b3">Angkatan {batch}</p>
        {lateTaskCount > 0 && <LateSubmissionBadge taskCount={lateTaskCount} />}
        <ProgressBar value={percentage} label={`Penugasan ${name}`} />
        <div className="flex justify-between text-b2">
          <span>Penugasan</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </>
  );
}

export function ParticipantCard({
  name,
  batch,
  progress,
  avatar,
  href,
  lateTaskCount,
  className,
  ...props
}: ParticipantCardProps) {
  const styles = cn(
    "flex min-h-[140px] w-full items-center gap-4 rounded-3xl border border-white/10 bg-blue-200/25 p-4 transition-colors hover:bg-blue-200/30 md:min-h-[164px]",
    className,
  );
  const content = (
    <ParticipantCardContent
      name={name}
      batch={batch}
      progress={progress}
      avatar={avatar}
      lateTaskCount={lateTaskCount}
    />
  );

  if (href) {
    return (
      <Link href={href} className={styles} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <article className={styles} {...props}>
      {content}
    </article>
  );
}
