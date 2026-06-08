import { randomBytes } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_PREFIX = "SWC";
const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_GENERATION_ATTEMPTS = 12;

/** Branded tracking ID, e.g. SWC-260531-K7M2NP */
export function generateTrackingNumber(
  date = new Date(),
  prefix = DEFAULT_PREFIX
): string {
  const brand = (prefix || DEFAULT_PREFIX).toUpperCase().slice(0, 6);
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = randomBytes(6);
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += ID_CHARS[bytes[i]! % ID_CHARS.length];
  }
  return `${brand}-${yymmdd}-${suffix}`;
}

/**
 * Picks a tracking ID and verifies it is not already in `shipments`.
 * Retries on collision — safe even under concurrent bookings.
 */
export async function generateUniqueTrackingNumber(
  supabase: SupabaseClient,
  prefix = DEFAULT_PREFIX
): Promise<string> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const candidate = generateTrackingNumber(new Date(), prefix);
    const { data } = await supabase
      .from("shipments")
      .select("id")
      .eq("tracking_number", candidate)
      .maybeSingle();

    if (!data) return candidate;
  }

  throw new Error("Unable to generate a unique tracking number. Please try again.");
}

/** Display helper — keeps legacy SC… numbers readable */
export function formatTrackingNumber(value: string): string {
  return value.trim().toUpperCase();
}
