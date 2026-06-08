import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { LiveTrackingPanel } from "@/components/tracking/LiveTrackingPanel";
import {
  buildTrackingPayload,
  TRACKING_EVENT_SELECT,
  shipmentTrackingSelect,
} from "@/lib/tracking/queries";

export default async function PortalShipmentLivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  const supabase = await createClient();

  const { data: shipment } = await supabase
    .from("shipments")
    .select(shipmentTrackingSelect())
    .eq("id", id)
    .eq("created_by", profile!.id)
    .single();

  if (!shipment) notFound();

  const row = shipment as unknown as Record<string, unknown>;
  const shipmentId = row.id as string;

  const [{ data: events }, { data: locations }, { data: facilities }] =
    await Promise.all([
      supabase
        .from("tracking_events")
        .select(TRACKING_EVENT_SELECT)
        .eq("shipment_id", shipmentId)
        .eq("is_public", true)
        .order("event_at", { ascending: true }),
      supabase
        .from("shipment_locations")
        .select("*")
        .eq("shipment_id", shipmentId)
        .order("recorded_at", { ascending: true })
        .limit(200),
      supabase
        .from("facility_locations")
        .select("*")
        .eq("is_active", true)
        .order("name"),
    ]);

  const initial = buildTrackingPayload(
    row,
    (events ?? []) as Record<string, unknown>[],
    (locations ?? []).map((l) => ({
      ...l,
      client_id: l.client_id ?? "",
    })),
    facilities ?? []
  );

  return (
    <div>
      <PageHeader
        title={initial.shipment.tracking_number}
        description={`Live map · ${initial.shipment.origin} → ${initial.shipment.destination}`}
      />
      <Link
        href="/app/portal/track"
        className="text-sm text-primary hover:underline mb-4 inline-block"
      >
        ← All shipments
      </Link>
      <LiveTrackingPanel initial={initial} />
    </div>
  );
}
