import Link from "next/link";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { ShipmentBillingState } from "@/lib/invoices/shipment-billing";

/** Invoice number column — link to admin invoice detail */
export function ShipmentInvoiceCell({ billing }: { billing: ShipmentBillingState }) {
  if (!billing.hasInvoice || !billing.invoiceId) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  return (
    <Link
      href={`/app/admin/invoices/${billing.invoiceId}`}
      className="text-sm font-medium text-primary hover:underline font-mono truncate block max-w-[120px]"
      title={billing.invoiceNumber ?? undefined}
      data-no-row-click
    >
      {billing.invoiceNumber}
    </Link>
  );
}

/** Invoice status column — sent, paid, overdue, etc. */
export function ShipmentInvoiceStatusCell({
  billing,
}: {
  billing: ShipmentBillingState;
}) {
  if (!billing.hasInvoice || !billing.invoiceStatus) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }

  if (billing.invoiceStatus === "draft" || billing.invoiceStatus === "cancelled") {
    return <span className="text-sm text-muted-foreground capitalize">{billing.invoiceStatus}</span>;
  }

  return <StatusBadge status={billing.invoiceStatus} />;
}
