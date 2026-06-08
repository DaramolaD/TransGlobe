import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

function initials(name: string, email?: string | null): string {
  const source = name.trim() || email?.split("@")[0] || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function UserTableCell({
  name,
  email,
}: {
  name: string;
  email?: string | null;
}) {
  const displayName = name.trim() || email || "—";
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="h-9 w-9 border bg-background shrink-0">
        <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
          {initials(displayName, email)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-medium text-sm leading-tight truncate">{displayName}</p>
        {email && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{email}</p>
        )}
      </div>
    </div>
  );
}

export function RouteTableCell({
  origin,
  destination,
}: {
  origin: string;
  destination: string;
}) {
  const full = `${origin} → ${destination}`;
  return (
    <div className="min-w-0 max-w-full" title={full}>
      <p className="text-sm font-medium truncate">{origin}</p>
      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 min-w-0">
        <ArrowRight className="h-3 w-3 shrink-0 text-primary/70" />
        <span className="truncate">{destination}</span>
      </p>
    </div>
  );
}

/** Single-line route for dense tables — truncates with ellipsis */
export function RouteInlineCell({
  origin,
  destination,
  className,
}: {
  origin: string;
  destination: string;
  className?: string;
}) {
  const full = `${origin} → ${destination}`;
  return (
    <span
      className={cn("text-sm truncate block min-w-0 max-w-full", className)}
      title={full}
    >
      <span className="font-medium">{origin}</span>
      <span className="text-muted-foreground"> → </span>
      <span className="font-medium">{destination}</span>
    </span>
  );
}

/** Plain text cell with ellipsis and optional tooltip */
export function TableTextCell({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  const text =
    title ??
    (typeof children === "string" || typeof children === "number"
      ? String(children)
      : undefined);
  return (
    <span
      className={cn("text-sm truncate block min-w-0 max-w-full", className)}
      title={text}
    >
      {children}
    </span>
  );
}

export function ActiveStatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200"
          : "bg-muted text-muted-foreground ring-1 ring-border"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-muted-foreground/50"
        )}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
