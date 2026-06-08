"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  createInvoiceFromShipment,
  sendInvoice,
} from "@/lib/actions/invoices";
import type { ShipmentBillingState } from "@/lib/invoices/shipment-billing";
import { toast } from "sonner";
import { FileText, Send } from "lucide-react";

export function DispatchBillingBar({
  shipmentId,
  trackingNumber,
  billing,
}: {
  shipmentId: string;
  trackingNumber: string;
  billing: ShipmentBillingState;
}) {
  const [loading, setLoading] = useState(false);

  async function quickCreate(send: boolean) {
    setLoading(true);
    const r = await createInvoiceFromShipment(shipmentId, { send });
    setLoading(false);
    if (r.error) toast.error(r.error);
    else if (r.existing) toast.info(`Invoice ${r.invoiceNumber} already exists`);
    else toast.success(send ? "Invoice created and sent" : "Draft invoice created");
  }

  async function quickSend() {
    if (!billing.invoiceId) return;
    setLoading(true);
    const r = await sendInvoice(billing.invoiceId);
    setLoading(false);
    if (r.error) toast.error(r.error);
    else toast.success("Invoice sent to customer");
  }

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Billing</span>
        {billing.invoiceStatus ? (
          <StatusBadge status={billing.invoiceStatus} />
        ) : (
          <span className="text-xs text-amber-700">No invoice</span>
        )}
        {billing.canAssignDriver && (
          <span className="text-xs text-green-700 font-medium">Ready to dispatch</span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {!billing.hasInvoice && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => quickCreate(false)}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Create invoice
            </Button>
            <Button size="sm" disabled={loading} onClick={() => quickCreate(true)}>
              <Send className="h-3.5 w-3.5 mr-1" />
              Create &amp; send
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/app/admin/invoices?shipment=${shipmentId}`}>Custom amount</Link>
            </Button>
          </>
        )}
        {billing.invoiceStatus === "draft" && billing.invoiceId && (
          <>
            <Button size="sm" variant="outline" disabled={loading} onClick={quickSend}>
              Send to customer
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link href={`/app/admin/invoices/${billing.invoiceId}`}>Edit</Link>
            </Button>
          </>
        )}
        {billing.hasInvoice && billing.invoiceId && (
          <Button size="sm" variant="ghost" asChild>
            <Link href={`/app/admin/invoices/${billing.invoiceId}`}>
              {billing.invoiceNumber}
            </Link>
          </Button>
        )}
      </div>

      {!billing.canAssignDriver && billing.blockingReason && (
        <p className="text-xs text-muted-foreground max-w-xs">{billing.blockingReason}</p>
      )}
      {!billing.hasInvoice && (
        <p className="text-xs text-muted-foreground max-w-xs">
          Generate an invoice anytime for {trackingNumber}. Driver assignment unlocks after
          payment is marked paid.
        </p>
      )}
    </div>
  );
}
