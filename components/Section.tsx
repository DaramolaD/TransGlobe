import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionTone = "white" | "muted" | "navy";

type SectionProps = {
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  className?: string;
  containerClassName?: string;
};

const toneClass: Record<SectionTone, string> = {
  white: "section-white",
  muted: "section-muted",
  navy: "section-navy",
};

export function Section({
  children,
  tone = "white",
  id,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section id={id} className={cn("section-py", toneClass[tone], className)}>
      <div className={cn("container mx-auto px-4", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
