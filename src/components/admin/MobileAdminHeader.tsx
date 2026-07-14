import Link from "next/link";
import type { CSSProperties, HTMLAttributes } from "react";
import { FaCircleUser } from "react-icons/fa6";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  logoSrc?: string;
  profileHref?: string;
}

export function MobileAdminHeader({
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

  return (
    <header
      className={cn("px-4 pt-4", className)}
      {...props}
    >
      <div
        className="flex items-center justify-between overflow-hidden px-4 py-4"
        style={backgroundStyle}
      >
        <BrandLogo src={logoSrc} priority />

        <Link
          href={profileHref}
          aria-label="Buka profil"
          className="text-yellow-100 transition-opacity hover:opacity-80"
        >
          <FaCircleUser className="size-10" />
        </Link>
      </div>
    </header>
  );
}