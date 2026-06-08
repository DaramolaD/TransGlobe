"use client";

import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { RouteInlineCell } from "@/components/dashboard/TableCells";
import { formatTableDate, shipmentDetailRow } from "@/lib/dashboard/table-details";
import type { Shipment } from "@/lib/types/database";

export function PortalTrackTable({ shipments }: { shipments: Shipment[] }) {
  const rows = shipments.map((s) => ({
    _id: s.id,
    _detail: shipmentDetailRow(s),
    _searchText: [
      s.tracking_number,
      s.origin,
      s.destination,
      s.status,
      s.service_type,
    ]
      .filter(Boolean)
      .join(" "),
    tracking: <TrackingId value={s.tracking_number} size="md" />,
    route: <RouteInlineCell origin={s.origin} destination={s.destination} />,
    service: (
      <span className="capitalize text-sm text-muted-foreground">
        {s.service_type.replace(/_/g, " ")}
      </span>
    ),
    status: <StatusBadge status={s.status} />,
    date: (
      <span className="text-sm text-muted-foreground tabular-nums">
        {formatTableDate(s.created_at)}
      </span>
    ),
  }));

  return (
    <FilterableDataTable
      storageKey="portal-track-columns"
      searchPlaceholder="Search tracking #, route, status…"
      columns={[
        { key: "tracking", label: "Tracking ID", className: "min-w-[120px]" },
        { key: "route", label: "Route", className: "min-w-[140px] max-w-[220px]" },
        { key: "service", label: "Service", className: "min-w-[90px]" },
        { key: "status", label: "Status", className: "min-w-[100px]" },
        { key: "date", label: "Booked", className: "min-w-[90px]" },
      ]}
      defaultVisibleKeys={["tracking", "route", "status", "date"]}
      rows={rows}
      getSearchText={(row) => String(row._searchText ?? "")}
      emptyMessage="No shipments yet. Book a shipment from the portal to start tracking."
    />
  );
}
