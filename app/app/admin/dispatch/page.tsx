import { getPlatformSettings } from "@/lib/organization/platform-settings";
import { listShipments } from "@/lib/actions/shipments";
import { billingMapFromShipments, displayName } from "@/lib/data/entity-relations";
import { listDriversForDispatch } from "@/lib/actions/driver-availability";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DispatchAssign } from "./DispatchAssign";
import { DispatchBillingBar } from "./DispatchBillingBar";

export default async function AdminDispatchPage() {
  const [{ data: drivers }, { dataWithRelations }, platform] = await Promise.all([
    listDriversForDispatch(),
    listShipments({ limit: 80, withRelations: true }),
    getPlatformSettings(),
  ]);

  const shipments = dataWithRelations ?? [];
  const active = shipments.filter((s) =>
    [
      "booked",
      "pickup_scheduled",
      "out_for_delivery",
      "in_transit",
      "at_origin_hub",
      "at_destination_hub",
    ].includes(s.status)
  );

  const billingMap = billingMapFromShipments(active, {
    requirePaidInvoice: platform.dispatch_requires_paid_invoice,
  });

  return (
    <div>
      <PageHeader
        title="Dispatch"
        description={
          platform.dispatch_requires_paid_invoice
            ? "Invoice must be paid to assign. Customer and current driver are shown per shipment."
            : "Assign drivers to active shipments. Billing gate is off in platform settings."
        }
      />
      <div className="space-y-4">
        {active.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No shipments ready for dispatch. Booked shipments appear here once created.
          </p>
        )}
        {active.map((s) => {
          const billing = billingMap[s.id];
          const driver = s.assignment?.driver;
          return (
            <div
              key={s.id}
              className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 rounded-lg border p-4 bg-background"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-mono font-medium">{s.tracking_number}</p>
                <p className="text-sm text-muted-foreground">
                  {s.origin} → {s.destination}
                </p>
                <p className="text-xs capitalize">{s.status.replace(/_/g, " ")}</p>
                <p className="text-xs text-muted-foreground">
                  Customer: {displayName(s.customer)}
                  {driver ? ` · Driver: ${displayName(driver)}` : ""}
                </p>
              </div>
              <DispatchBillingBar
                shipmentId={s.id}
                trackingNumber={s.tracking_number}
                billing={billing}
              />
              <DispatchAssign
                shipmentId={s.id}
                drivers={drivers ?? []}
                billing={billing}
                suggestNearest={platform.auto_assign_nearest_driver}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
