"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PublicTrackingSearch } from "@/components/tracking/PublicTrackingSearch";

function TrackingLiveInner() {
  const params = useSearchParams();
  const number = params.get("number") ?? "";
  return (
    <PublicTrackingSearch initialNumber={number} autoSearch={Boolean(number)} />
  );
}

export function TrackingLiveSection() {
  return (
    <Suspense
      fallback={
        <div className="h-32 flex items-center justify-center text-muted-foreground text-sm">
          Loading tracker…
        </div>
      }
    >
      <TrackingLiveInner />
    </Suspense>
  );
}
