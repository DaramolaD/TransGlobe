import { cn } from "@/lib/utils";
import { formatTrackingNumber } from "@/lib/tracking/tracking-number";

export function TrackingId({
  value,
  className,
  size = "sm",
}: {
  value: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const formatted = formatTrackingNumber(value);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-primary/15 bg-primary/5 font-mono font-semibold tracking-wide text-primary",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-1 text-sm",
        className
      )}
    >
      {formatted}
    </span>
  );
}
