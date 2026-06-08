import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import { getPlatformSettings } from "@/lib/organization/platform-settings";
import type { PlatformSettings } from "@/lib/organization/settings";
import type { ShipmentStatus } from "@/lib/types/database";

type MilestoneInput = {
  shipmentId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  fromStatus?: string | null;
  customerId?: string | null;
  location?: string | null;
};

function milestoneMessage(
  status: ShipmentStatus,
  trackingNumber: string,
  settings: PlatformSettings
): { enabled: boolean; title: string; body: string } | null {
  const tn = trackingNumber;
  const label = status.replace(/_/g, " ");

  if (
    (status === "picked_up" || status === "pickup_scheduled") &&
    settings.notify_on_pickup
  ) {
    return {
      enabled: true,
      title: "Pickup update",
      body: `${tn}: Cargo ${label}.`,
    };
  }
  if (
    (status === "in_transit" ||
      status === "at_origin_hub" ||
      status === "at_destination_hub") &&
    settings.notify_on_in_transit
  ) {
    return {
      enabled: true,
      title: "In transit",
      body: `${tn}: Shipment is ${label}.`,
    };
  }
  if (status === "customs" && settings.notify_on_customs) {
    return {
      enabled: true,
      title: "Customs update",
      body: `${tn}: At customs clearance.`,
    };
  }
  if (status === "delivered" && settings.notify_on_delivery) {
    return {
      enabled: true,
      title: "Delivered",
      body: `${tn}: Your shipment has been delivered.`,
    };
  }
  if (status === "exception" && settings.notify_on_exception) {
    return {
      enabled: true,
      title: "Shipment exception",
      body: `${tn}: There is a delay or exception on your shipment.`,
    };
  }
  return null;
}

async function insertCustomerNotification(
  customerId: string,
  title: string,
  body: string,
  metadata: Record<string, unknown>
) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return;
  const supabase = await createClient();
  await supabase.from("notifications").insert({
    organization_id: orgId,
    user_id: customerId,
    title,
    body,
    metadata,
  });
}

async function postTmsWebhook(
  url: string,
  payload: Record<string, unknown>
) {
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Webhook must not block status updates
  }
}

/** Customer notifications + TMS webhook after a shipment status change */
export async function handleShipmentMilestone(input: MilestoneInput) {
  const settings = await getPlatformSettings();
  const msg = milestoneMessage(input.status, input.trackingNumber, settings);

  if (msg && input.customerId) {
    await insertCustomerNotification(input.customerId, msg.title, msg.body, {
      shipment_id: input.shipmentId,
      tracking_number: input.trackingNumber,
      status: input.status,
      type: "milestone",
    });
  }

  if (settings.tms_webhook_url.trim()) {
    await postTmsWebhook(settings.tms_webhook_url.trim(), {
      event: "shipment.status_updated",
      shipment_id: input.shipmentId,
      tracking_number: input.trackingNumber,
      from_status: input.fromStatus ?? null,
      to_status: input.status,
      location: input.location ?? null,
      at: new Date().toISOString(),
    });
  }
}
