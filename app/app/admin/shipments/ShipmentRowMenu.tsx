"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createInvoiceFromShipment } from "@/lib/actions/invoices";
import type { ShipmentBillingState } from "@/lib/invoices/shipment-billing";
import { ShipmentStatusDialog } from "./ShipmentStatusDialog";
import { toast } from "sonner";

export function ShipmentRowMenu({
  shipmentId,
  trackingNumber,
  currentStatus,
  trackingHref,
  billing,
}: {
  shipmentId: string;
  trackingNumber: string;
  currentStatus: string;
  trackingHref: string;
  billing: ShipmentBillingState;
}) {
  const router = useRouter();
  const [statusOpen, setStatusOpen] = useState(false);
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  async function createInvoice() {
    setCreatingInvoice(true);
    const r = await createInvoiceFromShipment(shipmentId);
    setCreatingInvoice(false);
    if (r.error) toast.error(r.error);
    else if (r.existing && r.invoiceId) {
      toast.info("Invoice already exists");
      router.refresh();
    } else {
      toast.success("Invoice created");
      router.refresh();
    }
  }

  return (
    <>
      <div className="flex justify-end" data-no-row-click>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground data-[state=open]:bg-muted"
              aria-label="Shipment actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={trackingHref} className="flex items-center cursor-pointer">
                <MapPin className="mr-2 h-4 w-4" />
                Track shipment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setStatusOpen(true);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Update status
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {billing.hasInvoice && billing.invoiceId ? (
              <DropdownMenuItem asChild>
                <Link
                  href={`/app/admin/invoices/${billing.invoiceId}`}
                  className="flex items-center cursor-pointer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View invoice
                  {billing.invoiceNumber ? (
                    <span className="ml-auto font-mono text-xs text-muted-foreground">
                      {billing.invoiceNumber}
                    </span>
                  ) : null}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                disabled={creatingInvoice}
                onSelect={(e) => {
                  e.preventDefault();
                  void createInvoice();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                {creatingInvoice ? "Creating…" : "Create invoice"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ShipmentStatusDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        shipmentId={shipmentId}
        currentStatus={currentStatus}
        trackingNumber={trackingNumber}
      />
    </>
  );
}
