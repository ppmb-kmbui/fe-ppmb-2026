"use client";

import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { FaArrowRightFromBracket, FaCircleUser } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  getCachedProfileSnapshot,
  getProfileCached,
  logout,
} from "@/lib/auth-api";

export interface HeaderUser {
  fullName: string;
  batch: string | number;
  imgUrl?: string | null;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  user?: HeaderUser;
  logoSrc?: string;
  profileHref?: string;
}

export function Header({
  user,
  logoSrc,
  profileHref,
  className,
  style,
  ...props
}: HeaderProps) {
  const [profileUser, setProfileUser] = useState<HeaderUser | undefined>(() => {
    const cachedProfile = getCachedProfileSnapshot();

    if (!cachedProfile) return user;

    return {
      fullName: cachedProfile.fullname ?? "Nama Lengkap",
      batch: cachedProfile.batch,
      imgUrl: cachedProfile.imgUrl,
    };
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const backgroundStyle: CSSProperties = {
    backgroundImage: "var(--gradient-app-header)",
    ...style,
  };
  const displayedUser = profileUser ?? user;

  useEffect(() => {
    if (!user) return;

    let active = true;

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

  const profileContent = displayedUser ? (
    <>
      {displayedUser.imgUrl ? (
        <span
          aria-hidden="true"
          className="size-10 rounded-full bg-cover bg-center md:size-[50px]"
          style={{ backgroundImage: `url(${displayedUser.imgUrl})` }}
        />
      ) : (
        <FaCircleUser
          aria-hidden="true"
          className="size-10 text-yellow-100 md:size-[50px]"
        />
      )}
      <div className="hidden flex-col items-end gap-2 sm:flex">
        <p className="font-heading text-h5">{displayedUser.fullName}</p>
        <p className="text-b3">Angkatan {displayedUser.batch}</p>
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

  const brand = (
    <div className="flex min-w-0 items-center gap-3 md:gap-8">
      <BrandLogo src={logoSrc} priority />
      {displayedUser && (
        <div className="hidden min-w-0 flex-col gap-2 text-foreground sm:flex">
          <p className="truncate font-heading text-h4">PPMB KMBUI 2026</p>
          <p className="truncate text-b2">Begin your journey, build your story</p>
        </div>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        "flex min-h-[100px] w-full items-center px-4 py-4 md:px-[60px]",
        className,
      )}
      style={backgroundStyle}
      {...props}
    >
      <div className="flex w-full items-center justify-between gap-6">
        {brand}

        {displayedUser ? (
          <div className="flex shrink-0 items-center gap-3 text-foreground md:gap-5">
            {profileHref ? (
              <a
                href={profileHref}
                className="flex items-center gap-3 md:gap-5"
                aria-label={`Buka profil ${displayedUser.fullName}`}
              >
                {profileContent}
              </a>
            ) : (
              <div className="flex items-center gap-3 md:gap-5">
                {profileContent}
              </div>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Keluar"
              title="Keluar"
              className="grid size-10 place-items-center rounded-full text-yellow-100 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 md:size-[50px]"
            >
              <FaArrowRightFromBracket aria-hidden="true" className="size-5 md:size-6" />
            </button>
          </div>
        ) : (
          <div className="flex min-w-0 flex-col items-end gap-2 text-right text-foreground">
            <p className="truncate font-heading text-h4">PPMB KMBUI 2026</p>
            <p className="hidden truncate text-b2 sm:block">
              Begin your journey, build your story
            </p>
          </div>
        )}
      </div>
    </header>
  );
}
