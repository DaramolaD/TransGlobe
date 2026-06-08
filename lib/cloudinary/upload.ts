import { createHash } from "crypto";
import {
  isAllowedPaymentProofSize,
  isAllowedPaymentProofType,
} from "@/lib/cloudinary/validation";

export type CloudinaryUploadResult = {
  url: string;
  public_id: string;
  uploaded_at: string;
};

export async function uploadPaymentProof(
  file: File
): Promise<{ data?: CloudinaryUploadResult; error?: string }> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return { error: "Cloudinary is not configured. Add CLOUDINARY_* env vars." };
  }

  if (!isAllowedPaymentProofType(file.type)) {
    return { error: "File must be JPG, PNG, WEBP, or PDF." };
  }

  if (!isAllowedPaymentProofSize(file.size)) {
    return { error: "File must be 5 MB or smaller." };
  }

  const folder = "transglobe/payment-proofs";
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(paramsToSign + apiSecret)
    .digest("hex");

  const body = new FormData();
  body.append("file", file);
  body.append("api_key", apiKey);
  body.append("timestamp", String(timestamp));
  body.append("signature", signature);
  body.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body,
  });

  const json = (await res.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!res.ok || !json.secure_url || !json.public_id) {
    return { error: json.error?.message ?? "Upload failed" };
  }

  return {
    data: {
      url: json.secure_url,
      public_id: json.public_id,
      uploaded_at: new Date().toISOString(),
    },
  };
}
