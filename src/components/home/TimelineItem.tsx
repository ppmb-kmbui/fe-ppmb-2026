import type { HTMLAttributes, ReactNode } from "react";
import { FaLocationDot } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface TimelineItemProps extends HTMLAttributes<HTMLElement> {
  date: string;
  title: string;
  description: string;
  media?: ReactNode;
  location?: string;
  locationHref?: string;
  reversed?: boolean;
}

export function TimelineItem({
  date,
  title,
  description,
  media,
  location,
  locationHref,
  reversed = false,
  className,
  ...props
}: TimelineItemProps) {
  return (
    <article
      className={cn(
        "grid w-full grid-cols-[1fr_6rem_1fr] items-start",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center h-full" aria-hidden="true">
        <div className="size-6 rounded-xs bg-blue-800 rotate-45 shrink-0" />
      </div>
      {media && (
        <div
          className={cn(
            "flex row-start-1",
            reversed ? "col-start-3 justify-start" : "col-start-1 justify-end",
          )}
        >
          <div className="h-56 w-auto aspect-video overflow-hidden rounded-lg bg-background">
            {media}
          </div>
        </div>
      )}
      <div
        className={cn(
          "flex flex-col gap-3 row-start-1 h-full justify-center",
          reversed
            ? "col-start-1 items-end text-right"
            : "col-start-3 items-start text-left",
        )}
      >
        <time className="text-b4 text-foreground">{date}</time>
        <h3 className="font-heading text-h3 text-yellow-100">{title}</h3>
        <p className="text-b3 text-foreground">{description}</p>
        {location && locationHref && (
          <a
            href={locationHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-xs bg-blue-500 px-4 py-2 text-b3 text-yellow-50 hover:bg-blue-600"
          >
            <FaLocationDot aria-hidden="true" />
            {location}
          </a>
        )}
        {location && !locationHref && (
          <span className="inline-flex w-fit items-center gap-2 rounded-xs bg-blue-500 px-4 py-2 text-b3 text-yellow-50">
            <FaLocationDot aria-hidden="true" />
            {location}
          </span>
        )}
      </div>
    </article>
  );
}
