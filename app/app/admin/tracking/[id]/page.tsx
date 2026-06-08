import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LiveTrackingPanel } from "@/components/tracking/LiveTrackingPanel";
import { ShipmentTrackingSettings } from "@/components/tracking/ShipmentTrackingSettings";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { getShipmentWithRelations } from "@/lib/actions/shipments";
import { ShipmentRelationsCard } from "@/components/dashboard/ShipmentRelationsCard";
import { getDashboardTracking } from "@/lib/tracking/dashboard";
import { DASHBOARD_TRACKING_PATH } from "@/lib/dashboard/tracking-links";
import { Button } from "@/components/ui/button";
import { TrackingId } from "@/components/dashboard/TrackingId";

export default async function AdminShipmentTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data: initial, error }, { data: relations }] = await Promise.all([
    getDashboardTracking(id),
    getShipmentWithRelations(id),
  ]);

  if (error || !initial) notFound();

  const { shipment } = initial;

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="-ml-2 gap-2" asChild>
        <Link href={DASHBOARD_TRACKING_PATH}>
          <ArrowLeft className="h-4 w-4" />
          Back to tracking search
        </Link>
      </Button>

      <div className="space-y-1">
        <TrackingId value={shipment.tracking_number} size="md" />
        <PageHeader
          title="Shipment tracking"
          description={`${shipment.origin} → ${shipment.destination} · Internal operations view`}
        />
      </div>

      {relations ? <ShipmentRelationsCard shipment={relations} /> : null}

      <ShipmentTrackingSettings
        shipmentId={shipment.id}
        initialMode={shipment.map_visibility_mode}
      />

      <LiveTrackingPanel initial={initial} />

      <ActivitySection
        entityType="shipment"
        entityId={shipment.id}
        title="Shipment activity"
        description="Status changes, driver assignment, and dispatch events."
      />
    </div>
  );
}
