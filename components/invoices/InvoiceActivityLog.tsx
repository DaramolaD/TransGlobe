import { ActivitySection } from "@/components/dashboard/ActivitySection";

export function InvoiceActivityLog({ invoiceId }: { invoiceId: string }) {
  return (
    <ActivitySection
      entityType="invoice"
      entityId={invoiceId}
      title="Activity log"
      description="Send, payment, and billing actions. Also in Superadmin → Audit logs."
    />
  );
}
