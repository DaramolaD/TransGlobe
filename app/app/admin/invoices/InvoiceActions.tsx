"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ban,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Send,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  sendInvoice,
  markInvoicePaid,
  cancelInvoice,
  resendInvoice,
} from "@/lib/actions/invoices";
import type { InvoiceStatus } from "@/lib/types/database";
import { toast } from "sonner";

export function InvoiceActions({
  id,
  status,
  invoiceNumber,
}: {
  id: string;
  status: InvoiceStatus;
  invoiceNumber?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run(
    action: () => Promise<{ error?: string; success?: boolean }>,
    label: string
  ) {
    setLoading(true);
    const r = await action();
    setLoading(false);
    if (r.error) toast.error(r.error);
    else {
      toast.success(label);
      router.refresh();
    }
  }

  const isFinal = status === "cancelled" || status === "paid";

  return (
    <div className="flex justify-end" data-no-row-click>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground data-[state=open]:bg-muted"
            aria-label={
              invoiceNumber ? `Actions for ${invoiceNumber}` : "Invoice actions"
            }
            disabled={loading}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/app/admin/invoices/${id}`}>
              <Eye className="mr-2 h-4 w-4" />
              View invoice page
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {!isFinal ? (
            <>
              {status === "draft" ? (
                <DropdownMenuItem
                  disabled={loading}
                  onSelect={(e) => {
                    e.preventDefault();
                    void run(() => sendInvoice(id), "Invoice sent to customer");
                  }}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send to customer
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  disabled={loading}
                  onSelect={(e) => {
                    e.preventDefault();
                    void run(() => resendInvoice(id), "Reminder sent to customer");
                  }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Resend to customer
                </DropdownMenuItem>
              )}
              {status === "sent" || status === "overdue" ? (
                <DropdownMenuItem
                  disabled={loading}
                  onSelect={(e) => {
                    e.preventDefault();
                    void run(() => markInvoicePaid(id), "Marked as paid");
                  }}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as paid
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                disabled={loading}
                className="text-destructive focus:text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  void run(() => cancelInvoice(id), "Invoice cancelled");
                }}
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancel invoice
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
