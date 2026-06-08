import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating?: number;
  className?: string;
};

export function TestimonialCard({
  name,
  role,
  company,
  content,
  avatar,
  rating = 5,
  className,
}: TestimonialCardProps) {
  return (
    <article className={cn("card-calm flex flex-col", className)}>
      <div className="flex items-center gap-1 mb-6" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="w-4 h-4 text-amber-main/80 fill-amber-main/80"
            aria-hidden
          />
        ))}
      </div>
      <blockquote className="type-card-body flex-1 mb-8 leading-relaxed">
        &ldquo;{content}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-4 pt-6 border-t border-platinum-light">
        <div
          className="size-12 rounded-full bg-platinum-off border border-platinum-light flex items-center justify-center text-sm font-semibold text-graphite-mid"
          aria-hidden
        >
          {avatar}
        </div>
        <div className="min-w-0">
          <p className="type-card-title text-base truncate">{name}</p>
          <p className="text-sm text-platinum-dark truncate">{role}</p>
          <p className="text-xs text-platinum-mid font-medium uppercase tracking-wide mt-0.5 truncate">
            {company}
          </p>
        </div>
      </footer>
    </article>
  );
}
