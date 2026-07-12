import type { CSSProperties } from "react";

import { BrandLogo } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface MobileAuthHeaderProps {
  className?: string;
}

const cardBackground: CSSProperties = {
  backgroundImage: "var(--gradient-app-header)",
};

/**
 * Header khusus tampilan mobile untuk halaman login & signup.
 * Berupa kartu gradient teal→ungu dengan maskot dan judul rata kanan,
 * sesuai desain Figma "MobileHeader/Variant3". Header desktop tetap
 * memakai komponen `Header` bersama.
 */
export function MobileAuthHeader({ className }: MobileAuthHeaderProps) {
  return (
    <div className={cn("px-4 pt-4", className)}>
      <div
        className="flex items-center justify-between gap-4 overflow-hidden rounded-2xl px-4 pb-4 pt-5"
        style={cardBackground}
      >
        <BrandLogo size={64} priority className="size-16" />
        <div className="flex flex-col items-end gap-2 text-right text-foreground">
          <p className="font-heading text-h6">PPMB KMBUI 2026</p>
          <p className="font-body text-b4">
            Begin your journey, build your story
          </p>
        </div>
      </div>
    </div>
  );
}
