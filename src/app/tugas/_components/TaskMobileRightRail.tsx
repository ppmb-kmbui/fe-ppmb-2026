"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

export interface TaskMobileRightRailProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function TaskMobileRightRail({
  children,
  label = "Jadwal",
  className,
}: TaskMobileRightRailProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <div className={cn("md:hidden", className)}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="task-mobile-right-rail"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-[41px] min-w-[95px] items-center justify-center rounded-3xl bg-purple-600 px-4 font-subheading text-s5 text-foreground transition-colors hover:bg-purple-700"
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Tutup tenggat"
            className="absolute inset-0 cursor-default bg-purple-950/30"
            onClick={() => setIsOpen(false)}
          />

          <aside
            id="task-mobile-right-rail"
            role="dialog"
            aria-label={label}
            className="absolute right-4 top-[104px] max-h-[calc(100svh-120px)] w-[260px] overflow-y-auto rounded-2xl border border-white/10 bg-[rgba(104,53,146,0.25)] px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[36px] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_45%,rgba(0,0,0,0.16))]"
          >
            <div className="relative z-10">{children}</div>
          </aside>
        </div>
      )}
    </div>
  );
}
