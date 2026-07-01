import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { ProgressBar } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface TaskCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  progress: number;
  href?: string;
  preview?: ReactNode;
}

function TaskCardContent({
  title,
  progress,
  preview,
}: Pick<TaskCardProps, "title" | "progress" | "preview">) {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <>
      <div className="h-[214px] w-full overflow-hidden rounded-lg bg-background">
        {preview}
      </div>
      <div className="flex w-full flex-col gap-2">
        <h3 className="font-subheading text-s3 text-foreground">{title}</h3>
        <ProgressBar value={percentage} label={`Progress ${title}`} />
        <div className="flex items-center justify-between text-b2 text-foreground">
          <span>Progress Kamu</span>
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
  className,
  ...props
}: TaskCardProps) {
  const styles = cn(
    "flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-purple-400/50 px-6 py-4 transition-colors hover:bg-purple-400/60",
    className,
  );
  const content = (
    <TaskCardContent title={title} progress={progress} preview={preview} />
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
