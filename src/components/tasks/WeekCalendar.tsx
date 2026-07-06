"use client";

import type { HTMLAttributes } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export type CalendarDate = Date | string;

export interface WeekCalendarProps extends HTMLAttributes<HTMLDivElement> {
  selectedDate: CalendarDate;
  eventDates?: readonly CalendarDate[];
  onDateChange?: (date: Date) => void;
}

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function toLocalDate(value: CalendarDate) {
  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (dateOnly) {
    return new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3]),
    );
  }

  const parsedDate = new Date(value);
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function WeekCalendar({
  selectedDate,
  eventDates = [],
  onDateChange,
  className,
  ...props
}: WeekCalendarProps) {
  const selected = toLocalDate(selectedDate);
  const mondayOffset = (selected.getDay() + 6) % 7;
  const weekStart = addDays(selected, -mondayOffset);
  const days = weekdayLabels.map((label, index) => ({
    label,
    value: addDays(weekStart, index),
  }));
  const selectedKey = getDateKey(selected);
  const eventDateKeys = new Set(
    eventDates.map((eventDate) => getDateKey(toLocalDate(eventDate))),
  );
  const month = new Intl.DateTimeFormat("id-ID", { month: "long" }).format(
    selected,
  );

  function selectDate(date: Date) {
    onDateChange?.(new Date(date));
  }

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
          onClick={() => selectDate(addDays(selected, -7))}
          aria-label="Minggu sebelumnya"
          className="grid size-9 place-items-center rounded-full text-yellow-400 hover:bg-white/10"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
        <p className="min-w-20 text-center font-heading text-h4">{month}</p>
        <button
          type="button"
          onClick={() => selectDate(addDays(selected, 7))}
          aria-label="Minggu berikutnya"
          className="grid size-9 place-items-center rounded-full text-yellow-400 hover:bg-white/10"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="grid w-full grid-cols-7 gap-2" role="grid">
        {days.map((day) => {
          const dateKey = getDateKey(day.value);
          const isSelected = dateKey === selectedKey;
          const hasEvent = eventDateKeys.has(dateKey);

          return (
            <button
              type="button"
              key={dateKey}
              role="gridcell"
              aria-selected={isSelected}
              aria-label={new Intl.DateTimeFormat("id-ID", {
                dateStyle: "full",
              }).format(day.value)}
              onClick={() => selectDate(day.value)}
              className="flex min-w-0 flex-col items-center gap-2 rounded-lg text-center text-b3 hover:bg-white/10"
            >
              <span>{day.label}</span>
              <span
                className={cn(
                  "relative grid min-h-6 min-w-6 place-items-center rounded-2xl px-1",
                  isSelected && "bg-purple-600",
                  hasEvent &&
                    "after:absolute after:-bottom-1 after:size-1 after:rounded-full after:bg-blue-400",
                )}
              >
                {day.value.getDate()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
