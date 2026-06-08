import Link from "next/link";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({
  name,
  logoUrl,
  href = "/",
  textClassName,
  iconClassName,
}: {
  name: string;
  logoUrl?: string | null;
  href?: string;
  textClassName?: string;
  iconClassName?: string;
}) {
  const mark = (
    <span className="inline-flex items-center gap-2">
      {logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className={cn("h-10 w-10 rounded-lg object-contain", iconClassName)}
        />
      ) : (
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg bg-ember-main",
            iconClassName
          )}
        >
          <Package className="h-6 w-6 text-white" />
        </span>
      )}
      <span className={cn("font-sans font-bold tracking-tight", textClassName)}>
        {name}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {mark}
      </Link>
    );
  }

  return mark;
}
