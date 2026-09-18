import Image from "next/image";
import { cn } from "@/lib/cn";

interface SponsorMarqueeProps {
  items: { src: string; alt: string }[];
  className?: string;
  speed?: number;
}

export function SponsorMarquee({
  items,
  className,
  speed = 10,
}: SponsorMarqueeProps) {
  return (
    <div className={cn("relative overflow-hidden group/marquee", className)}>
      <div
        className="flex w-max animate-[marquee_var(--marquee-speed,30s)_linear_infinite] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 gap-4 pr-4"
            aria-hidden={copy === 1}
          >
            {items.map((item) => (
              <Image
                key={`${copy}-${item.src}`}
                src={`/${item.src}`}
                alt={copy === 0 ? item.alt : ""}
                width={200}
                height={200}
                className="h-50 w-auto shrink-0 object-contain"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
