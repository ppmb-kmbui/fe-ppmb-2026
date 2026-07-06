import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";
import { FaCircleUser } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface HeaderUser {
  fullName: string;
  batch?: string | number;
  subtitle?: string;
}

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  user?: HeaderUser;
  logoSrc?: string;
  profileHref?: string;
}

export function Header({
  user,
  logoSrc,
  profileHref = "/profil",
  className,
  style,
  ...props
}: HeaderProps) {
  const backgroundStyle: CSSProperties = {
    backgroundImage: "var(--gradient-app-header)",
    ...style,
  };

  const brand = (
    <div className="flex min-w-0 items-center gap-3 md:gap-8">
      <BrandLogo src={logoSrc} priority />
      {user && (
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

        {user ? (
          <Link
            href={profileHref}
            className="flex shrink-0 items-center gap-3 text-foreground md:gap-5"
            aria-label={`Buka profil ${user.fullName}`}
          >
            <FaCircleUser
              aria-hidden="true"
              className="size-10 text-yellow-100 md:size-[50px]"
            />
            <div className="hidden flex-col items-end gap-2 sm:flex">
              <p className="font-heading text-h5">{user.fullName}</p>
              {(user.subtitle || user.batch) && (
                <p className="text-b3">
                  {user.subtitle || `Angkatan ${user.batch}`}
                </p>
              )}
            </div>
          </Link>
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
