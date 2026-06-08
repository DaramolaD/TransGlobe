"use client";

import Link from "next/link";
import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { TrackingId } from "@/components/dashboard/TrackingId";
import { RouteInlineCell, TableTextCell } from "@/components/dashboard/TableCells";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { shipmentDetailRow } from "@/lib/dashboard/table-details";
import {
  displayName,
  type ShipmentWithRelations,
} from "@/lib/data/entity-relations";
import type { ShipmentBillingState } from "@/lib/invoices/shipment-billing";
import { ShipmentInvoiceCell, ShipmentInvoiceStatusCell } from "./ShipmentInvoiceCell";
import { ShipmentRowMenu } from "./ShipmentRowMenu";

export function AdminShipmentsTable({
  shipments,
  billingMap,
}: {
  shipments: ShipmentWithRelations[];
  billingMap: Record<string, ShipmentBillingState>;
}) {
  const tableRows = shipments.map((s) => {
    const billing = billingMap[s.id];
    const driver = s.assignment?.driver;
    return {
      _id: s.id,
      _detail: shipmentDetailRow(s, {
        href: dashboardTrackingHref(s.id),
        hrefLabel: "Track shipment",
      }),
      _searchText: [
        s.tracking_number,
        s.origin,
        s.destination,
        s.status,
        s.service_type,
        billing?.invoiceNumber,
        billing?.invoiceStatus,
        displayName(s.customer),
        s.customer?.email,
        displayName(driver),
      ]
        .filter(Boolean)
        .join(" "),
      tracking: <TrackingId value={s.tracking_number} />,
      customer: (
        <TableTextCell className="text-muted-foreground" title={displayName(s.customer)}>
          {displayName(s.customer)}
        </TableTextCell>
      ),
      route: <RouteInlineCell origin={s.origin} destination={s.destination} />,
      service: (
        <span className="capitalize text-sm">{s.service_type.replace(/_/g, " ")}</span>
      ),
      status: <StatusBadge status={s.status} />,
      driver: (
        <TableTextCell className="text-muted-foreground">
          {driver ? displayName(driver) : "—"}
        </TableTextCell>
      ),
      date: (
        <span className="text-sm text-muted-foreground tabular-nums">
          {new Date(s.created_at).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
      invoice: <ShipmentInvoiceCell billing={billing} />,
      invoiceStatus: <ShipmentInvoiceStatusCell billing={billing} />,
      menu: (
        <ShipmentRowMenu
          shipmentId={s.id}
          trackingNumber={s.tracking_number}
          currentStatus={s.status}
          trackingHref={dashboardTrackingHref(s.id)}
          billing={billing}
        />
      ),
    };
  });

  return (
    <FilterableDataTable
      storageKey="admin-shipments-columns"
      searchPlaceholder="Search tracking #, customer, driver, route…"
      columns={[
        { key: "tracking", label: "Tracking #", className: "min-w-[120px]" },
        { key: "customer", label: "Customer", className: "min-w-[100px]" },
        {
          key: "route",
          label: "Route",
          className: "min-w-[140px] max-w-[220px] whitespace-normal",
        },
        { key: "service", label: "Service", className: "min-w-[80px]" },
        { key: "status", label: "Status", className: "min-w-[100px]" },
        { key: "driver", label: "Driver", className: "min-w-[90px]" },
        { key: "date", label: "Booked", className: "min-w-[90px]" },
        { key: "invoice", label: "Invoice", className: "min-w-[100px]" },
        { key: "invoiceStatus", label: "Invoice status", className: "min-w-[100px]" },
        { key: "menu", label: "", className: "w-12 pr-2" },
      ]}
      defaultVisibleKeys={[
        "tracking",
        "customer",
        "route",
        "status",
        "driver",
        "invoice",
        "invoiceStatus",
      ]}
      rows={tableRows}
      getSearchText={(row) => String(row._searchText ?? "")}
      emptyMessage="No shipments. Customers can book from the portal or convert quotes."
    />
  );
}
