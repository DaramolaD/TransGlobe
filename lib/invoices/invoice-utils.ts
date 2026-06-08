import { randomBytes } from "crypto";

const ID_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInvoiceNumber(prefix = "INV", date = new Date()): string {
  const brand = (prefix || "INV").toUpperCase().slice(0, 8);
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = randomBytes(4);
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += ID_CHARS[bytes[i]! % ID_CHARS.length];
  }
  return `${brand}-${yymmdd}-${suffix}`;
}

export function dueDateFromPaymentTerms(days: number, from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + Math.max(0, days));
  return d.toISOString().slice(0, 10);
}

export function amountWithTax(subtotal: number, taxRatePercent: number): {
  subtotal: number;
  tax: number;
  total: number;
  note: string | null;
} {
  const rate = Math.max(0, taxRatePercent);
  const tax = Math.round(subtotal * (rate / 100) * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const note =
    rate > 0
      ? `Subtotal ${subtotal.toFixed(2)} + tax (${rate}%) ${tax.toFixed(2)} = ${total.toFixed(2)}`
      : null;
  return { subtotal, tax, total, note };
}
