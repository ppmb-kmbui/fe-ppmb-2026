import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MaterialCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  thumbnail?: ReactNode;
  href?: string;
}

function MaterialCardContent({
  title,
  description,
  thumbnail,
}: Pick<MaterialCardProps, "title" | "description" | "thumbnail">) {
  return (
    <>
      <div className="h-[214px] w-full overflow-hidden rounded-lg bg-white">
        {thumbnail}
      </div>
      <div className="flex items-start gap-2">
        <span aria-hidden="true" className="mt-0.5 size-8 shrink-0 rounded-full bg-white" />
        <div className="min-w-0">
          <h3 className="font-subheading text-s3">{title}</h3>
          <p className="mt-2 text-b3">{description}</p>
        </div>
      </div>
    </>
  );
}

export function MaterialCard({
  title,
  description,
  thumbnail,
  href,
  className,
  ...props
}: MaterialCardProps) {
  const styles = cn(
    "flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-blue-200/25 px-6 py-4 transition-colors hover:bg-blue-200/30",
    className,
  );
  const content = (
    <MaterialCardContent title={title} description={description} thumbnail={thumbnail} />
  );

  if (href) {
    return (
      <Link href={href} className={styles} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <article className={styles} {...props}>
      {content}
    </article>
  );
}
