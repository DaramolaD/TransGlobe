import type { InvoiceStatus } from "@/lib/types/database";

export type ShipmentBillingState = {
  hasInvoice: boolean;
  invoiceId: string | null;
  invoiceNumber: string | null;
  invoiceStatus: InvoiceStatus | null;
  canAssignDriver: boolean;
  blockingReason: string | null;
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  status: InvoiceStatus;
};

export function billingStateFromInvoice(
  invoice: InvoiceRow | null | undefined,
  options?: { requirePaidInvoice?: boolean }
): ShipmentBillingState {
  const requirePaid = options?.requirePaidInvoice !== false;

  if (!requirePaid) {
    return {
      hasInvoice: Boolean(invoice),
      invoiceId: invoice?.id ?? null,
      invoiceNumber: invoice?.invoice_number ?? null,
      invoiceStatus: invoice?.status ?? null,
      canAssignDriver: true,
      blockingReason: null,
    };
  }

  if (!invoice) {
    return {
      hasInvoice: false,
      invoiceId: null,
      invoiceNumber: null,
      invoiceStatus: null,
      canAssignDriver: false,
      blockingReason:
        "Create an invoice for this shipment before assigning a driver.",
    };
  }

  const paid = invoice.status === "paid";

  return {
    hasInvoice: true,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoice_number,
    invoiceStatus: invoice.status,
    canAssignDriver: paid,
    blockingReason: paid
      ? null
      : invoice.status === "draft"
        ? "Send the invoice and mark it paid before dispatch."
        : invoice.status === "sent" || invoice.status === "overdue"
          ? "Invoice must be paid before a driver can be assigned."
          : "A paid invoice is required before dispatch.",
  };
}
