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
}

export function TimelineItem({
  date,
  title,
  description,
  media,
  location,
  locationHref,
  className,
  ...props
}: TimelineItemProps) {
  return (
    <article className={cn("flex w-full flex-col gap-5", className)} {...props}>
      {media && (
        <div className="aspect-[600/290] w-full overflow-hidden rounded-lg bg-background">
          {media}
        </div>
      )}
      <div className="flex flex-col gap-3">
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
