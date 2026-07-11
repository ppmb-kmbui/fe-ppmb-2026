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
        "relative flex w-full flex-col gap-4 pl-12 md:grid md:grid-cols-[1fr_6rem_1fr] md:items-center md:pl-0",
        className,
      )}
      {...props}
    >
      <div 
        className="absolute left-3 top-8 flex -translate-x-1/2 items-center justify-center md:static md:col-start-2 md:row-start-1 md:translate-x-0 md:h-full" 
        aria-hidden="true"
      >
        <div className="size-5 md:size-6 rounded-xs bg-white md:bg-blue-500 rotate-45 shrink-0" />
      </div>

      {media && (
        <div
          className={cn(
            "hidden md:flex w-full md:row-start-1",
            reversed ? "md:col-start-3 md:justify-start" : "md:col-start-1 md:justify-end",
          )}
        >
          <div className="w-auto h-full aspect-video overflow-hidden rounded-lg bg-background">
            {media}
          </div>
        </div>
      )}

      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-white/10 bg-purple-900 p-5 md:border-none md:bg-transparent md:p-0 md:row-start-1 md:h-full md:justify-center",
          reversed
            ? "md:col-start-1 md:items-end md:text-right"
            : "md:col-start-3 md:items-start md:text-left",
        )}
      >
        <time className="text-b4 text-white md:text-foreground">{date}</time>
        
        {media && (
           <div className="w-full h-auto aspect-video overflow-hidden rounded-lg bg-background md:hidden">
             {media}
           </div>
        )}

        <h3 className="font-heading text-xl text-yellow-300 md:text-h3 md:text-yellow-100">{title}</h3>
        <p className="text-b3 text-foreground">{description}</p>
        {location && locationHref && (
          <a
            href={locationHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-b3 text-white hover:bg-blue-600 font-semibold"
          >
            <FaLocationDot aria-hidden="true" />
            {location}
          </a>
        )}
        {location && !locationHref && (
          <span className="inline-flex w-fit items-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-b3 text-white font-semibold">
            <FaLocationDot aria-hidden="true" />
            {location}
          </span>
        )}
      </div>
    </article>
  );
}
