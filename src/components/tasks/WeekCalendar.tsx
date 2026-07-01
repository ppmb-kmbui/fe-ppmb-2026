"use client";

import type { HTMLAttributes } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface CalendarDay {
  label: string;
  date: string | number;
  selected?: boolean;
  hasEvent?: boolean;
}

export interface WeekCalendarProps extends HTMLAttributes<HTMLDivElement> {
  month: string;
  days: readonly CalendarDay[];
  onPrevious?: () => void;
  onNext?: () => void;
}

export function WeekCalendar({
  month,
  days,
  onPrevious,
  onNext,
  className,
  ...props
}: WeekCalendarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-blue-200/25 px-6 py-4",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onPrevious}
          aria-label="Minggu sebelumnya"
          className="grid size-9 place-items-center rounded-full text-yellow-400 hover:bg-white/10"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
        <p className="min-w-20 text-center font-heading text-h4">{month}</p>
        <button
          type="button"
          onClick={onNext}
          aria-label="Minggu berikutnya"
          className="grid size-9 place-items-center rounded-full text-yellow-400 hover:bg-white/10"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="grid w-full grid-cols-7 gap-2" role="grid">
        {days.map((day) => (
          <div
            key={`${day.label}-${day.date}`}
            role="gridcell"
            aria-selected={day.selected || undefined}
            className="flex min-w-0 flex-col items-center gap-2 text-center text-b3"
          >
            <span>{day.label}</span>
            <span
              className={cn(
                "relative grid min-h-6 min-w-6 place-items-center rounded-2xl px-1",
                day.selected && "bg-purple-600",
                day.hasEvent &&
                  "after:absolute after:-bottom-1 after:size-1 after:rounded-full after:bg-blue-400",
              )}
            >
              {day.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
