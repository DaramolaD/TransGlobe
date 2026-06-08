"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import type { PublicTrackingPayload } from "@/lib/types/tracking";
import { LiveTrackingPanel } from "./LiveTrackingPanel";

export function PublicTrackingSearch({
  initialNumber = "",
  autoSearch = false,
}: {
  initialNumber?: string;
  autoSearch?: boolean;
}) {
  const [trackingNumber, setTrackingNumber] = useState(initialNumber);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublicTrackingPayload | null>(null);

  async function search() {
    const q = trackingNumber.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(q)}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Not found");
        setResult(null);
      } else {
        setResult(json as PublicTrackingPayload);
      }
    } catch {
      setError("Network error — try again");
      setResult(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (autoSearch && initialNumber.trim()) {
      void search();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSearch, initialNumber]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Enter tracking number (e.g. SC001234567)"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          className="flex-1 h-11 px-4 rounded-lg border bg-background text-foreground"
        />
        <button
          type="button"
          onClick={search}
          disabled={loading || !trackingNumber.trim()}
          className="btn-cta inline-flex items-center justify-center gap-2 h-11 px-6 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Track
        </button>
      </div>

      {error && (
        <p className="text-center text-sm text-destructive">{error}</p>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <LiveTrackingPanel initial={result} />
        </motion.div>
      )}
    </div>
  );
}
