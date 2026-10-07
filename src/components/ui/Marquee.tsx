import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Marquee<T>({
  items,
  renderItem,
  keyFn,
  className,
  trackClassName,
  reverse = false,
  durationSeconds = 28,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyFn: (item: T, i: number) => string | number;
  className?: string;
  trackClassName?: string;
  reverse?: boolean;
  durationSeconds?: number;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className,
      )}
    >
      <div
        className={cn("flex w-max animate-marquee items-stretch gap-3", trackClassName)}
        style={{
          animationDuration: `${durationSeconds}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {items.map((item, i) => (
          <div key={`a-${keyFn(item, i)}`} className="shrink-0">
            {renderItem(item)}
          </div>
        ))}
        {items.map((item, i) => (
          <div key={`b-${keyFn(item, i)}`} className="shrink-0" aria-hidden>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
