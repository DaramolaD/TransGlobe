"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShipmentStatusFields } from "./ShipmentStatusForm";

export function ShipmentStatusDialog({
  open,
  onOpenChange,
  shipmentId,
  currentStatus,
  trackingNumber,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shipmentId: string;
  currentStatus: string;
  trackingNumber?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update status</DialogTitle>
          <DialogDescription>
            {trackingNumber
              ? `Change lifecycle status for ${trackingNumber}.`
              : "Change lifecycle status for this shipment."}
          </DialogDescription>
        </DialogHeader>
        <ShipmentStatusFields
          shipmentId={shipmentId}
          currentStatus={currentStatus}
          layout="dialog"
          onUpdated={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
