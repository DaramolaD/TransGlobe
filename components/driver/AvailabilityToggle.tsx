"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setMyDriverAvailability } from "@/lib/actions/driver-availability";
import type { DriverAvailabilityStatus } from "@/lib/types/database";
import { toast } from "sonner";

const OPTIONS: { value: DriverAvailabilityStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "busy", label: "Busy" },
  { value: "offline", label: "Offline" },
];

export function AvailabilityToggle({
  initialStatus = "offline",
  initialReason = "",
}: {
  initialStatus?: DriverAvailabilityStatus;
  initialReason?: string | null;
}) {
  const [status, setStatus] = useState<DriverAvailabilityStatus>(initialStatus);
  const [reason, setReason] = useState(initialReason ?? "");
  const [saving, setSaving] = useState(false);

  // Keep in sync if server re-renders
  useEffect(() => {
    setStatus(initialStatus);
    setReason(initialReason ?? "");
  }, [initialStatus, initialReason]);

  async function save() {
    setSaving(true);
    const r = await setMyDriverAvailability({ status, reason });
    setSaving(false);
    if (r.error) toast.error(r.error);
    else toast.success("Availability updated");
  }

  return (
    <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">Availability</p>
          <p className="text-xs text-muted-foreground">
            Controls whether dispatch should consider you for new jobs.
          </p>
        </div>
        <div className="w-[180px]">
          <Select value={status} onValueChange={(v) => setStatus(v as DriverAvailabilityStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Optional note (e.g. “Lunch”, “Refueling”, “In traffic”). Visible to admins.
        </p>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason (optional)"
          rows={2}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}

