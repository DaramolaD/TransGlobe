"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPaymentReference } from "@/lib/actions/invoices";
import { uploadInvoicePaymentProof } from "@/lib/actions/uploads";
import {
  isAllowedPaymentProofSize,
  isAllowedPaymentProofType,
} from "@/lib/cloudinary/validation";
import { toast } from "sonner";
import { FileText, X } from "lucide-react";

export function SubmitPaymentForm({ invoiceId }: { invoiceId: string }) {
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onFileChange(selected: File | null) {
    if (!selected) {
      setFile(null);
      return;
    }
    if (!isAllowedPaymentProofType(selected.type)) {
      toast.error("Use JPG, PNG, WEBP, or PDF.");
      return;
    }
    if (!isAllowedPaymentProofSize(selected.size)) {
      toast.error("File must be 5 MB or smaller.");
      return;
    }
    setFile(selected);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    let proof:
      | { url: string; public_id: string; uploaded_at: string }
      | undefined;

    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      const upload = await uploadInvoicePaymentProof(fd);
      if (upload.error) {
        setLoading(false);
        toast.error(upload.error);
        return;
      }
      proof = upload.data;
    }

    const r = await submitPaymentReference(invoiceId, reference, proof);
    setLoading(false);

    if (r.error) toast.error(r.error);
    else {
      toast.success("Payment submitted. Our team will confirm shortly.");
      setReference("");
      setFile(null);
    }
  }

  const isPdf = file?.type === "application/pdf";

  return (
    <form onSubmit={submit} className="rounded-lg border p-4 space-y-4 bg-muted/20">
      <div>
        <h3 className="font-semibold text-sm">Submit payment</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Enter your bank reference and optionally attach a receipt or proof of payment.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay-ref">Reference / transaction ID</Label>
        <Input
          id="pay-ref"
          required
          placeholder="e.g. WIRE-20250526-ABC123"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pay-proof">Payment proof (optional)</Label>
        <Input
          id="pay-proof"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, or PDF · max 5 MB</p>
      </div>

      {file && previewUrl ? (
        <div className="relative rounded-md border bg-background p-3">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2 h-7 w-7"
            onClick={() => setFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          <p className="text-xs font-medium mb-2 pr-8 truncate">{file.name}</p>
          {isPdf ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-8 w-8" />
              PDF attached — preview on submit
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Payment proof preview"
              className="max-h-48 rounded object-contain mx-auto"
            />
          )}
        </div>
      ) : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting…" : "Submit payment"}
      </Button>
    </form>
  );
}
