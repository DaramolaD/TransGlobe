import Link from "next/link";
import { getPlatformSettings } from "@/lib/organization/platform-settings";
import { listShipments } from "@/lib/actions/shipments";
import { billingMapFromShipments } from "@/lib/data/entity-relations";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/button";
import { AdminShipmentsTable } from "./AdminShipmentsTable";

export default async function AdminShipmentsPage() {
  const [{ dataWithRelations }, platform] = await Promise.all([
    listShipments({ withRelations: true }),
    getPlatformSettings(),
  ]);
  const shipments = dataWithRelations ?? [];
  const billingMap = billingMapFromShipments(shipments, {
    requirePaidInvoice: platform.dispatch_requires_paid_invoice,
  });

  return (
    <div className="min-w-0 max-w-full">
      <PageHeader
        title="Shipments"
        description="One fetch loads customer, invoice, and driver for each row. Click a row for the full related summary."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/app/admin/invoices">Invoices</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/app/admin/dispatch">Dispatch</Link>
            </Button>
          </div>
        }
      />
      <AdminShipmentsTable shipments={shipments} billingMap={billingMap} />
    </div>
  );
}
