import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RelatedContextItem = {
  label: string;
  icon?: ReactNode;
  primary: ReactNode;
  secondary?: ReactNode;
  href?: string;
};

export function RelatedContextGrid({
  items,
  className,
}: {
  items: RelatedContextItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item) => {
        const body = (
          <div className="rounded-lg border bg-muted/20 px-4 py-3 h-full space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </p>
            <div className="text-sm font-medium leading-snug">{item.primary}</div>
            {item.secondary ? (
              <div className="text-xs text-muted-foreground">{item.secondary}</div>
            ) : null}
          </div>
        );

        if (item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="block rounded-lg transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {body}
            </Link>
          );
        }
        return <div key={item.label}>{body}</div>;
      })}
    </div>
  );
}
