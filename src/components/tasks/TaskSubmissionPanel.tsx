import type { HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface TaskSubmissionPanelProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function TaskSubmissionPanel({
  title = "Upload Tugas",
  children,
  submitLabel = "Submit",
  isSubmitting = false,
  className,
  ...props
}: TaskSubmissionPanelProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-5 rounded-md border border-white/10 bg-blue-600/35 px-4 py-4 md:px-8",
        className,
      )}
      {...props}
    >
      <h2 className="font-subheading text-s3 font-semibold">{title}</h2>
      <div className="grid gap-4">{children}</div>
      <Button type="submit" isLoading={isSubmitting} className="h-[50px]">
        {submitLabel}
      </Button>
    </section>
  );
}
