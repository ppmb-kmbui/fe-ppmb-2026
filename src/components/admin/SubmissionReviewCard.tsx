import type { HTMLAttributes, ReactNode } from "react";
import { FaFilePdf, FaLink } from "react-icons/fa6";

import { StatusBadge, type SubmissionStatus } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface SubmissionFile {
  href: string;
  label?: string;
}

export interface SubmissionLink {
  href: string;
  label: string;
  description?: string;
}

export interface SubmissionReviewCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  status: SubmissionStatus;
  media?: ReactNode;
  answer?: ReactNode;
  file?: SubmissionFile;
  links?: SubmissionLink[];
  answerFirst?: boolean;
}

function ContentPanel({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-[160px] min-w-0 flex-1 items-start overflow-hidden rounded-2xl bg-[rgba(41,0,75,0.25)] p-4 text-b2 md:min-h-[223px] md:p-6 md:text-b1">
      {children}
    </div>
  );
}

function isUrl(value: ReactNode): value is string {
  return typeof value === "string" && /^https?:\/\//.test(value);
}

export function SubmissionReviewCard({
  title,
  status,
  media,
  answer,
  file,
  links,
  answerFirst = false,
  className,
  ...props
}: SubmissionReviewCardProps) {
  const answerPanel = answer ? (
    <ContentPanel>
      {isUrl(answer) ? (
        <a
          href={answer}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 break-all underline hover:text-yellow-100"
        >
          <FaLink aria-hidden="true" className="size-5 shrink-0" />
          <span>{answer}</span>
        </a>
      ) : (
        <span className="whitespace-pre-wrap break-words">{answer}</span>
      )}
    </ContentPanel>
  ) : null;
  const mediaPanel = media ? (
    <div className="min-h-[160px] min-w-0 flex-1 overflow-hidden rounded-lg bg-background md:min-h-[223px]">
      {isUrl(media) ? (
        <a href={media} target="_blank" rel="noreferrer">
          <img
            src={media}
            alt=""
            className="h-full min-h-[160px] w-full object-cover md:min-h-[223px]"
          />
        </a>
      ) : (
        media
      )}
    </div>
  ) : null;
  const filePanel = file?.href ? (
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
  const linksPanel = links?.length ? (
    <ContentPanel>
      <div className="flex w-full flex-col gap-4">
        {links.map((link) => (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-white/10 bg-purple-950/20 px-4 py-3 transition-colors hover:border-yellow-100/60 hover:bg-purple-950/35"
          >
            <span className="flex items-center gap-3 font-subheading text-s5 text-yellow-100">
              <FaLink aria-hidden="true" className="size-4 shrink-0" />
              <span>{link.label}</span>
            </span>
            {link.description && (
              <span className="mt-1 block text-b3 text-foreground/80 group-hover:text-foreground">
                {link.description}
              </span>
            )}
          </a>
        ))}
      </div>
    </ContentPanel>
  ) : null;
  const panels = answerFirst
    ? [linksPanel, answerPanel, mediaPanel, filePanel]
    : [mediaPanel, answerPanel, linksPanel, filePanel];
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
