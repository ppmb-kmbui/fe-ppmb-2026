import type { HTMLAttributes, ReactNode } from "react";
import { FaFilePdf } from "react-icons/fa6";

import { StatusBadge, type SubmissionStatus } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface SubmissionFile {
  href: string;
  label?: string;
}

export interface SubmissionReviewCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  status: SubmissionStatus;
  media?: ReactNode;
  answer?: ReactNode;
  file?: SubmissionFile;
  answerFirst?: boolean;
}

function ContentPanel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-[223px] min-w-0 flex-1 items-start overflow-hidden rounded-2xl bg-[rgba(41,0,75,0.25)] p-6 text-b1">
      {children}
    </div>
  );
}

export function SubmissionReviewCard({
  title,
  status,
  media,
  answer,
  file,
  answerFirst = false,
  className,
  ...props
}: SubmissionReviewCardProps) {
  const answerPanel = answer ? <ContentPanel>{answer}</ContentPanel> : null;
  const mediaPanel = media ? (
    <div className="min-h-[223px] min-w-0 flex-1 overflow-hidden rounded-lg bg-background">
      {media}
    </div>
  ) : null;
  const filePanel = file ? (
    <ContentPanel>
      <a
        href={file.href}
        target="_blank"
        rel="noreferrer"
        className="m-auto flex flex-col items-center gap-4 text-center underline hover:text-yellow-100"
      >
        <FaFilePdf aria-hidden="true" className="size-[88px] text-blue-500" />
        <span>{file.label ?? "Link download PDF"}</span>
      </a>
    </ContentPanel>
  ) : null;
  const panels = answerFirst
    ? [answerPanel, mediaPanel, filePanel]
    : [mediaPanel, answerPanel, filePanel];
  const visiblePanels = panels.filter(Boolean);

  return (
    <article
      className={cn(
        "flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-purple-400/50 px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-subheading pt-2 text-s3">{title}</h3>
        <StatusBadge status={status} />
      </div>
      {visiblePanels.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {visiblePanels.map((panel, index) => (
            <div key={index} className={cn(visiblePanels.length === 1 && "md:col-span-2")}>
              {panel}
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
