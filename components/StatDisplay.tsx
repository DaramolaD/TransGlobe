import { cn } from "@/lib/utils";

type StatDisplayProps = {
  value: string;
  label: string;
  variant?: "light" | "dark" | "card";
  align?: "left" | "center";
  className?: string;
};

/** Stats sit below headings in the hierarchy — never compete with CTAs */
export function StatDisplay({
  value,
  label,
  variant = "light",
  align = "left",
  className,
}: StatDisplayProps) {
  const isDark = variant === "dark";
  const valueClass =
    variant === "card"
      ? "text-graphite-dark"
      : isDark
        ? "text-white/95"
        : "text-graphite-dark";
  const labelClass =
    variant === "card"
      ? "text-platinum-dark"
      : isDark
        ? "text-platinum-mid"
        : "text-platinum-dark";

  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <div className={cn("type-stat-value", valueClass)}>{value}</div>
      <div className={cn("type-stat-label mt-1", labelClass)}>{label}</div>
    </div>
  );
}
