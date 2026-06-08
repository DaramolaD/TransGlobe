import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { IconTile, iconToneAt } from "@/components/IconTile";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  index?: number;
  href?: string;
  id?: string;
  className?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  index = 0,
  href,
  id,
  className,
}: FeatureCardProps) {
  return (
    <div id={id} className={cn("card-calm flex flex-col h-full", className)}>
      <IconTile
        icon={Icon}
        tone={iconToneAt(index)}
        size="md"
        className="mb-6"
      />
      <h3 className="type-card-title mb-3">{title}</h3>
      <p className="type-card-body mb-6 flex-1">{description}</p>
      {features?.length ? (
        <ul className="space-y-2 mb-6">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-platinum-dark"
            >
              <span className="size-1.5 rounded-full bg-platinum-mid shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      ) : null}
      {href ? (
        <div className="pt-6 mt-auto border-t border-platinum-light/80">
          <button type="button" className="type-link flex items-center gap-2">
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
