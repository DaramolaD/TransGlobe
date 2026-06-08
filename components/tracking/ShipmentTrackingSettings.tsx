"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateShipmentMapVisibility } from "@/lib/actions/facilities";
import type { MapVisibilityMode } from "@/lib/types/tracking";
import { toast } from "sonner";

const MODES: { value: MapVisibilityMode; label: string; hint: string }[] = [
  {
    value: "past_and_current",
    label: "Past & current",
    hint: "Completed stops and where the shipment is now — no planned future hubs.",
  },
  {
    value: "full_journey",
    label: "Full journey",
    hint: "Includes planned future facilities (e.g. next hub).",
  },
  {
    value: "milestones_only",
    label: "Milestones only",
    hint: "Warehouse/hub checkpoints only — no live GPS trail.",
  },
  {
    value: "live_gps_only",
    label: "Live GPS only",
    hint: "Driver position trail only — no facility markers.",
  },
];

export function ShipmentTrackingSettings({
  shipmentId,
  initialMode,
}: {
  shipmentId: string;
  initialMode: MapVisibilityMode;
}) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);

  const selected = MODES.find((m) => m.value === mode);

  async function save() {
    setLoading(true);
    const r = await updateShipmentMapVisibility(shipmentId, mode);
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success("Map visibility updated");
      router.refresh();
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold">Customer map visibility</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Controls what route and stops appear on the public tracking map for this
          shipment.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="map-visibility">Visibility mode</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as MapVisibilityMode)}>
          <SelectTrigger id="map-visibility" className="max-w-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MODES.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected ? (
          <p className="text-xs text-muted-foreground">{selected.hint}</p>
        ) : null}
      </div>
      <Button type="button" size="sm" onClick={save} disabled={loading}>
        {loading ? "Saving…" : "Save map settings"}
      </Button>
    </div>
  );
}
