import { cn } from "@/lib/cn";

export function LateSubmissionBadge({
  taskCount,
  className,
}: {
  taskCount?: number;
  className?: string;
}) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex w-fit items-center rounded-xl border border-yellow-300 bg-yellow-100 px-3 py-1.5 font-subheading text-b3 text-purple-950",
        className,
      )}
    >
      Telat{taskCount !== undefined ? ` · ${taskCount} tugas` : ""}
    </span>
  );
}
