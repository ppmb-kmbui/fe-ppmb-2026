"use client";

import { AgendaCard, QuotaCard, WeekCalendar } from "@/components";

import { agendaItems } from "./task-page-data";
import { getTaskIcon, type TaskIconKey } from "./task-icons";

export interface TaskAgendaItem {
  category: string;
  title: string;
  date: string;
  icon?: TaskIconKey | string;
}

export interface TaskRightRailProps {
  title?: string;
  subtitle?: string;
  showDateHeader?: boolean;
  showCalendar?: boolean;
  progress?: {
    label: string;
    completed: number;
    total: number;
  };
  progressItems?: Array<{
    label: string;
    completed: number;
    total: number;
  }>;
  agenda?: TaskAgendaItem[];
  agendaHeading?: string;
  agendaSubtitle?: string;
  showAgendaSubtitle?: boolean;
  selectedDate?: Date | string;
  eventDates?: readonly (Date | string)[];
}

const dayFormatter = new Intl.DateTimeFormat("id-ID", { weekday: "long" });
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const defaultAgendaYear = 2026;
const monthOrder: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
};
const categoryOrder = [
  "Networking",
  "Insight Hunting",
  "KMBUI Explorer",
  "Mentoring",
  "Foster Siblings",
];

function getAgendaTime(dateText: string) {
  const normalized = dateText
    .toLowerCase()
    .replace(/â€“|–|—/g, "-")
    .replace(/,/g, " ");
  const day = normalized.match(/\d{1,2}/)?.[0];
  const month = Object.keys(monthOrder).find((monthName) =>
    normalized.includes(monthName),
  );

  if (!day || !month) return Number.MAX_SAFE_INTEGER;

  return new Date(
    defaultAgendaYear,
    monthOrder[month],
    Number(day),
  ).getTime();
}

function compareAgendaItems(first: TaskAgendaItem, second: TaskAgendaItem) {
  const dateDifference = getAgendaTime(first.date) - getAgendaTime(second.date);
  if (dateDifference !== 0) return dateDifference;

  const firstCategory = categoryOrder.indexOf(first.category);
  const secondCategory = categoryOrder.indexOf(second.category);
  const categoryDifference =
    (firstCategory === -1 ? categoryOrder.length : firstCategory) -
    (secondCategory === -1 ? categoryOrder.length : secondCategory);

  if (categoryDifference !== 0) return categoryDifference;

  return first.title.localeCompare(second.title, "id-ID");
}

export function TaskRightRail({
  title,
  subtitle,
  showDateHeader = true,
  showCalendar = true,
  progress,
  progressItems,
  agenda = agendaItems,
  agendaHeading,
  agendaSubtitle,
  showAgendaSubtitle = true,
  selectedDate,
  eventDates = ["2026-06-13", "2026-06-15"],
}: TaskRightRailProps) {
  const calendarDate = selectedDate ?? new Date();
  const date =
    calendarDate instanceof Date ? calendarDate : new Date(calendarDate);
  const displayedTitle = title ?? dayFormatter.format(date);
  const displayedSubtitle = subtitle ?? dateFormatter.format(date);
  const displayedAgendaSubtitle = agendaSubtitle ?? displayedSubtitle;
  const sortedAgenda = [...agenda].sort(compareAgendaItems);
  const displayedProgressItems = progressItems ?? (progress ? [progress] : []);

  function getAgendaIconKey(item: TaskAgendaItem): TaskIconKey | undefined {
    if (item.icon) return item.icon as TaskIconKey;

    const category = item.category.toLowerCase();
    if (category.includes("networking")) return "networking";
    if (category.includes("insight")) return "insight";
    if (category.includes("explorer")) return "explorer";
    if (category.includes("mentoring")) return "mentoring";
    if (category.includes("foster")) return "foster";

    return undefined;
  }

  return (
    <div className="flex flex-col gap-4">
      {displayedProgressItems.length > 0 ? (
        <>
          <h2 className="font-heading text-h3 text-yellow-500">
            {displayedTitle}
          </h2>
          {displayedProgressItems.map((item) => (
            <QuotaCard
              key={item.label}
              label={item.label}
              completed={item.completed}
              total={item.total}
            />
          ))}
        </>
      ) : showDateHeader ? (
        <div className="flex flex-col gap-0.5 text-yellow-500">
          <h2 className="font-heading text-h3">{displayedTitle}</h2>
          <p className="text-b3">{displayedSubtitle}</p>
        </div>
      ) : null}

      {showCalendar && (
        <WeekCalendar
          selectedDate={calendarDate}
          eventDates={eventDates}
        />
      )}

      {agendaHeading && (
        <div className="flex flex-col gap-0.5 text-yellow-500">
          <h2 className="font-heading text-h3">{agendaHeading}</h2>
          {showAgendaSubtitle && displayedAgendaSubtitle && (
            <p className="text-b3">{displayedAgendaSubtitle}</p>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2.5 py-2.5">
        {sortedAgenda.map((item) => (
          <AgendaCard
            key={`${item.category}-${item.title}`}
            {...item}
            icon={getTaskIcon(getAgendaIconKey(item), "size-5")}
          />
        ))}
      </div>
    </div>
  );
}
