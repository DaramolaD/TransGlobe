"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInvoice } from "@/lib/actions/invoices";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ShipmentOption = {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
};

export function CreateInvoiceForm({
  shipments,
  defaultShipmentId,
}: {
  shipments: ShipmentOption[];
  defaultShipmentId?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shipmentId, setShipmentId] = useState(defaultShipmentId ?? "");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [sendNow, setSendNow] = useState(false);

  const selected = shipments.find((s) => s.id === shipmentId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!shipmentId) {
      toast.error("Select a shipment");
      return;
    }
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    const r = await createInvoice({
      shipmentId,
      amount: parsed,
      dueDate: dueDate || undefined,
      notes: notes || undefined,
      send: sendNow,
    });
    setLoading(false);

    if (r.error) toast.error(r.error);
    else if (r.existing) {
      toast.info(`Invoice ${r.invoiceNumber} already exists for this shipment`);
      if (r.invoiceId) router.push(`/app/admin/invoices/${r.invoiceId}`);
    } else {
      toast.success(sendNow ? "Invoice created and sent" : "Draft invoice created");
      if (r.invoice?.id) router.push(`/app/admin/invoices/${r.invoice.id}`);
      else router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border p-4 space-y-4 mb-8 bg-muted/20">
      <h3 className="font-semibold text-sm">Create invoice from shipment (any status)</h3>
      <p className="text-xs text-muted-foreground">
        Bill before or after dispatch. Drivers can only be assigned once the invoice is paid.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label>Shipment</Label>
          <Select value={shipmentId} onValueChange={setShipmentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select shipment…" />
            </SelectTrigger>
            <SelectContent>
              {shipments.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.tracking_number} — {s.origin} → {s.destination} ({s.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-amount">Amount</Label>
          <Input
            id="inv-amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-due">Due date</Label>
          <Input
            id="inv-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="inv-notes">Notes (optional)</Label>
          <Textarea
            id="inv-notes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Payment terms, PO number, etc."
          />
        </div>
      </div>
      {selected && (
        <p className="text-xs text-muted-foreground">
          Route: {selected.origin} → {selected.destination}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={sendNow}
            onChange={(e) => setSendNow(e.target.checked)}
            className="rounded"
          />
          Send to customer immediately
        </label>
        <Button type="submit" disabled={loading || shipments.length === 0}>
          {loading ? "Creating…" : "Create invoice"}
        </Button>
      </div>
    </form>
  );
}
