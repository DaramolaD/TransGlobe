"use client";

import { MapPin, Package } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  DeliveryTimeline,
  friendlyEventTime,
  type DeliveryTimelineStep,
} from "./DeliveryTimeline";
import type { PublicTrackingPayload } from "@/lib/types/tracking";
import { cn } from "@/lib/utils";

function statusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

function buildTimelineSteps(
  events: PublicTrackingPayload["events"],
  shipmentStatus: string
): DeliveryTimelineStep[] {
  if (events.length === 0) {
    return [
      {
        id: "waiting",
        title: "Awaiting first scan",
        subtitle: "Updates appear here as your shipment moves",
        state: "current",
      },
    ];
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.event_at).getTime() - new Date(b.event_at).getTime()
  );

  return sorted.map((e, index) => {
    const isLast = index === sorted.length - 1;

    const place =
      e.facility?.name ??
      e.location ??
      null;

    return {
      id: e.id,
      title: statusLabel(e.status),
      subtitle: friendlyEventTime(e.event_at),
      detail:
        place || e.description || e.is_planned ? (
          <div className="space-y-1 text-sm text-muted-foreground">
            {place ? (
              <p className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary/70" />
                <span>
                  {place}
                  {e.facility?.facility_type ? (
                    <span className="text-muted-foreground/80">
                      {" "}
                      · {e.facility.facility_type.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </span>
              </p>
            ) : null}
            {e.description ? <p>{e.description}</p> : null}
            {e.is_planned ? (
              <p className="text-xs text-amber-700">Planned stop</p>
            ) : null}
          </div>
        ) : undefined,
      state: isLast ? "current" : "completed",
    };
  });
}

export function DeliveryTrackingReceipt({
  payload,
  title = "Delivery tracking",
  className,
}: {
  payload: PublicTrackingPayload;
  title?: string;
  className?: string;
}) {
  const { shipment, events } = payload;
  const steps = buildTimelineSteps(events, shipment.status);

  return (
    <div
      className={cn(
        "rounded-xl border bg-card shadow-sm overflow-hidden",
        className
      )}
    >
      <div className="px-5 py-4 border-b bg-muted/30 space-y-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </p>
        </div>

        <div className="rounded-lg border border-dashed bg-background px-4 py-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Tracking number
          </p>
          <p className="font-mono text-lg font-bold tracking-wide">
            {shipment.tracking_number}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Delivery status
          </p>
          <StatusBadge status={shipment.status} />
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p className="capitalize font-medium text-foreground/80">
            {shipment.service_type.replace(/_/g, " ")} service
          </p>
          {shipment.driver_first_name ? (
            <p>
              <span className="text-foreground/80">Courier:</span>{" "}
              {shipment.driver_first_name}
            </p>
          ) : null}
          <p className="flex items-start gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70 mt-0.5" />
            <span>
              <span className="text-foreground/80">Route:</span> {shipment.origin} →{" "}
              {shipment.destination}
            </span>
          </p>
          {shipment.estimated_delivery ? (
            <p>Estimated delivery: {shipment.estimated_delivery}</p>
          ) : null}
        </div>
      </div>

      <div className="px-5 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-1.5">
          <Package className="h-3.5 w-3.5" />
          Tracking timeline
        </p>
        <DeliveryTimeline steps={steps} />
      </div>
    </div>
  );
}
