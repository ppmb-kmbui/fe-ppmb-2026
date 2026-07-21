import Image from "next/image";
import type { HTMLAttributes } from "react";
import { FaUser } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface UserAvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  alt: string;
  imageClassName?: string;
}

/**
 * Displays a user photo or one consistent, neutral fallback for accounts that
 * have not uploaded a profile picture yet.
 */
export function UserAvatar({
  src,
  alt,
  imageClassName,
  className,
  ...props
}: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden bg-[#d9dee6] text-[#8b95a5]",
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="132px"
          unoptimized
          className={imageClassName || "object-cover"}
        />
      ) : (
        <span
          role="img"
          aria-label={alt}
          className="grid aspect-square h-[78%] place-items-center rounded-full bg-[#b8c0cc] text-[#f1f3f5]"
        >
          <FaUser
            aria-hidden="true"
            className="h-[56%] w-[56%] translate-y-[8%]"
          />
        </span>
      )}
    </span>
  );
}
