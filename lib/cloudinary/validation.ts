const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

export const PAYMENT_PROOF_MAX_BYTES = 5 * 1024 * 1024;

export function isAllowedPaymentProofType(mime: string) {
  return ALLOWED_MIME.has(mime);
}

export function isAllowedPaymentProofSize(size: number) {
  return size <= PAYMENT_PROOF_MAX_BYTES;
}
