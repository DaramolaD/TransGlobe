import type { BookingAddress, BookingContact, BookingPackage } from "@/lib/actions/shipments";

export type InvoicePartyDisplay = {
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  addressLines: string[];
};

export type InvoicePackageDisplay = {
  description: string;
  quantity: number;
  weightKg?: number | null;
  dimensions?: string | null;
  packageType?: string | null;
  imageName?: string | null;
};

export type InvoiceShipmentDetails = {
  trackingNumber: string;
  serviceLabel: string;
  shipmentStatus?: string;
  weightKg: number | null;
  packageCount: number | null;
  routeSummary: string;
  shipper: InvoicePartyDisplay | null;
  recipient: InvoicePartyDisplay | null;
  packages: InvoicePackageDisplay[];
  goodsDescription?: string | null;
  referenceNumber?: string | null;
  hasStructuredData: boolean;
  legacyOrigin?: string;
  legacyDestination?: string;
};

type ShipmentRow = {
  tracking_number: string;
  origin: string;
  destination: string;
  service_type: string;
  status?: string;
  weight_kg?: number | null;
  package_count?: number | null;
  metadata?: unknown;
  special_instructions?: string | null;
};

type DbPackage = {
  description: string | null;
  weight_kg: number | null;
  dimensions: string | null;
  quantity: number | null;
};

function formatAddressLines(address: BookingAddress): string[] {
  const cityLine = [address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(", ");
  return [
    address.line1,
    address.line2 ?? "",
    cityLine,
    address.country,
  ].filter((line) => line.trim().length > 0);
}

function contactToParty(contact: BookingContact): InvoicePartyDisplay {
  return {
    name: contact.name,
    company: contact.company,
    phone: contact.phone,
    email: contact.email,
    addressLines: formatAddressLines(contact.address),
  };
}

function serviceLabel(slug: string): string {
  return slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function parseMetadata(metadata: unknown): {
  shipper?: BookingContact;
  recipient?: BookingContact;
  packages?: BookingPackage[];
  goodsDescription?: string | null;
  referenceNumber?: string | null;
} | null {
  if (!metadata || typeof metadata !== "object") return null;
  const m = metadata as Record<string, unknown>;
  return {
    shipper: m.shipper as BookingContact | undefined,
    recipient: m.recipient as BookingContact | undefined,
    packages: m.packages as BookingPackage[] | undefined,
    goodsDescription: (m.goodsDescription as string) ?? null,
    referenceNumber: (m.referenceNumber as string) ?? null,
  };
}

function mergePackages(
  metaPackages: BookingPackage[] | undefined,
  dbPackages: DbPackage[]
): InvoicePackageDisplay[] {
  if (metaPackages?.length) {
    return metaPackages.map((p) => ({
      description: p.description || "Package",
      quantity: p.quantity ?? 1,
      weightKg: p.weightKg ?? null,
      dimensions:
        p.lengthCm && p.widthCm && p.heightCm
          ? `${p.lengthCm} × ${p.widthCm} × ${p.heightCm} cm`
          : null,
      packageType: p.packageType ?? null,
      imageName: p.imageName ?? null,
    }));
  }

  return dbPackages.map((p) => ({
    description: p.description || "Package",
    quantity: p.quantity ?? 1,
    weightKg: p.weight_kg,
    dimensions: p.dimensions,
    packageType: null,
    imageName: null,
  }));
}

function cityCountryFromLegacy(line: string): string {
  const parts = line.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  }
  return line.length > 48 ? `${line.slice(0, 45)}…` : line;
}

export function buildInvoiceShipmentDetails(
  shipment: ShipmentRow | null | undefined,
  dbPackages: DbPackage[] = []
): InvoiceShipmentDetails | null {
  if (!shipment) return null;

  const meta = parseMetadata(shipment.metadata);
  const packages = mergePackages(meta?.packages, dbPackages);

  const shipper = meta?.shipper ? contactToParty(meta.shipper) : null;
  const recipient = meta?.recipient ? contactToParty(meta.recipient) : null;

  const routeSummary =
    meta?.shipper?.address && meta?.recipient?.address
      ? `${meta.shipper.address.city}, ${meta.shipper.address.country} → ${meta.recipient.address.city}, ${meta.recipient.address.country}`
      : `${cityCountryFromLegacy(shipment.origin)} → ${cityCountryFromLegacy(shipment.destination)}`;

  return {
    trackingNumber: shipment.tracking_number,
    serviceLabel: serviceLabel(shipment.service_type),
    shipmentStatus: shipment.status,
    weightKg: shipment.weight_kg != null ? Number(shipment.weight_kg) : null,
    packageCount: shipment.package_count ?? (packages.length > 0 ? packages.length : null),
    routeSummary,
    shipper,
    recipient,
    packages,
    goodsDescription: meta?.goodsDescription ?? shipment.special_instructions ?? null,
    referenceNumber: meta?.referenceNumber ?? null,
    hasStructuredData: Boolean(shipper && recipient),
    legacyOrigin: shipment.origin,
    legacyDestination: shipment.destination,
  };
}
