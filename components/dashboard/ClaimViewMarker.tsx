"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markClaimViewed } from "@/lib/actions/claims";

/** Marks a claim as viewed when staff open the detail page. */
export function ClaimViewMarker({ claimId }: { claimId: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    void markClaimViewed(claimId)
      .then((result) => {
        if (cancelled || result?.success !== true) return;
        router.refresh();
      })
      .catch(() => {
        /* Avoid unhandled rejection overlay in dev when the action fails */
      });
    return () => {
      cancelled = true;
    };
  }, [claimId, router]);

  return null;
}
