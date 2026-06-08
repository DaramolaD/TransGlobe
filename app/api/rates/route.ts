import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fallbackRates } from "@/lib/pricing/rate-cards";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rate_cards")
    .select("service_type, price_per_kg, min_charge, name")
    .eq("is_active", true)
    .order("service_type");

  const rates = data?.length ? data : fallbackRates();

  return NextResponse.json(
    { rates, source: data?.length && !error ? "database" : "fallback" },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
