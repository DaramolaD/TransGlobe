"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateShipmentStatus } from "@/lib/actions/shipments";
import { completeAssignment } from "@/lib/actions/assignments";
import { toast } from "sonner";
import type { ShipmentStatus } from "@/lib/types/database";
import { DriverLocationPublisher } from "@/components/tracking/DriverLocationPublisher";

export function DriverJobCard({
  assignmentId,
  shipment,
  gpsUploadIntervalSec,
}: {
  assignmentId: string;
  gpsUploadIntervalSec?: number;
  shipment: {
    id: string;
    tracking_number: string;
    origin: string;
    destination: string;
    status: string;
  };
}) {
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: ShipmentStatus, label: string) {
    setLoading(true);
    const r = await updateShipmentStatus(shipment.id, status, { description: label });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else toast.success(label);
  }

  async function complete() {
    setLoading(true);
    await updateStatus("delivered", "Delivered with POD");
    await completeAssignment(assignmentId);
    setLoading(false);
    toast.success("Job completed");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono text-base">{shipment.tracking_number}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">
          {shipment.origin} → {shipment.destination}
        </p>
        <p className="text-xs text-muted-foreground capitalize">
          {shipment.status.replace(/_/g, " ")}
        </p>
        <DriverLocationPublisher
          shipmentId={shipment.id}
          uploadIntervalSec={gpsUploadIntervalSec}
        />
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("picked_up", "Picked up")}>
            Picked up
          </Button>
          <Button size="sm" variant="outline" disabled={loading} onClick={() => updateStatus("out_for_delivery", "Out for delivery")}>
            Out for delivery
          </Button>
          <Button size="sm" disabled={loading} onClick={complete}>
            Mark delivered
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
