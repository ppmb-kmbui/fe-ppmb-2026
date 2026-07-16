import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface TaskCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  progress: number;
  href?: string;
  preview?: ReactNode;
  icon?: ReactNode;
}

function TaskCardContent({
  title,
  progress,
  preview,
  icon,
}: Pick<TaskCardProps, "title" | "progress" | "preview" | "icon">) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <>
      <div className="grid h-[90px] w-[151px] shrink-0 place-items-center overflow-hidden rounded-lg md:h-[214px] md:w-full">
        {preview ?? (
          <div className="grid place-items-center text-yellow-500 drop-shadow-[0_0_18px_rgba(253,205,1,0.3)]">
            {icon}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 md:w-full">
        <h3 className="truncate font-subheading text-s5 text-foreground md:text-s3">
          {title}
        </h3>
        <ProgressBar value={percentage} label={`Progress ${title}`} />
        <div className="flex items-center justify-between text-b4 text-foreground md:text-b2">
          <span className="hidden md:inline">Progress Kamu</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </>
  );
}

export function TaskCard({
  title,
  progress,
  href,
  preview,
  icon,
  className,
  ...props
}: TaskCardProps) {
  const styles = cn(
    "flex min-h-[122px] w-full items-center gap-4 rounded-3xl border border-white/10 bg-purple-400/50 px-4 py-4 transition-colors hover:bg-purple-400/60 md:flex-col md:items-stretch md:px-6",
    className,
  );
  const content = (
    <TaskCardContent title={title} progress={progress} preview={preview} icon={icon} />
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
