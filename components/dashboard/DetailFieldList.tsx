import { cn } from "@/lib/utils";

/** Label – value on one row (side by side) */
export function DetailInlineRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 min-w-0 text-sm py-0.5">
      <span className="w-[5.5rem] shrink-0 text-xs font-medium text-muted-foreground pt-0.5">
        {label}
      </span>
      <span className="shrink-0 text-muted-foreground/60 pt-0.5" aria-hidden>
        –
      </span>
      <div className="min-w-0 flex-1 font-medium leading-snug">{children}</div>
    </div>
  );
}

/** Stacked lines: Joined – date, Email – address */
export function DetailMetaStack({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 text-sm", className)}>
      {items.map((item) => (
        <DetailInlineRow key={item.label} label={item.label}>
          {item.value}
        </DetailInlineRow>
      ))}
    </div>
  );
}

export function DetailFieldList({
  fields,
}: {
  fields: { label: string; value: React.ReactNode }[];
}) {
  return (
    <dl className="space-y-2 text-sm border-t pt-4">
      {fields.map((field) => (
        <div key={field.label}>
          <DetailInlineRow label={field.label}>{field.value}</DetailInlineRow>
        </div>
      ))}
    </dl>
  );
}
