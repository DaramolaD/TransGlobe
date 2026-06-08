"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardTrackingSearchUrl } from "@/lib/dashboard/tracking-links";

export function TrackingLookupForm({
  defaultQuery = "",
  error,
}: {
  defaultQuery?: string;
  error?: string | null;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [pending, setPending] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setPending(true);
    router.push(dashboardTrackingSearchUrl(trimmed));
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="tracking-lookup">Tracking number or shipment ID</Label>
        <div className="flex gap-2">
          <Input
            id="tracking-lookup"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. SWC-260531-XXXXXX or UUID"
            className="font-mono"
            autoComplete="off"
          />
          <Button type="submit" disabled={pending || !query.trim()}>
            <Search className="h-4 w-4 mr-1.5" />
            Track
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a customer tracking ID from any table, or the internal shipment UUID.
        </p>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
