import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/** Calm tones for light UI — avoid heavy brand blocks on cards */
export const ICON_TONES = ["soft", "platinum", "soft", "platinum"] as const;
export type IconTone = "soft" | "platinum" | "slate" | "mid";

const toneClasses: Record<IconTone, string> = {
  soft: "bg-graphite-dark/[0.06] text-graphite-mid",
  platinum: "bg-platinum-off border border-platinum-light text-graphite-mid",
  slate: "bg-graphite-dark/[0.08] text-graphite-mid",
  mid: "bg-graphite-mid/10 text-graphite-mid",
};

const sizeClasses = {
  sm: { tile: "w-12 h-12 rounded-lg", icon: "w-6 h-6" },
  md: { tile: "w-16 h-16 rounded-xl", icon: "w-8 h-8" },
  lg: { tile: "w-20 h-20 rounded-2xl", icon: "w-10 h-10" },
};

type IconTileProps = {
  icon: LucideIcon;
  tone?: IconTone;
  size?: keyof typeof sizeClasses;
  className?: string;
};

export function IconTile({
  icon: Icon,
  tone = "soft",
  size = "md",
  className,
}: IconTileProps) {
  const s = sizeClasses[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0",
        s.tile,
        toneClasses[tone],
        className
      )}
    >
      <Icon className={s.icon} aria-hidden />
    </div>
  );
}

export function iconToneAt(index: number): IconTone {
  return ICON_TONES[index % ICON_TONES.length];
}

/** Muted icon on dark section backgrounds */
export function IconTileDark({
  icon: Icon,
  size = "md",
  className,
}: Omit<IconTileProps, "tone">) {
  const s = sizeClasses[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center shrink-0 bg-white/10 text-platinum-light",
        s.tile,
        className
      )}
    >
      <Icon className={s.icon} aria-hidden />
    </div>
  );
}
