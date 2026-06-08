"use server";

import { uploadPaymentProof } from "@/lib/cloudinary/upload";

export async function uploadInvoicePaymentProof(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected" };
  }
  return uploadPaymentProof(file);
}
