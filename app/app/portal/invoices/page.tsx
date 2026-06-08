import { listMyInvoices } from "@/lib/actions/invoices";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { DataTable } from "@/components/dashboard/DataTable";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { effectiveInvoiceStatus } from "@/lib/invoices/display-status";
import type { InvoiceStatus } from "@/lib/types/database";
import { InvoicePortalMenu } from "./InvoicePortalMenu";

export default async function PortalInvoicesPage() {
  const { data: invoices } = await listMyInvoices();

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="View billing history, download invoices, and submit payment references."
      />
      <DataTable
        columns={[
          { key: "number", label: "Invoice" },
          { key: "shipment", label: "Shipment" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
          { key: "due", label: "Due" },
          { key: "menu", label: "", className: "w-12 pr-2" },
        ]}
        rows={(invoices ?? []).map((i) => {
          const shipment = i.shipments as { tracking_number?: string } | null;
          const displayStatus = effectiveInvoiceStatus(
            i.status as InvoiceStatus,
            i.due_date
          );
          const amountStr = `${i.currency} ${Number(i.amount).toFixed(2)}`;
          return {
            _id: i.id,
            _detail: {
              kind: "invoice",
              title: i.invoice_number,
              subtitle: shipment?.tracking_number ?? "No linked shipment",
              fields: [
                { label: "Amount", value: amountStr },
                { label: "Status", value: <StatusBadge status={displayStatus} /> },
                { label: "Due date", value: i.due_date ?? "—" },
                ...(shipment?.tracking_number
                  ? [{ label: "Shipment", value: shipment.tracking_number }]
                  : []),
              ],
              href: `/app/portal/invoices/${i.id}`,
              hrefLabel: "View & pay invoice",
            },
            number: (
              <span className="font-mono text-sm font-semibold text-primary">
                {i.invoice_number}
              </span>
            ),
            shipment: shipment?.tracking_number ? (
              <span className="font-mono text-xs text-muted-foreground">
                {shipment.tracking_number}
              </span>
            ) : (
              "—"
            ),
            amount: amountStr,
            status: <StatusBadge status={displayStatus} />,
            due: i.due_date ?? "—",
            menu: <InvoicePortalMenu id={i.id} invoiceNumber={i.invoice_number} />,
          };
        })}
        emptyMessage="No invoices yet. Invoices appear when your shipments are delivered or when billing is issued."
      />
    </div>
  );
}
