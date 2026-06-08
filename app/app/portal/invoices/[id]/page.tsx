import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/actions/invoices";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument";
import { effectiveInvoiceStatus } from "@/lib/invoices/display-status";
import { PrintInvoiceButton } from "@/components/invoices/PrintInvoiceButton";
import { SubmitPaymentForm } from "../SubmitPaymentForm";
import type { InvoiceStatus } from "@/lib/types/database";
import { getLegalCompanyName } from "@/lib/organization/platform-settings";

export default async function PortalInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ data, error }, companyName] = await Promise.all([
    getInvoice(id),
    getLegalCompanyName(),
  ]);
  if (error || !data) notFound();

  const displayStatus = effectiveInvoiceStatus(
    data.status as InvoiceStatus,
    data.due_date
  );
  const shipment = data.shipments as { id?: string } | null;

  const canPay = displayStatus === "sent" || displayStatus === "overdue";
  const isPaid = data.status === "paid";

  return (
    <div>
      <div className="print:hidden mb-6 space-y-4">
        <PageHeader
          title={data.invoice_number}
          description={`${data.currency} ${Number(data.amount).toFixed(2)}`}
          action={<PrintInvoiceButton />}
        />
        <div className="flex items-center gap-2">
          <StatusBadge status={displayStatus} />
          <Link href="/app/portal/invoices" className="text-sm text-primary hover:underline ml-auto">
            ← All invoices
          </Link>
        </div>
        {canPay && !data.payment_reference && (
          <SubmitPaymentForm invoiceId={data.id} />
        )}
        {data.payment_reference && !isPaid && (
          <div className="text-sm text-muted-foreground rounded-md border p-3 bg-muted/30 space-y-2">
            <p>
              Payment reference submitted: <strong>{data.payment_reference}</strong>. Awaiting
              confirmation from our billing team.
            </p>
            {data.payment_proof_url ? (
              <p>
                Proof attached:{" "}
                <a
                  href={data.payment_proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View receipt
                </a>
              </p>
            ) : null}
          </div>
        )}
        {isPaid && (
          <p className="text-sm text-green-700 rounded-md border border-green-200 p-3 bg-green-50">
            This invoice has been marked as paid
            {data.paid_at
              ? ` on ${new Date(data.paid_at).toLocaleDateString()}`
              : ""}
            .
          </p>
        )}
      </div>
      <InvoiceDocument
        companyName={companyName}
        invoice={{
          invoice_number: data.invoice_number,
          amount: Number(data.amount),
          currency: data.currency,
          status: displayStatus,
          due_date: data.due_date,
          paid_at: data.paid_at,
          sent_at: data.sent_at,
          payment_reference: data.payment_reference,
          notes: data.notes,
          created_at: data.created_at,
          customer: data.customer,
          shipmentDetails: data.shipmentDetails,
          trackingHref: shipment?.id
            ? `/app/portal/track/${shipment.id}`
            : undefined,
        }}
      />
    </div>
  );
}
