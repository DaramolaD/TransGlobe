import { format } from "date-fns";
import type { InvoiceStatus } from "@/lib/types/database";
import type { InvoiceShipmentDetails } from "@/lib/invoices/shipment-invoice-display";
import { InvoiceShipmentDetails as InvoiceShipmentSection } from "./InvoiceShipmentDetails";

export type InvoiceDocumentData = {
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  sent_at: string | null;
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
  customer?: {
    full_name: string | null;
    email: string | null;
    company_name?: string | null;
    phone?: string | null;
  } | null;
  shipmentDetails?: InvoiceShipmentDetails | null;
  trackingHref?: string;
};

export function InvoiceDocument({
  invoice,
  companyName = "SwiftCargo",
}: {
  invoice: InvoiceDocumentData;
  companyName?: string;
}) {
  const customer = invoice.customer;
  const details = invoice.shipmentDetails;

  const lineDescription = details
    ? `${details.serviceLabel} freight — ${details.trackingNumber}${
        details.packageCount ? ` (${details.packageCount} package${details.packageCount === 1 ? "" : "s"})` : ""
      }`
    : "Freight & logistics services";

  return (
    <div className="invoice-document bg-white text-graphite-dark p-6 sm:p-8 max-w-3xl mx-auto border rounded-lg shadow-sm print:shadow-none print:border-0">
      <div className="flex justify-between items-start border-b pb-6 mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{companyName}</h1>
          <p className="text-sm text-muted-foreground mt-1">Logistics &amp; freight</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold">INVOICE</p>
          <p className="font-mono text-sm mt-1">{invoice.invoice_number}</p>
          <p className="text-xs text-muted-foreground mt-2 capitalize">
            Status: {invoice.status.replace(/_/g, " ")}
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-8 text-sm">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Bill to
          </p>
          <p className="font-medium">{customer?.full_name ?? "Customer"}</p>
          {customer?.company_name ? <p>{customer.company_name}</p> : null}
          {customer?.email ? (
            <p className="text-muted-foreground">{customer.email}</p>
          ) : null}
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Invoice dates
          </p>
          <p>
            <span className="text-muted-foreground">Issued:</span>{" "}
            {format(new Date(invoice.created_at), "MMM d, yyyy")}
          </p>
          {invoice.due_date ? (
            <p>
              <span className="text-muted-foreground">Due:</span>{" "}
              {format(new Date(invoice.due_date), "MMM d, yyyy")}
            </p>
          ) : null}
          {invoice.paid_at ? (
            <p>
              <span className="text-muted-foreground">Paid:</span>{" "}
              {format(new Date(invoice.paid_at), "MMM d, yyyy")}
            </p>
          ) : null}
        </div>
      </div>

      {details ? (
        <InvoiceShipmentSection
          details={details}
          trackingHref={invoice.trackingHref}
        />
      ) : null}

      <table className="w-full text-sm mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Description</th>
            <th className="text-right py-2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-3 pr-4">{lineDescription}</td>
            <td className="py-3 text-right font-mono whitespace-nowrap">
              {invoice.currency} {Number(invoice.amount).toFixed(2)}
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="pt-4 text-right font-semibold">Total due</td>
            <td className="pt-4 text-right font-mono font-bold text-lg whitespace-nowrap">
              {invoice.currency} {Number(invoice.amount).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {invoice.payment_reference ? (
        <p className="text-sm mb-4">
          <span className="text-muted-foreground">Payment reference:</span>{" "}
          {invoice.payment_reference}
        </p>
      ) : null}

      {invoice.notes ? (
        <div className="text-sm border-t pt-4">
          <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Notes</p>
          <p className="whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      ) : null}

      <p className="text-xs text-muted-foreground mt-8 border-t pt-4">
        Thank you for shipping with {companyName}. Questions about this invoice or your
        shipment? <br /> Contact billing@swiftcargo.com and quote invoice{" "}
        {invoice.invoice_number}
        {details ? ` and tracking ${details.trackingNumber}` : ""}.
      </p>
    </div>
  );
}
