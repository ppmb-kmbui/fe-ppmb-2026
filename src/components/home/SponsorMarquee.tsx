import { cn } from "@/lib/cn";

interface SponsorMarqueeProps {
  items: { src: string; alt: string }[];
  className?: string;
  speed?: number;
}

export function SponsorMarquee({
  items,
  className,
  speed = 30,
}: SponsorMarqueeProps) {
  return (
    <div className={cn("relative overflow-hidden group/marquee", className)}>
      <div
        className="flex gap-4 animate-[marquee_var(--marquee-speed,30s)_linear_infinite] group-hover/marquee:[animation-play-state:paused]"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {items.map((item) => (
          <img
            key={`a-${item.src}-${item.alt}`}
            src={item.src}
            alt={item.alt}
            className="h-50 w-auto shrink-0 object-contain"
          />
        ))}
        {items.map((item) => (
          <img
            key={`b-${item.src}-${item.alt}`}
            src={item.src}
            alt={item.alt}
            className="h-50 w-auto shrink-0 object-contain"
          />
        ))}
      </div>
    </div>
  );
}
