"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignDriver } from "@/lib/actions/shipments";
import type { DispatchDriverOption } from "@/lib/actions/driver-availability";
import type { ShipmentBillingState } from "@/lib/invoices/shipment-billing";
import { toast } from "sonner";
import { Truck } from "lucide-react";

function driverLabel(d: DispatchDriverOption) {
  const name = d.full_name ?? d.email ?? "Driver";
  const gps = d.gps_online ? " · GPS on" : "";
  const status =
    d.availability === "available"
      ? ""
      : ` · ${d.availability}${d.availability_reason ? ` (${d.availability_reason})` : ""}`;
  return `${name}${gps}${status}`;
}

export function DispatchAssign({
  shipmentId,
  drivers,
  billing,
  suggestNearest = false,
}: {
  shipmentId: string;
  drivers: DispatchDriverOption[];
  billing: ShipmentBillingState;
  suggestNearest?: boolean;
}) {
  const [driverId, setDriverId] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeUnavailable, setIncludeUnavailable] = useState(false);

  const available = useMemo(
    () => drivers.filter((d) => d.availability === "available"),
    [drivers]
  );
  const others = useMemo(
    () => drivers.filter((d) => d.availability !== "available"),
    [drivers]
  );

  const selectable = includeUnavailable ? drivers : available;

  useEffect(() => {
    if (!suggestNearest || driverId || selectable.length === 0) return;
    const pick =
      selectable.find((d) => d.availability === "available" && d.gps_online) ??
      selectable.find((d) => d.availability === "available") ??
      selectable[0];
    if (pick) setDriverId(pick.id);
  }, [suggestNearest, driverId, selectable]);

  async function assign() {
    if (!driverId) return;
    setLoading(true);
    const r = await assignDriver(shipmentId, driverId, {
      forceUnavailable: includeUnavailable,
    });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else toast.success("Driver assigned");
  }

  if (drivers.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">No drivers — create driver accounts first.</p>
    );
  }

  if (!billing.canAssignDriver) {
    return (
      <div className="rounded-md border border-dashed border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900 max-w-[240px]">
        <Truck className="h-4 w-4 mb-1 opacity-70" />
        Driver assignment locked until invoice is <strong>paid</strong>.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={includeUnavailable}
          onChange={(e) => {
            setIncludeUnavailable(e.target.checked);
            setDriverId("");
          }}
          className="rounded"
        />
        Include busy / offline drivers
      </label>

      {suggestNearest && driverId && (
        <p className="text-xs text-muted-foreground">
          Suggested driver pre-selected (GPS online preferred). Confirm before assigning.
        </p>
      )}

      {available.length === 0 && !includeUnavailable && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1.5">
          No drivers marked <strong>Available</strong>. Check Drivers page or include others.
        </p>
      )}

      <div className="flex gap-2">
        <Select value={driverId} onValueChange={setDriverId}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select driver" />
          </SelectTrigger>
          <SelectContent>
            {!includeUnavailable ? (
              <SelectGroup>
                <SelectLabel>Available ({available.length})</SelectLabel>
                {available.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {driverLabel(d)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <>
                {available.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Available</SelectLabel>
                    {available.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {driverLabel(d)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {others.length > 0 && (
                  <SelectGroup>
                    <SelectLabel>Busy / offline</SelectLabel>
                    {others.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {driverLabel(d)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </>
            )}
          </SelectContent>
        </Select>
        <Button onClick={assign} disabled={loading || !driverId || selectable.length === 0}>
          Assign
        </Button>
      </div>
    </div>
  );
}
