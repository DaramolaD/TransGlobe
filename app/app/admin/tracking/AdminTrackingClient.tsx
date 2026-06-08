"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { RouteTableCell } from "@/components/dashboard/TableCells";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { formatTableDate, shipmentDetailRow } from "@/lib/dashboard/table-details";
import { formatTrackingNumber } from "@/lib/tracking/tracking-number";

type RecentShipment = {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  service_type: string | null;
  created_at: string;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function AdminTrackingClient({
  recent,
}: {
  recent: RecentShipment[];
}) {
  const router = useRouter();
  const [lookup, setLookup] = useState("");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [opening, setOpening] = useState(false);

  const tableRows = useMemo(
    () =>
      recent.map((s) => ({
        _id: s.id,
        _detail: shipmentDetailRow(
          { ...s, service_type: s.service_type ?? "air", package_count: 1 },
          {
            href: dashboardTrackingHref(s.id),
            hrefLabel: "Open live tracking",
          }
        ),
        _searchText: [
          s.tracking_number,
          s.id,
          s.origin,
          s.destination,
          s.status,
          s.service_type,
        ]
          .filter(Boolean)
          .join(" "),
        tracking: <TrackingId value={s.tracking_number} />,
        route: <RouteTableCell origin={s.origin} destination={s.destination} />,
        service: (
          <span className="capitalize text-sm text-muted-foreground">
            {(s.service_type ?? "air").replace(/_/g, " ")}
          </span>
        ),
        status: <StatusBadge status={s.status} />,
        date: (
          <span className="text-sm text-muted-foreground tabular-nums">
            {formatTableDate(s.created_at)}
          </span>
        ),
        open: (
          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
            <Link href={dashboardTrackingHref(s.id)} data-no-row-click>
              Track
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        ),
      })),
    [recent]
  );

  function openLiveTracking(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = lookup.trim();
    if (!trimmed) return;
    setLookupError(null);
    setOpening(true);

    const normalized = formatTrackingNumber(trimmed);
    const match = recent.find(
      (s) =>
        s.tracking_number.toUpperCase() === normalized ||
        s.id.toLowerCase() === trimmed.toLowerCase()
    );

    if (match) {
      router.push(dashboardTrackingHref(match.id));
      return;
    }

    if (UUID_RE.test(trimmed)) {
      router.push(dashboardTrackingHref(trimmed));
      return;
    }

    setOpening(false);
    setLookupError(
      "No match in recent list. Use table search below, or open Shipments and track from there."
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Open live tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={openLiveTracking} className="space-y-3 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="tracking-open">Tracking number or shipment ID</Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  id="tracking-open"
                  value={lookup}
                  onChange={(e) => {
                    setLookup(e.target.value);
                    setLookupError(null);
                  }}
                  placeholder="e.g. SWC-260531-XXXXXX"
                  className="font-mono flex-1 min-w-[200px]"
                  autoComplete="off"
                />
                <Button type="submit" disabled={opening || !lookup.trim()}>
                  <ArrowUpRight className="h-4 w-4 mr-1.5" />
                  Open tracking
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Filters the table below as you type in search. Use Open tracking when you
                know the exact ID from a recent shipment.
              </p>
              {lookupError ? (
                <p className="text-sm text-destructive" role="alert">
                  {lookupError}
                </p>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden pt-0">
        <CardHeader className="border-b bg-muted/20 py-4">
          <CardTitle className="text-base font-semibold">Recent shipments</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-4">
          <FilterableDataTable
            embedded
            showIndex
            pageSize={10}
            storageKey="admin-tracking-columns"
            searchPlaceholder="Filter by tracking #, route, status…"
            columns={[
              { key: "tracking", label: "Tracking #" },
              { key: "route", label: "Route", className: "min-w-[160px]" },
              { key: "service", label: "Service", className: "hidden md:table-cell" },
              { key: "status", label: "Status" },
              { key: "date", label: "Booked", className: "w-[110px]" },
              { key: "open", label: "", className: "w-[100px]" },
            ]}
            defaultVisibleKeys={["tracking", "route", "service", "status", "date"]}
            rows={tableRows}
            getSearchText={(row) => String(row._searchText ?? "")}
            emptyMessage="No shipments in the system yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
