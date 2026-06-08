import { NextResponse } from "next/server";
import { getPublicTracking } from "@/lib/tracking/public";

export async function GET(
  _request: Request,
  context: { params: Promise<{ number: string }> }
) {
  const { number } = await context.params;
  const { data, error } = await getPublicTracking(number);

  if (error || !data) {
    return NextResponse.json(
      { error: error ?? "Not found" },
      { status: error === "Shipment not found" ? 404 : 400 }
    );
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
    },
  });
}
