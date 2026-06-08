"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { ServiceType } from "@/lib/types/database";

async function getDb() {
  const service = await createServiceClient();
  return service ?? (await createClient());
}

export async function submitLead(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
}) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Platform not configured. Please try again later." };

  const supabase = await getDb();
  const { data: inserted, error } = await supabase
    .from("leads")
    .insert({
      organization_id: orgId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      company: data.company ?? null,
      service_interest: data.service ?? null,
      message: data.message ?? null,
      source: "website",
      category: "sales",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  if (inserted?.id) {
    const { notifyStaffNewLead } = await import("@/lib/actions/leads");
    await notifyStaffNewLead(
      inserted.id,
      `${data.firstName} ${data.lastName}`.trim() || data.email
    );
  }

  return { success: true };
}

export async function submitPickup(data: {
  pickupType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupZip: string;
  pickupCountry: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialInstructions?: string;
  packageCount: string;
  packageWeight: string;
  packageDimensions?: string;
  serviceType: string;
}) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Platform not configured." };

  const supabase = await getDb();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("pickup_requests").insert({
    organization_id: orgId,
    created_by: user?.id ?? null,
    pickup_type: data.pickupType,
    pickup_date: data.pickupDate,
    pickup_time: data.pickupTime,
    pickup_address: data.pickupAddress,
    pickup_city: data.pickupCity,
    pickup_state: data.pickupState,
    pickup_zip: data.pickupZip,
    pickup_country: data.pickupCountry,
    contact_name: data.contactName,
    contact_phone: data.contactPhone,
    contact_email: data.contactEmail,
    special_instructions: data.specialInstructions ?? null,
    package_count: parseInt(data.packageCount, 10) || 1,
    package_weight: data.packageWeight,
    package_dimensions: data.packageDimensions ?? null,
    service_type: data.serviceType,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function submitQuote(data: {
  origin: string;
  destination: string;
  weight: string;
  dimensions?: string;
  serviceType: ServiceType;
  packageType: string;
  insurance: boolean;
  express: boolean;
  totalPrice: number;
  basePrice: number;
}) {
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Platform not configured." };

  const supabase = await getDb();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + platform.quote_validity_days);

  const weightRaw = parseFloat(data.weight) || null;
  const weightKg =
    weightRaw != null && platform.weight_unit === "lb"
      ? Math.round(weightRaw * 0.453592 * 100) / 100
      : weightRaw;

  const { error } = await supabase.from("quotes").insert({
    organization_id: orgId,
    created_by: user?.id ?? null,
    origin: data.origin,
    destination: data.destination,
    weight_kg: weightKg,
    dimensions: data.dimensions ?? null,
    service_type: data.serviceType,
    package_type: data.packageType,
    insurance: data.insurance,
    express: data.express,
    base_price: data.basePrice,
    total_price: data.totalPrice,
    currency: platform.default_currency,
    status: "draft",
    valid_until: validUntil.toISOString().slice(0, 10),
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function trackShipment(trackingNumber: string) {
  const { getPlatformSettings } = await import("@/lib/organization/platform-settings");
  const platform = await getPlatformSettings();
  if (!platform.public_tracking_enabled) {
    return { error: "Public tracking is disabled. Contact support for shipment updates." };
  }

  const supabase = await getDb();
  const { data: shipment, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("tracking_number", trackingNumber.trim().toUpperCase())
    .single();

  if (error || !shipment) return { error: "Shipment not found" };

  const { data: events } = await supabase
    .from("tracking_events")
    .select("*")
    .eq("shipment_id", shipment.id)
    .eq("is_public", true)
    .order("event_at", { ascending: true });

  return { shipment, events: events ?? [] };
}
