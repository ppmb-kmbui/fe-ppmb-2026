"use client";

import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import {
  FaArrowRightFromBracket,
  FaBurger,
} from "react-icons/fa6";

import { BrandLogo, UserAvatar } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getCachedProfileSnapshot,
  getProfileCached,
  logout,
} from "@/lib/auth-api";
import {
  dashboardSidebarItems,
  type SidebarItem,
  type SidebarRoute,
} from "./Sidebar";
import { useViewerNavigationItems } from "./useViewerNavigationItems";

export interface HeaderUser {
  fullName: string;
  batch?: string | number;
  subtitle?: string;
  imgUrl?: string | null;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  user?: HeaderUser;
  logoSrc?: string;
  profileHref?: string;
  activeItem?: SidebarRoute | string;
  mobileNavItems?: readonly SidebarItem[];
}

export function Header({
  user,
  logoSrc,
  profileHref,
  activeItem,
  mobileNavItems = dashboardSidebarItems,
  className,
  style,
  ...props
}: HeaderProps) {
  const [profileUser, setProfileUser] = useState<HeaderUser | undefined>(() => {
    const cachedProfile = getCachedProfileSnapshot();

    if (!cachedProfile) return undefined;

    return {
      fullName: cachedProfile.fullname ?? "Nama Lengkap",
      batch: cachedProfile.batch,
      imgUrl: cachedProfile.imgUrl,
    };
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const backgroundStyle: CSSProperties = {
    backgroundImage: "var(--gradient-app-header)",
    ...style,
  };
  const displayedUser = user ?? profileUser;
  const isDashboardHeader = activeItem !== undefined;
  const visibleMobileNavItems = useViewerNavigationItems(mobileNavItems);

  useEffect(() => {
    let active = true;

    if (user) {
      return;
    }

    getProfileCached()
      .then((profile) => {
        if (!active) return;
        setProfileUser({
          fullName: profile.fullname ?? "Nama Lengkap",
          batch: profile.batch,
          imgUrl: profile.imgUrl,
        });
      })
      .catch(() => {
        if (active) setProfileUser(user);
      });

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!isMobileNavOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMobileNavOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileNavOpen]);

  const profileContent = displayedUser ? (
    <>
      <UserAvatar
        src={displayedUser.imgUrl}
        alt={`Foto ${displayedUser.fullName}`}
        className="size-10 rounded-full md:size-[50px]"
      />
      <div className="hidden flex-col items-end gap-2 sm:flex">
        <p className="font-heading text-h5">{displayedUser.fullName}</p>
        {(displayedUser.subtitle || displayedUser.batch) && (
          <p className="text-b3">
            {displayedUser.subtitle || `Angkatan ${displayedUser.batch}`}
          </p>
        )}
      </div>
    </>
  ) : null;

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      window.location.href = "/login";
    }
  }

  const mobileProfile = (
    <Link
      href={profileHref ?? "/profil"}
      aria-label={
        displayedUser
          ? `Buka profil ${displayedUser.fullName}`
          : "Buka profil"
      }
      className="grid size-[50px] shrink-0 place-items-center rounded-full text-yellow-100 transition-colors hover:bg-white/10 md:hidden"
    >
      <UserAvatar
        src={displayedUser?.imgUrl}
        alt={
          displayedUser
            ? `Foto ${displayedUser.fullName}`
            : "Foto profil pengguna"
        }
        className="size-[50px] rounded-full"
      />
    </Link>
  );

  const brand = (
    <Link
      href="/"
      aria-label="Ke homepage"
      className={cn(
        "min-w-0 items-center gap-3 rounded-2xl transition-opacity hover:opacity-85 md:gap-8",
        isDashboardHeader ? "hidden md:flex" : "flex",
      )}
    >
      <BrandLogo src={logoSrc} priority />
      {displayedUser && (
        <div className="hidden min-w-0 flex-col gap-2 text-foreground sm:flex">
          <p className="truncate font-heading text-h4">PPMB KMBUI 2026</p>
          <p className="truncate text-b2">Begin your journey, build your story</p>
        </div>
      )}
    </Link>
  );

  return (
    <header
      className={cn(
        "flex min-h-[86px] w-full items-center px-4 py-4 md:min-h-[100px] md:px-[60px]",
        className,
      )}
      style={backgroundStyle}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-6">
        {isDashboardHeader && (
          <button
            type="button"
            aria-label={isMobileNavOpen ? "Tutup navigasi" : "Buka navigasi"}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-dashboard-navigation"
            onClick={() => setIsMobileNavOpen((current) => !current)}
            className="grid size-[50px] shrink-0 place-items-center rounded-full text-yellow-100 transition-colors hover:bg-white/10 md:hidden"
          >
            <FaBurger aria-hidden="true" className="size-[42px]" />
          </button>
        )}

        {brand}

        {displayedUser ? (
          <div className="flex shrink-0 items-center gap-3 text-foreground md:gap-5">
            {isDashboardHeader && mobileProfile}

            {profileHref ? (
              <a
                href={profileHref}
                className="hidden items-center gap-3 md:flex md:gap-5"
                aria-label={`Buka profil ${displayedUser.fullName}`}
              >
                {profileContent}
              </a>
            ) : (
              <div className="hidden items-center gap-3 md:flex md:gap-5">
                {profileContent}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Keluar"
              title="Keluar"
              className="hidden size-10 place-items-center rounded-full text-yellow-100 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 md:grid md:size-[50px]"
            >
              <FaArrowRightFromBracket aria-hidden="true" className="size-5 md:size-6" />
            </button>
          </div>
        ) : isDashboardHeader ? (
          mobileProfile
        ) : (
          <div className="flex min-w-0 flex-col items-end gap-2 text-right text-foreground">
            <p className="truncate font-heading text-h4">PPMB KMBUI 2026</p>
            <p className="hidden truncate text-b2 sm:block">
              Begin your journey, build your story
            </p>
          </div>
        )}
      </div>

      {isDashboardHeader && isMobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Tutup navigasi"
            className="absolute inset-0 cursor-default bg-purple-950/30"
            onClick={() => setIsMobileNavOpen(false)}
          />

          <nav
            id="mobile-dashboard-navigation"
            aria-label="Navigasi utama"
            className="absolute left-4 top-[104px] flex w-[260px] flex-col rounded-2xl border border-white/10 bg-[rgba(104,53,146,0.25)] px-4 py-8 shadow-[0_20px_60px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[36px] before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[linear-gradient(135deg,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_45%,rgba(0,0,0,0.16))]"
          >
            <div className="relative z-10 flex flex-col gap-2.5">
              {visibleMobileNavItems.map((item) => {
                const isActive = item.key === activeItem;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      "flex min-h-12 w-full items-center gap-2.5 rounded-3xl px-6 py-3 font-heading text-h6 text-foreground transition-colors hover:bg-purple-300/30",
                      isActive && "bg-purple-300/50",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-7 place-items-center text-[25px]"
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex min-h-12 w-full items-center gap-2.5 rounded-3xl px-6 py-3 font-heading text-h6 text-foreground transition-colors hover:bg-purple-300/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span
                  aria-hidden="true"
                  className="grid size-7 place-items-center text-[25px]"
                >
                  <FaArrowRightFromBracket />
                </span>
                <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
