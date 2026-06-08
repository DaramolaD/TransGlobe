import { cn } from "@/lib/utils";

export function DeliveryReceiptCard({
  title,
  subtitle,
  headerExtra,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card shadow-sm overflow-hidden",
        className
      )}
    >
      {(title || subtitle || headerExtra) && (
        <div className="px-5 pt-5 pb-4 border-b bg-muted/30 space-y-3">
          {title ? (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {subtitle ?? "Shipment"}
              </p>
              <p className="text-base font-bold tracking-tight mt-0.5">{title}</p>
            </div>
          ) : null}
          {headerExtra}
        </div>
      )}
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
