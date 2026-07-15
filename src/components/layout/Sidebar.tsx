"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  FaBook,
  FaHouse,
  FaNewspaper,
  FaThumbtack,
  FaThumbtackSlash,
  FaUserGroup,
} from "react-icons/fa6";

import { cn } from "@/lib/cn";

export type SidebarRoute = "home" | "tasks" | "friends" | "materials";

export interface SidebarItem {
  key: SidebarRoute | string;
  label: string;
  href: string;
  icon: ReactNode;
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  activeItem?: SidebarRoute | string;
  defaultPinned?: boolean;
  pinned?: boolean;
  items?: readonly SidebarItem[];
  panelClassName?: string;
  onPinnedChange?: (pinned: boolean) => void;
}

export const dashboardSidebarItems: readonly SidebarItem[] = [
  {
    key: "home",
    label: "Beranda",
    href: "/",
    icon: <FaHouse />,
  },
  {
    key: "tasks",
    label: "Tugas",
    href: "/tugas",
    icon: <FaNewspaper />,
  },
  {
    key: "friends",
    label: "Kalyanamitta",
    href: "/kalyanamitta",
    icon: <FaUserGroup />,
  },
  {
    key: "materials",
    label: "Materi",
    href: "/materi",
    icon: <FaBook />,
  },
];

const COLLAPSE_DELAY_MS = 200;

export function Sidebar({
  activeItem = "home",
  defaultPinned = false,
  pinned,
  items = dashboardSidebarItems,
  panelClassName,
  onPinnedChange,
  className,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...props
}: SidebarProps) {
  const [internalPinned, setInternalPinned] = useState(defaultPinned);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPinned = pinned ?? internalPinned;
  const isExpanded = isPinned || isPointerInside || isFocusWithin;

  function clearCollapseTimer() {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
  }

  function schedulePointerCollapse() {
    clearCollapseTimer();
    collapseTimer.current = setTimeout(() => {
      setIsPointerInside(false);
      collapseTimer.current = null;
    }, COLLAPSE_DELAY_MS);
  }

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    onPointerEnter?.(event);
    if (event.defaultPrevented || event.pointerType === "touch") return;

    clearCollapseTimer();
    setIsPointerInside(true);
  }

  function handlePointerLeave(event: PointerEvent<HTMLElement>) {
    onPointerLeave?.(event);
    if (event.defaultPrevented || event.pointerType === "touch") return;

    schedulePointerCollapse();
  }

  function handleFocus(event: FocusEvent<HTMLElement>) {
    onFocus?.(event);
    if (event.defaultPrevented) return;

    clearCollapseTimer();
    setIsFocusWithin(true);
  }

  function handleBlur(event: FocusEvent<HTMLElement>) {
    onBlur?.(event);
    if (event.defaultPrevented) return;

    const nextTarget = event.relatedTarget;
    if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
      setIsFocusWithin(false);
    }
  }

  function togglePinned() {
    const nextPinned = !isPinned;

    if (pinned === undefined) {
      setInternalPinned(nextPinned);
    }

    onPinnedChange?.(nextPinned);
  }

  useEffect(() => {
    return () => clearCollapseTimer();
  }, []);

  return (
    <aside
      className={cn("relative min-h-[982px] w-[103px] shrink-0", className)}
      aria-label="Navigasi utama"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 z-20 overflow-hidden bg-purple-800/25 px-6 pb-20 pt-[140px] backdrop-blur-glass transition-[width,box-shadow] duration-200 motion-reduce:transition-none",
          isExpanded ? "w-[260px] shadow-modal" : "w-[103px]",
          panelClassName,
        )}
      >
        {isExpanded && (
          <button
            type="button"
            onClick={togglePinned}
            aria-pressed={isPinned}
            aria-label={isPinned ? "Lepaskan sidebar" : "Sematkan sidebar"}
            title={isPinned ? "Lepaskan sidebar" : "Sematkan sidebar"}
            className="absolute right-5 top-6 grid size-10 place-items-center rounded-full text-xl text-yellow-100 transition-colors hover:bg-purple-300/30"
          >
            {isPinned ? <FaThumbtackSlash /> : <FaThumbtack />}
          </button>
        )}

        <nav className="flex flex-col gap-10">
          {items.map((item) => {
            const isActive = item.key === activeItem;

            return (
              <Link
                key={item.key}
                href={item.href}
                title={isExpanded ? undefined : item.label}
                aria-label={isExpanded ? undefined : item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-h-[60px] items-center rounded-2xl py-4 text-b1 text-foreground transition-colors hover:bg-purple-300/30",
                  isExpanded ? "gap-2.5 px-6" : "justify-center px-3",
                  isActive && "bg-purple-300/50",
                )}
              >
                <span aria-hidden="true" className="shrink-0 text-4xl">
                  {item.icon}
                </span>
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
