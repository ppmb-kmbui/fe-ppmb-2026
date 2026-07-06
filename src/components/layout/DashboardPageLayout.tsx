import type { HTMLAttributes, ReactNode } from "react";

import { Header, type HeaderUser } from "./Header";
import { Sidebar, type SidebarRoute } from "./Sidebar";
import { cn } from "@/lib/cn";

export interface DashboardPageLayoutProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: ReactNode;
  activeItem: SidebarRoute | string;
  user?: HeaderUser;
  rightRail?: ReactNode;
  background?: ReactNode;
  logoSrc?: string;
  profileHref?: string;
  mainId?: string;
  mainClassName?: string;
  rightRailClassName?: string;
  rightRailLabel?: string;
  sidebarClassName?: string;
}

export function DashboardPageLayout({
  children,
  activeItem,
  user,
  rightRail,
  background,
  logoSrc,
  profileHref,
  mainId = "main-content",
  mainClassName,
  rightRailClassName,
  rightRailLabel = "Informasi pendukung",
  sidebarClassName,
  className,
  ...props
}: DashboardPageLayoutProps) {
  return (
    <div
      className={cn(
        "relative isolate min-h-screen overflow-x-clip bg-[image:var(--gradient-dashboard)] bg-cover text-foreground",
        className,
      )}
      {...props}
    >
      <a
        href={`#${mainId}`}
        className="sr-only z-50 rounded-md bg-yellow-500 px-4 py-2 text-purple-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Lewati ke konten utama
      </a>

      {background && (
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          {background}
        </div>
      )}

      <div className="absolute inset-y-0 left-0 z-20 hidden min-h-[982px] w-[103px] md:block">
        <Sidebar
          activeItem={activeItem}
          className={cn("min-h-full", sidebarClassName)}
        />
      </div>
      <Header
        user={user}
        logoSrc={logoSrc}
        profileHref={profileHref}
        className="relative z-30"
      />

      <div className="relative z-10 flex min-h-[calc(100svh-100px)] flex-col md:ml-[103px] xl:flex-row">
        <main
          id={mainId}
          className={cn(
            "min-w-0 flex-1 px-4 py-9 md:pl-[37px] md:pr-[22px]",
            mainClassName,
          )}
        >
          {children}
        </main>

        {rightRail && (
          <aside
            aria-label={rightRailLabel}
            className={cn(
              "w-full shrink-0 border-t border-white/10 bg-purple-800/25 px-6 py-9 backdrop-blur-glass xl:w-[392px] xl:border-l xl:border-t-0",
              rightRailClassName,
            )}
          >
            {rightRail}
          </aside>
        )}
      </div>
    </div>
  );
}
