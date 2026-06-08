import { listInvoicesAdmin, listShipmentsForInvoicing } from "@/lib/actions/invoices";

type PageProps = { searchParams: Promise<{ shipment?: string }> };
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CreateInvoiceForm } from "./CreateInvoiceForm";
import { AdminInvoicesTable, type AdminInvoiceRow } from "./AdminInvoicesTable";

export default async function AdminInvoicesPage({ searchParams }: PageProps) {
  const { shipment: preselectShipment } = await searchParams;
  const [{ data: invoices }, { data: shipments }] = await Promise.all([
    listInvoicesAdmin(),
    listShipmentsForInvoicing(),
  ]);

  return (
    <div>
      <PageHeader
        title="Invoices"
        description="Click a row for a quick preview, or open the full invoice page. Send, resend, and payment actions are logged."
      />
      <CreateInvoiceForm
        shipments={shipments}
        defaultShipmentId={preselectShipment}
      />
      <AdminInvoicesTable invoices={(invoices ?? []) as AdminInvoiceRow[]} />
    </div>
  );
}
