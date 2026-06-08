import Link from "next/link";
import { User, Package, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { displayName, type ProfileSnippet } from "@/lib/data/entity-relations";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";

type Props = {
  customer: ProfileSnippet | null;
  shipment: {
    id: string;
    tracking_number: string;
    origin: string;
    destination: string;
    status: string;
    service_type?: string;
  } | null;
  assignment?: {
    status: string;
    driver: ProfileSnippet | null;
  } | null;
  quote?: { total_price: number | null; currency: string; status?: string } | null;
};

export function InvoiceRelatedRecords({
  customer,
  shipment,
  assignment,
  quote,
}: Props) {
  return (
    <Card className="print:hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Related records</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" />
            Customer
          </p>
          {customer ? (
            <>
              <p className="font-medium">{displayName(customer)}</p>
              {customer.email ? (
                <p className="text-xs text-muted-foreground">{customer.email}</p>
              ) : null}
              {customer.company_name ? (
                <p className="text-xs text-muted-foreground">{customer.company_name}</p>
              ) : null}
            </>
          ) : (
            <p className="text-muted-foreground">—</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5" />
            Shipment
          </p>
          {shipment ? (
            <div className="flex flex-col gap-2">
              <Link href={dashboardTrackingHref(shipment.id)} className="hover:opacity-80">
                <TrackingId value={shipment.tracking_number} />
              </Link>
              <p className="text-xs text-muted-foreground">
                {shipment.origin} → {shipment.destination}
              </p>
              <StatusBadge status={shipment.status} />
              {quote ? (
                <p className="text-xs text-muted-foreground mt-1 tabular-nums">
                  Quote: {quote.currency}{" "}
                  {quote.total_price != null ? Number(quote.total_price).toFixed(2) : "—"}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-muted-foreground">No shipment linked</p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <Truck className="h-3.5 w-3.5" />
            Driver
          </p>
          {assignment?.driver ? (
            <>
              <p className="font-medium">{displayName(assignment.driver)}</p>
              <StatusBadge status={assignment.status} />
            </>
          ) : (
            <p className="text-muted-foreground text-xs">Not assigned yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
