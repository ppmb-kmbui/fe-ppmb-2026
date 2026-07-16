import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export function GradientTaskTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn(
        "inline-block bg-clip-text pb-2 font-heading text-h2 leading-[1.25] text-transparent sm:text-h1",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(173.5deg, var(--gradient-header-start) 11.592%, var(--gradient-header-end) 72.166%)",
      }}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TaskSectionCard({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section
      className={cn(
        "flex w-full flex-col gap-5 rounded-lg border border-white/10 bg-blue-600/35 px-4 py-4 backdrop-blur-sm md:px-8",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function TaskDescription({ children }: { children?: ReactNode }) {
  return (
    <>
      <h2 className="font-subheading text-s3 font-semibold">Deskripsi Tugas</h2>
      <p className="text-b1 leading-snug">
        {children ??
          "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas."}
      </p>
    </>
  );
}
