"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listFacilityLocations } from "@/lib/actions/facilities";
import { updateShipmentStatus } from "@/lib/actions/shipments";
import type { ShipmentStatus } from "@/lib/types/database";
import type { FacilityLocationRow } from "@/lib/types/tracking";
import { toast } from "sonner";

const STATUSES: ShipmentStatus[] = [
  "booked",
  "pickup_scheduled",
  "picked_up",
  "at_origin_hub",
  "in_transit",
  "customs",
  "at_destination_hub",
  "out_for_delivery",
  "delivered",
  "exception",
];

const NONE_FACILITY = "__none__";

export function ShipmentStatusFields({
  shipmentId,
  currentStatus,
  onUpdated,
  layout = "dialog",
}: {
  shipmentId: string;
  currentStatus: string;
  onUpdated?: () => void;
  layout?: "dialog" | "inline";
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState<FacilityLocationRow[]>([]);
  const [facilityId, setFacilityId] = useState<string>(NONE_FACILITY);
  const [isPlanned, setIsPlanned] = useState(false);

  useEffect(() => {
    listFacilityLocations().then((r) => {
      if (!r.error) setFacilities(r.data as FacilityLocationRow[]);
    });
  }, []);

  async function apply() {
    setLoading(true);
    const r = await updateShipmentStatus(shipmentId, status as ShipmentStatus, {
      facilityLocationId:
        facilityId !== NONE_FACILITY ? facilityId : undefined,
      isPlanned,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Status updated");
      onUpdated?.();
    }
  }

  const isDialog = layout === "dialog";

  return (
    <div
      className={
        isDialog
          ? "flex flex-col gap-4"
          : "flex flex-wrap gap-1.5 items-center max-w-[200px] sm:max-w-none"
      }
    >
      <div className={isDialog ? "space-y-2 w-full" : undefined}>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger
            className={
              isDialog ? "w-full" : "h-8 w-full min-w-[7.5rem] max-w-[9.5rem] text-xs"
            }
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isDialog ? (
        <>
          <div className="space-y-2">
            <Label>At facility (optional)</Label>
            <Select value={facilityId} onValueChange={setFacilityId}>
              <SelectTrigger>
                <SelectValue placeholder="Select warehouse or hub" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE_FACILITY}>No facility — text only</SelectItem>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.name}
                    {f.city ? ` · ${f.city}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Timestamp is recorded automatically. Coordinates come from the facility
              you manage under Settings → Locations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="planned-stop"
              checked={isPlanned}
              onCheckedChange={(v) => setIsPlanned(v === true)}
            />
            <Label htmlFor="planned-stop" className="font-normal text-sm cursor-pointer">
              Planned future stop (shown on full-journey map only)
            </Label>
          </div>
        </>
      ) : null}

      <Button
        type="button"
        className={isDialog ? "w-full sm:w-auto" : "shrink-0"}
        onClick={apply}
        disabled={loading}
      >
        {loading ? "Saving…" : "Save status"}
      </Button>
    </div>
  );
}

/** @deprecated Prefer row menu + ShipmentStatusDialog */
export function ShipmentStatusForm({
  shipmentId,
  currentStatus,
}: {
  shipmentId: string;
  currentStatus: string;
}) {
  return (
    <ShipmentStatusFields
      shipmentId={shipmentId}
      currentStatus={currentStatus}
      layout="inline"
    />
  );
}
