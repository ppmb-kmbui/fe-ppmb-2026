"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/cn";

export interface BrandLogoProps {
  src?: string;
  alt?: string;
  size?: number;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({
  src = "/assets/logo_ppmb.webp",
  alt = "Logo PPMB KMBUI 2026",
  size = 64,
  className,
  priority = false,
}: BrandLogoProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const hasError = failedSrc === src;

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={`${alt} belum tersedia`}
        title="Aset logo belum diekspor dari Figma"
        className={cn(
          "grid shrink-0 place-items-center rounded-full border border-dashed border-yellow-300 bg-purple-800 text-center font-subheading text-s6 font-semibold leading-tight text-yellow-100",
          className,
        )}
        style={{ width: size, height: size }}
      >
        PPMB
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      onError={() => setFailedSrc(src)}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
