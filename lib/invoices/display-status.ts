import type { InvoiceStatus } from "@/lib/types/database";

/** Effective status for display (sent + past due → overdue) */
export function effectiveInvoiceStatus(
  status: InvoiceStatus,
  dueDate: string | null
): InvoiceStatus {
  if (status !== "sent" || !dueDate) return status;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  if (due < new Date()) return "overdue";
  return status;
}
