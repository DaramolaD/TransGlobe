"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/session";
import { isStaff } from "@/lib/auth/roles";
import { getDefaultOrganizationId } from "@/lib/data/organization";
import type { DriverAvailabilityStatus } from "@/lib/types/database";

const GPS_ONLINE_WINDOW_MS = 120_000; // 2 minutes

export type DispatchDriverOption = {
  id: string;
  full_name: string | null;
  email: string | null;
  availability: DriverAvailabilityStatus;
  availability_reason: string | null;
  gps_online: boolean;
  gps_last_seen_at: string | null;
};

/** Active drivers with availability + GPS for dispatch UI */
export async function listDriversForDispatch() {
  const { data, error } = await listDriversOperationalStatus();
  if (error) return { error, data: [] as DispatchDriverOption[] };

  const active = (data ?? []).filter((d) => d.is_active);

  const sorted = [...active].sort((a, b) => {
    const rank = (s: DriverAvailabilityStatus) =>
      s === "available" ? 0 : s === "busy" ? 1 : 2;
    const r = rank(a.availability) - rank(b.availability);
    if (r !== 0) return r;
    if (a.gps_online !== b.gps_online) return a.gps_online ? -1 : 1;
    return (a.full_name ?? a.email ?? "").localeCompare(b.full_name ?? b.email ?? "");
  });

  return {
    data: sorted.map((d) => ({
      id: d.id,
      full_name: d.full_name,
      email: d.email,
      availability: d.availability,
      availability_reason: d.availability_reason,
      gps_online: d.gps_online,
      gps_last_seen_at: d.gps_last_seen_at,
    })),
  };
}

export async function getDriverAvailabilityForAssign(driverId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("driver_availability")
    .select("status, reason")
    .eq("driver_id", driverId)
    .maybeSingle();

  return (data?.status ?? "offline") as DriverAvailabilityStatus;
}

export async function setMyDriverAvailability(input: {
  status: DriverAvailabilityStatus;
  reason?: string;
}) {
  const profile = await requireProfile();
  if (profile.role !== "driver") return { error: "Forbidden" };

  const orgId = await getDefaultOrganizationId();
  if (!orgId) return { error: "Not configured" };

  const supabase = await createClient();
  const { error } = await supabase.from("driver_availability").upsert(
    {
      driver_id: profile.id,
      organization_id: orgId,
      status: input.status,
      reason: input.reason?.trim() ? input.reason.trim() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "driver_id" }
  );

  if (error) return { error: error.message };

  revalidatePath("/app/driver/profile");
  revalidatePath("/app/admin/drivers");
  revalidatePath("/app/admin/dispatch");
  return { success: true };
}

export async function getMyDriverAvailability() {
  const profile = await requireProfile();
  if (profile.role !== "driver") return { error: "Forbidden", data: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("driver_availability")
    .select("status, reason, updated_at")
    .eq("driver_id", profile.id)
    .maybeSingle();

  if (error) return { error: error.message, data: null };
  return {
    data: (data ?? { status: "offline", reason: null, updated_at: null }) as {
      status: DriverAvailabilityStatus;
      reason: string | null;
      updated_at: string | null;
    },
  };
}

export async function listDriversOperationalStatus() {
  const me = await requireProfile();
  if (!isStaff(me.role)) return { error: "Forbidden", data: [] };

  const supabase = await createClient();
  const { data: drivers, error } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, is_active")
    .eq("role", "driver")
    .order("full_name");

  if (error) return { error: error.message, data: [] };

  const driverIds = (drivers ?? []).map((d) => d.id);

  const [{ data: avail }, { data: lastGps }] = await Promise.all([
    supabase
      .from("driver_availability")
      .select("driver_id, status, reason, updated_at")
      .in("driver_id", driverIds),
    supabase
      .from("shipment_locations")
      .select("driver_id, recorded_at")
      .in("driver_id", driverIds)
      .order("recorded_at", { ascending: false })
      .limit(500),
  ]);

  const availabilityByDriver = Object.fromEntries(
    (avail ?? []).map((a) => [a.driver_id as string, a])
  ) as Record<
    string,
    { status: DriverAvailabilityStatus; reason: string | null; updated_at: string }
  >;

  // lastGps is ordered DESC; first row per driver is latest
  const lastGpsByDriver: Record<string, string> = {};
  for (const row of lastGps ?? []) {
    const id = row.driver_id as string | null;
    if (!id) continue;
    if (!lastGpsByDriver[id]) lastGpsByDriver[id] = row.recorded_at as string;
  }

  const now = Date.now();
  return {
    data: (drivers ?? []).map((d) => {
      const a = availabilityByDriver[d.id];
      const lastSeen = lastGpsByDriver[d.id] ?? null;
      const gpsOnline =
        lastSeen != null && now - new Date(lastSeen).getTime() <= GPS_ONLINE_WINDOW_MS;

      return {
        ...d,
        availability: a?.status ?? ("offline" as DriverAvailabilityStatus),
        availability_reason: a?.reason ?? null,
        availability_updated_at: a?.updated_at ?? null,
        gps_last_seen_at: lastSeen,
        gps_online: gpsOnline,
      };
    }),
  };
}

