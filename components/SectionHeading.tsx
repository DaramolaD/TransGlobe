import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: string;
  eyebrow?: string;
  variant?: "light" | "dark";
  align?: "center" | "left";
  size?: "default" | "large";
  className?: string;
};

export function SectionHeading({
  title,
  subtitle,
  eyebrow,
  variant = "light",
  align = "center",
  size = "default",
  className,
}: SectionHeadingProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center",
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "type-eyebrow",
            isDark ? "text-platinum-mid" : "text-platinum-dark"
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          "type-section-title",
          size === "large" && "lg:text-6xl",
          isDark ? "text-white" : "text-graphite-dark"
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "type-section-lead",
            align === "center" && "mx-auto",
            isDark ? "text-platinum-mid" : "text-platinum-dark"
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
