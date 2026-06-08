"use client";

import { FilterableDataTable } from "@/components/dashboard/FilterableDataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { invoiceDetailRow } from "@/lib/dashboard/table-details";
import { effectiveInvoiceStatus } from "@/lib/invoices/display-status";
import { InvoiceActions } from "./InvoiceActions";
import type { ProfileSnippet } from "@/lib/data/entity-relations";
import type { InvoiceStatus } from "@/lib/types/database";

export type AdminInvoiceRow = {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date: string | null;
  created_at: string;
  customer?: ProfileSnippet | null;
  shipments?: { tracking_number?: string } | null;
};

export function AdminInvoicesTable({
  invoices,
}: {
  invoices: AdminInvoiceRow[];
}) {
  const tableRows = invoices.map((inv) => {
    const shipment = inv.shipments;
    const displayStatus = effectiveInvoiceStatus(
      inv.status as InvoiceStatus,
      inv.due_date
    );
    const customerName =
      inv.customer?.full_name ?? inv.customer?.email ?? null;

    return {
      _id: inv.id,
      _detail: invoiceDetailRow({
        id: inv.id,
        invoice_number: inv.invoice_number,
        amount: Number(inv.amount),
        currency: inv.currency,
        status: displayStatus,
        due_date: inv.due_date,
        created_at: inv.created_at,
        customerName: inv.customer?.full_name,
        customerEmail: inv.customer?.email,
        trackingNumber: shipment?.tracking_number,
      }),
      _searchText: [
        inv.invoice_number,
        customerName,
        shipment?.tracking_number,
        displayStatus,
        inv.currency,
        String(inv.amount),
      ]
        .filter(Boolean)
        .join(" "),
      number: (
        <span className="font-mono text-sm font-medium">{inv.invoice_number}</span>
      ),
      customer: <span className="text-sm">{customerName ?? "—"}</span>,
      shipment: shipment?.tracking_number ?? "—",
      amount: `${inv.currency} ${Number(inv.amount).toFixed(2)}`,
      status: <StatusBadge status={displayStatus} />,
      due: inv.due_date ?? "—",
      menu: (
        <InvoiceActions
          id={inv.id}
          status={displayStatus}
          invoiceNumber={inv.invoice_number}
        />
      ),
    };
  });

  return (
    <FilterableDataTable
      storageKey="admin-invoices-columns"
      searchPlaceholder="Search invoice #, customer, shipment…"
      columns={[
        { key: "number", label: "Invoice #" },
        { key: "customer", label: "Customer" },
        { key: "shipment", label: "Shipment" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "due", label: "Due" },
        { key: "menu", label: "", className: "w-12 pr-2" },
      ]}
      defaultVisibleKeys={["number", "customer", "shipment", "amount", "status", "due"]}
      rows={tableRows}
      getSearchText={(row) => String(row._searchText ?? "")}
      emptyMessage="No invoices yet. Deliver a shipment or create one above."
    />
  );
}
