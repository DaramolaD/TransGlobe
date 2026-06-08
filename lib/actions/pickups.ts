"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { getDefaultOrganizationId } from "@/lib/data/organization";

export async function schedulePickup(data: {
  pickupType: string;
  pickupDate: string;
  pickupTime: string;
  pickupAddress: string;
  pickupCity: string;
  pickupState?: string;
  pickupZip?: string;
  pickupCountry: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  specialInstructions?: string;
  packageCount: number;
  packageWeight?: string;
  packageDimensions?: string;
  serviceType: string;
}) {
  const profile = await requireProfile();
  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Platform not configured." };

  const supabase = await createClient();
  const { data: pickup, error } = await supabase
    .from("pickup_requests")
    .insert({
      organization_id: orgId,
      created_by: profile.id,
      pickup_type: data.pickupType,
      pickup_date: data.pickupDate,
      pickup_time: data.pickupTime,
      pickup_address: data.pickupAddress,
      pickup_city: data.pickupCity,
      pickup_state: data.pickupState ?? null,
      pickup_zip: data.pickupZip ?? null,
      pickup_country: data.pickupCountry,
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      contact_email: data.contactEmail,
      special_instructions: data.specialInstructions ?? null,
      package_count: data.packageCount,
      package_weight: data.packageWeight ?? null,
      package_dimensions: data.packageDimensions ?? null,
      service_type: data.serviceType,
    })
    .select("id, pickup_date, pickup_city")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/app/portal/pickups");
  return { success: true, pickup };
}
