"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { markClaimViewed } from "@/lib/actions/claims";

/** Marks a claim as viewed when staff open the detail page. */
export function ClaimViewMarker({ claimId }: { claimId: string }) {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    markClaimViewed(claimId).then(() => {
      if (!cancelled) router.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [claimId, router]);

  return null;
}
