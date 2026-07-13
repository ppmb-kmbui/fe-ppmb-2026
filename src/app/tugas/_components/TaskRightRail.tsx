import { AgendaCard, QuotaCard, WeekCalendar } from "@/components";

import { agendaItems, selectedDate } from "./task-page-data";

export interface TaskRightRailProps {
  title?: string;
  subtitle?: string;
  showCalendar?: boolean;
  progress?: {
    label: string;
    completed: number;
    total: number;
  };
  agenda?: typeof agendaItems;
  agendaHeading?: string;
  agendaSubtitle?: string;
}

export function TaskRightRail({
  title = "Jumat",
  subtitle = "12 Juni, 2026",
  showCalendar = true,
  progress,
  agenda = agendaItems,
  agendaHeading,
  agendaSubtitle = subtitle,
}: TaskRightRailProps) {
  return (
    <div className="flex flex-col gap-4">
      {progress ? (
        <>
          <h2 className="font-heading text-h3 text-yellow-500">{title}</h2>
          <QuotaCard
            label={progress.label}
            completed={progress.completed}
            total={progress.total}
          />
        </>
      ) : (
        <div className="flex flex-col gap-0.5 text-yellow-500">
          <h2 className="font-heading text-h3">{title}</h2>
          <p className="text-b3">{subtitle}</p>
        </div>
      )}

      {showCalendar && (
        <WeekCalendar
          selectedDate={selectedDate}
          eventDates={["2026-06-13", "2026-06-15"]}
        />
      )}

      {agendaHeading && (
        <div className="flex flex-col gap-0.5 text-yellow-500">
          <h2 className="font-heading text-h3">{agendaHeading}</h2>
          <p className="text-b3">{agendaSubtitle}</p>
        </div>
      )}

      <div className="flex flex-col gap-2.5 py-2.5">
        {agenda.map((item) => (
          <AgendaCard key={`${item.category}-${item.title}`} {...item} />
        ))}
      </div>
    </div>
  );
}
