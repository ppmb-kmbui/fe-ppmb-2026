import Link from "next/link";
import type { MouseEventHandler } from "react";
import { FaArrowLeft } from "react-icons/fa6";

import { cn } from "@/lib/cn";

export interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const styles =
  "inline-flex size-[50px] items-center justify-center rounded-[24px] bg-purple-600 text-b2 text-foreground transition-colors hover:bg-purple-700 sm:w-fit sm:min-w-[140px] sm:gap-2.5 sm:px-5 sm:py-2.5";

export function BackButton({
  href,
  label = "Kembali",
  className,
  onClick,
}: BackButtonProps) {
  const content = (
    <>
      <FaArrowLeft aria-hidden="true" className="size-5" />
      <span className="hidden sm:inline">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(styles, className)}>
      {content}
    </button>
  );
}
