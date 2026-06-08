"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { ShipmentStatus, ServiceType } from "@/lib/types/database";
import { getPlatformSettings } from "@/lib/organization/platform-settings";
import { generateUniqueTrackingNumber } from "@/lib/tracking/tracking-number";
import { writeAuditLog } from "@/lib/audit/log";
import {
  normalizeShipmentRow,
  SHIPMENT_RELATIONS_SELECT,
  type ShipmentWithRelations,
} from "@/lib/data/entity-relations";

export type BookingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

export type BookingContact = {
  name: string;
  company?: string;
  phone: string;
  email: string;
  address: BookingAddress;
};

export type BookingPackage = {
  description: string;
  quantity: number;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  declaredValue?: number;
  packageType?: string;
  imageName?: string;
};

export type CreateShipmentInput = {
  serviceType: ServiceType;
  express?: boolean;
  insurance?: boolean;
  insuredValue?: number;
  referenceNumber?: string;
  goodsDescription?: string;
  hsCode?: string;
  incoterms?: string;
  estimatedDelivery?: string;
  shipper: BookingContact;
  recipient: BookingContact;
  packages: BookingPackage[];
  schedulePickup?: boolean;
  pickupDate?: string;
  pickupTime?: string;
  specialInstructions?: string;
};

function formatAddress(address: BookingAddress): string {
  return [
    address.line1,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatDimensions(pkg: BookingPackage): string | null {
  if (pkg.lengthCm && pkg.widthCm && pkg.heightCm) {
    return `${pkg.lengthCm} x ${pkg.widthCm} x ${pkg.heightCm} cm`;
  }
  return null;
}

export async function createShipment(data: CreateShipmentInput) {
  const profile = await requireProfile();
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Not configured" };

  if (data.packages.length === 0) {
    return { error: "Add at least one package." };
  }

  const supabase = await createClient();
  const platform = await getPlatformSettings();

  if (platform.require_hs_code && !data.hsCode?.trim()) {
    return { error: "HS code is required for bookings with this operator." };
  }

  const lbToKg = (lb: number) => Math.round(lb * 0.453592 * 100) / 100;
  const normalizedPackages = data.packages.map((pkg) => {
    if (platform.weight_unit !== "lb" || pkg.weightKg == null) return pkg;
    return { ...pkg, weightKg: lbToKg(pkg.weightKg) };
  });
  const trackingNumber = await generateUniqueTrackingNumber(
    supabase,
    platform.tracking_prefix
  );

  const totalWeight = normalizedPackages.reduce(
    (sum, pkg) => sum + (pkg.weightKg ?? 0) * (pkg.quantity || 1),
    0
  );
  const packageCount = normalizedPackages.reduce(
    (sum, pkg) => sum + (pkg.quantity || 1),
    0
  );

  const origin = formatAddress(data.shipper.address);
  const destination = formatAddress(data.recipient.address);

  const metadata = {
    shipper: data.shipper,
    recipient: data.recipient,
    packages: normalizedPackages,
    weight_unit_input: platform.weight_unit,
    currency: platform.default_currency,
    timezone: platform.timezone,
    express: data.express ?? false,
    insurance: data.insurance ?? false,
    insuredValue: data.insuredValue ?? null,
    referenceNumber: data.referenceNumber ?? null,
    goodsDescription: data.goodsDescription ?? null,
    hsCode: data.hsCode ?? null,
    incoterms: data.incoterms ?? null,
    schedulePickup: data.schedulePickup ?? false,
    pickup: {
      date: data.pickupDate ?? null,
      time: data.pickupTime ?? null,
    },
  };

  const { data: shipment, error } = await supabase
    .from("shipments")
    .insert({
      organization_id: orgId,
      created_by: profile.id,
      tracking_number: trackingNumber,
      map_visibility_mode: platform.default_map_visibility,
      status: platform.portal_booking_auto_confirm ? "booked" : "quote_pending",
      service_type: data.serviceType,
      origin,
      destination,
      weight_kg: totalWeight > 0 ? totalWeight : null,
      package_count: packageCount,
      estimated_delivery: data.estimatedDelivery || null,
      special_instructions: data.specialInstructions ?? null,
      metadata,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const packageClient = (await createServiceClient()) ?? supabase;
  const packageRows = normalizedPackages.flatMap((pkg) =>
    Array.from({ length: Math.max(1, pkg.quantity) }, () => ({
      shipment_id: shipment.id,
      description: pkg.description,
      weight_kg: pkg.weightKg ?? null,
      dimensions: formatDimensions(pkg),
      quantity: 1,
    }))
  );

  await packageClient.from("packages").insert(packageRows);

  if (data.schedulePickup && data.pickupDate) {
    await supabase.from("pickup_requests").insert({
      organization_id: orgId,
      created_by: profile.id,
      shipment_id: shipment.id,
      status: "pending",
      pickup_type: "package",
      pickup_date: data.pickupDate,
      pickup_time: data.pickupTime ?? null,
      pickup_address: data.shipper.address.line1,
      pickup_city: data.shipper.address.city,
      pickup_state: data.shipper.address.state ?? null,
      pickup_zip: data.shipper.address.postalCode ?? null,
      pickup_country: data.shipper.address.country,
      contact_name: data.shipper.name,
      contact_phone: data.shipper.phone,
      contact_email: data.shipper.email,
      package_count: packageCount,
      package_weight: totalWeight > 0 ? String(totalWeight) : null,
      special_instructions: data.specialInstructions ?? null,
    });
  }

  await supabase.from("tracking_events").insert({
    shipment_id: shipment.id,
    status: "booked",
    location: origin,
    description: data.schedulePickup
      ? "Shipment booked — pickup scheduled"
      : "Shipment booked",
    created_by: profile.id,
    is_public: true,
  });

  revalidatePath("/app");
  revalidatePath("/app/portal");
  revalidatePath("/app/portal/pickups");
  return { success: true, shipment };
}

export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  options?: {
    location?: string;
    description?: string;
    facilityLocationId?: string;
    isPlanned?: boolean;
  }
) {
  const profile = await requireProfile();
  const supabase = await createClient();

  let locationLabel = options?.location;
  let latitude: number | null = null;
  let longitude: number | null = null;
  const facilityLocationId: string | null = options?.facilityLocationId ?? null;

  if (facilityLocationId) {
    const { data: facility } = await supabase
      .from("facility_locations")
      .select("name, city, state, country, latitude, longitude")
      .eq("id", facilityLocationId)
      .single();
    if (facility) {
      latitude = facility.latitude;
      longitude = facility.longitude;
      locationLabel =
        options?.location ??
        [facility.name, facility.city, facility.state, facility.country]
          .filter(Boolean)
          .join(", ");
    }
  }

  const { data: shipMeta } = await supabase
    .from("shipments")
    .select("tracking_number, status, created_by")
    .eq("id", shipmentId)
    .single();

  const { error } = await supabase
    .from("shipments")
    .update({
      status,
      current_location: locationLabel ?? undefined,
      ...(status === "delivered" ? { actual_delivery: new Date().toISOString() } : {}),
    })
    .eq("id", shipmentId);

  if (error) return { error: error.message };

  await writeAuditLog({
    action: "shipment_status_updated",
    entityType: "shipment",
    entityId: shipmentId,
    payload: {
      tracking_number: shipMeta?.tracking_number,
      from_status: shipMeta?.status,
      to_status: status,
      location: locationLabel ?? null,
      is_planned: options?.isPlanned ?? false,
    },
  });

  await supabase.from("tracking_events").insert({
    shipment_id: shipmentId,
    status,
    location: locationLabel ?? null,
    description: options?.description ?? `Status updated to ${status.replace(/_/g, " ")}`,
    created_by: profile.id,
    is_public: true,
    facility_location_id: facilityLocationId,
    latitude,
    longitude,
    is_planned: options?.isPlanned ?? false,
  });

  const { handleShipmentMilestone } = await import(
    "@/lib/organization/milestone-events"
  );
  await handleShipmentMilestone({
    shipmentId,
    trackingNumber: shipMeta?.tracking_number ?? shipmentId,
    status,
    fromStatus: shipMeta?.status ?? null,
    customerId: shipMeta?.created_by ?? null,
    location: locationLabel ?? null,
  });

  revalidatePath("/app");
  revalidatePath(`/app/admin/tracking/${shipmentId}`);
  if (status === "delivered") {
    revalidatePath("/app/admin/invoices");
    revalidatePath("/app/portal/invoices");
  }
  return { success: true };
}

export async function assignDriver(
  shipmentId: string,
  driverId: string,
  options?: { forceUnavailable?: boolean }
) {
  await requireProfile();
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Not configured" };

  const { assertPaidInvoiceForDispatch } = await import("@/lib/actions/invoices");
  const paidCheck = await assertPaidInvoiceForDispatch(shipmentId);
  if (!paidCheck.ok) return { error: paidCheck.error };

  const { getDriverAvailabilityForAssign } = await import(
    "@/lib/actions/driver-availability"
  );
  const availability = await getDriverAvailabilityForAssign(driverId);
  if (!options?.forceUnavailable && availability !== "available") {
    const hint =
      availability === "busy"
        ? "Driver is marked Busy. Ask them to set Available, or enable “Include busy/offline”."
        : "Driver is Offline. Ask them to set Available, or enable “Include busy/offline”.";
    return { error: hint };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("assignments").upsert(
    {
      organization_id: orgId,
      shipment_id: shipmentId,
      driver_id: driverId,
      status: "pending",
    },
    { onConflict: "shipment_id,driver_id" }
  );

  if (error) return { error: error.message };

  const { data: driver } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", driverId)
    .single();

  const { data: ship } = await supabase
    .from("shipments")
    .select("tracking_number")
    .eq("id", shipmentId)
    .single();

  await writeAuditLog({
    action: "driver_assigned",
    entityType: "shipment",
    entityId: shipmentId,
    payload: {
      tracking_number: ship?.tracking_number,
      driver_id: driverId,
      driver_name: driver?.full_name ?? driver?.email,
    },
  });

  await updateShipmentStatus(shipmentId, "pickup_scheduled", {
    description: "Driver assigned",
  });
  revalidatePath("/app/admin/dispatch");
  return { success: true };
}

export async function listShipments(filters?: {
  status?: string;
  limit?: number;
  withRelations?: boolean;
}): Promise<{
  error?: string;
  data: Record<string, unknown>[];
  dataWithRelations?: ShipmentWithRelations[];
}> {
  const supabase = await createClient();
  const withRelations = filters?.withRelations ?? false;

  let q = supabase
    .from("shipments")
    .select(withRelations ? SHIPMENT_RELATIONS_SELECT : "*")
    .order("created_at", { ascending: false });

  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.limit) q = q.limit(filters.limit);

  const { data, error } = await q;
  if (error) return { error: error.message, data: [] };

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  if (!withRelations) return { data: rows };

  const normalized = rows.map(normalizeShipmentRow);
  return { data: rows, dataWithRelations: normalized };
}

export async function getShipmentWithRelations(
  shipmentId: string
): Promise<{ data: ShipmentWithRelations | null; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("shipments")
    .select(SHIPMENT_RELATIONS_SELECT)
    .eq("id", shipmentId)
    .single();

  if (error || !data) {
    return { data: null, error: error?.message ?? "Not found" };
  }

  return { data: normalizeShipmentRow(data as Record<string, unknown>) };
}

export async function seedDemoShipment() {
  const service = await createServiceClient();
  if (!service) return { error: "Service role required for seeding" };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "No org" };

  const tracking = "SC001234567";
  const { data: existing } = await service
    .from("shipments")
    .select("id")
    .eq("tracking_number", tracking)
    .maybeSingle();

  if (existing) return { success: true, tracking };

  const { data: shipment } = await service
    .from("shipments")
    .insert({
      organization_id: orgId,
      tracking_number: tracking,
      status: "in_transit",
      service_type: "air",
      origin: "Shanghai, China",
      destination: "New York, USA",
      current_location: "Los Angeles, CA",
      estimated_delivery: "2026-06-01",
    })
    .select()
    .single();

  if (!shipment) return { error: "Failed to seed" };

  const events = [
    { status: "picked_up", location: "Shanghai, China", description: "Package collected" },
    { status: "in_transit", location: "Shanghai, China", description: "Departed origin airport" },
    { status: "at_origin_hub", location: "Los Angeles, CA", description: "Arrived at hub" },
    { status: "customs", location: "Los Angeles, CA", description: "Customs cleared" },
  ];

  for (const e of events) {
    await service.from("tracking_events").insert({
      shipment_id: shipment.id,
      ...e,
      is_public: true,
      event_at: new Date().toISOString(),
    });
  }

  return { success: true, tracking };
}
