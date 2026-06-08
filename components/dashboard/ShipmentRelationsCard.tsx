import Link from "next/link";
import { User, Receipt, Truck, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  displayName,
  type ShipmentWithRelations,
} from "@/lib/data/entity-relations";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";

export function ShipmentRelationsCard({
  shipment,
}: {
  shipment: ShipmentWithRelations;
}) {
  const driver = shipment.assignment?.driver;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Related records</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Customer
          </p>
          {shipment.customer ? (
            <>
              <p className="font-medium">{displayName(shipment.customer)}</p>
              {shipment.customer.email ? (
                <p className="text-muted-foreground text-xs">{shipment.customer.email}</p>
              ) : null}
              {shipment.customer.company_name ? (
                <p className="text-muted-foreground text-xs">
                  {shipment.customer.company_name}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-muted-foreground">Not linked</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Receipt className="h-3.5 w-3.5" />
            Invoice
          </p>
          {shipment.invoice ? (
            <>
              <Link
                href={`/app/admin/invoices/${shipment.invoice.id}`}
                className="font-mono font-medium text-primary hover:underline"
              >
                {shipment.invoice.invoice_number}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={shipment.invoice.status} />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {shipment.invoice.currency} {Number(shipment.invoice.amount).toFixed(2)}
                </span>
              </div>
            </>
          ) : (
            <Link
              href={`/app/admin/invoices?shipment=${shipment.id}`}
              className="text-primary hover:underline text-xs"
            >
              Create invoice →
            </Link>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Driver
          </p>
          {driver ? (
            <>
              <p className="font-medium">{displayName(driver)}</p>
              {shipment.assignment?.status ? (
                <StatusBadge status={shipment.assignment.status} />
              ) : null}
            </>
          ) : (
            <Link
              href="/app/admin/dispatch"
              className="text-primary hover:underline text-xs"
            >
              Assign on dispatch →
            </Link>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Quote
          </p>
          {shipment.quote ? (
            <>
              <p className="font-medium tabular-nums">
                {shipment.quote.currency}{" "}
                {shipment.quote.total_price != null
                  ? Number(shipment.quote.total_price).toFixed(2)
                  : "—"}
              </p>
              {shipment.quote.status ? (
                <StatusBadge status={shipment.quote.status} />
              ) : null}
            </>
          ) : (
            <p className="text-muted-foreground text-xs">Direct booking</p>
          )}
          <Link
            href={dashboardTrackingHref(shipment.id)}
            className="text-primary hover:underline text-xs inline-block mt-2"
          >
            Live tracking →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
