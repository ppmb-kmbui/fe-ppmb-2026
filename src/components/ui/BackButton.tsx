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
  "inline-flex h-[50px] w-fit min-w-[140px] items-center justify-center gap-2.5 rounded-[24px] bg-purple-600 px-5 py-2.5 text-b2 text-foreground transition-colors hover:bg-purple-700";

export function BackButton({
  href,
  label = "Kembali",
  className,
  onClick,
}: BackButtonProps) {
  const content = (
    <>
      <FaArrowLeft aria-hidden="true" className="size-5" />
      <span>{label}</span>
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
