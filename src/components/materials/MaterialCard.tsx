import Link from "next/link";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MaterialCardProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  descriptionClassName?: string;
  thumbnail?: ReactNode;
  icon?: ReactNode;
  href?: string;
}

function MaterialCardContent({
  title,
  description,
  descriptionClassName,
  thumbnail,
  icon,
}: Pick<
  MaterialCardProps,
  "title" | "description" | "descriptionClassName" | "thumbnail" | "icon"
>) {
  return (
    <>
      <div className="h-[214px] w-full overflow-hidden rounded-lg bg-white/10">
        {thumbnail}
      </div>
      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-yellow-500 text-blue-900"
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-subheading text-s3">{title}</h3>
          <p className={cn("mt-2 text-b3", descriptionClassName)}>
            {description}
          </p>
        </div>
      </div>
    </>
  );
}

export function MaterialCard({
  title,
  description,
  descriptionClassName,
  thumbnail,
  icon,
  href,
  className,
  ...props
}: MaterialCardProps) {
  const isExternalHref = href?.startsWith("http://") || href?.startsWith("https://");
  const styles = cn(
    "flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-blue-200/25 px-6 py-4 transition-colors",
    href && "hover:bg-blue-200/30",
    className,
  );
  const content = (
    <MaterialCardContent
      title={title}
      description={description}
      descriptionClassName={descriptionClassName}
      icon={icon}
      thumbnail={thumbnail}
    />
  );

  if (href) {
    if (isExternalHref) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={styles}
          {...props}
        >
          {content}
        </a>
      );
    }

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
