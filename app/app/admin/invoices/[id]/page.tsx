import Link from "next/link";
import { notFound } from "next/navigation";
import { getInvoice } from "@/lib/actions/invoices";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { InvoiceDocument } from "@/components/invoices/InvoiceDocument";
import { effectiveInvoiceStatus } from "@/lib/invoices/display-status";
import { dashboardTrackingHref } from "@/lib/dashboard/tracking-links";
import { InvoiceActions } from "../InvoiceActions";
import { PrintInvoiceButton } from "@/components/invoices/PrintInvoiceButton";
import { InvoiceActivityLog } from "@/components/invoices/InvoiceActivityLog";
import { InvoiceRelatedRecords } from "@/components/invoices/InvoiceRelatedRecords";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvoiceStatus } from "@/lib/types/database";
import { getLegalCompanyName } from "@/lib/organization/platform-settings";

export default async function AdminInvoiceDetailPage({
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
  const shipmentRaw = data.shipments as Record<string, unknown> | Record<string, unknown>[] | null;
  const shipment = Array.isArray(shipmentRaw)
    ? (shipmentRaw[0] as {
        id: string;
        tracking_number: string;
        origin: string;
        destination: string;
        status: string;
        service_type?: string;
      })
    : (shipmentRaw as {
        id: string;
        tracking_number: string;
        origin: string;
        destination: string;
        status: string;
        service_type?: string;
      } | null);
  const trackingLabel =
    data.shipmentDetails?.trackingNumber ?? shipment?.tracking_number ?? "No shipment";

  return (
    <div className="print:p-0">
      <div className="print:hidden mb-6 space-y-4">
        <PageHeader
          title={data.invoice_number}
          description={`${data.currency} ${Number(data.amount).toFixed(2)} · ${trackingLabel}`}
          action={
            <div className="flex flex-wrap gap-2">
              <PrintInvoiceButton />
              <InvoiceActions
                id={data.id}
                status={displayStatus}
                invoiceNumber={data.invoice_number}
              />
            </div>
          }
        />
        <div className="flex items-center gap-2 text-sm">
          <StatusBadge status={displayStatus} />
          {data.payment_reference && (
            <span className="text-muted-foreground">
              Payment ref: <strong>{data.payment_reference}</strong>
              {data.payment_proof_url ? (
                <>
                  {" · "}
                  <a
                    href={data.payment_proof_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View proof
                  </a>
                </>
              ) : null}
            </span>
          )}
          <Link href="/app/admin/invoices" className="text-primary hover:underline ml-auto">
            ← All invoices
          </Link>
        </div>
      </div>
      <InvoiceRelatedRecords
        customer={data.customer}
        shipment={shipment}
        assignment={data.assignment ?? null}
        quote={data.quote ?? null}
      />

      <div className="print:hidden mb-6 mt-6">
        <InvoiceActivityLog invoiceId={data.id} />
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
          trackingHref: shipment?.id ? dashboardTrackingHref(shipment.id) : undefined,
        }}
      />
    </div>
  );
}
