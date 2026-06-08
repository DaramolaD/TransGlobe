import type { UserRole } from "@/lib/types/database";

export const PREVIEW_ACTIVITY_LIMIT = 5;
export const FULL_ACTIVITY_LIMIT = 50;

export type ActivityShipment = {
  id: string;
  tracking_number: string;
  status: string;
  service_type?: string;
  origin: string;
  destination: string;
  weight_kg?: number | null;
  package_count?: number | null;
  estimated_delivery?: string | null;
  created_at: string;
};

export type ActivityAssignment = {
  id: string;
  status: string;
  assigned_at: string;
  completed_at: string | null;
  shipment: ActivityShipment | null;
};

export type ActivityInvoice = {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: string;
  due_date?: string | null;
  created_at: string;
};

export type ActivityPickup = {
  id: string;
  status: string;
  pickup_city: string;
  pickup_address?: string;
  pickup_date: string;
  pickup_time?: string | null;
  pickup_country?: string | null;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  package_count?: number | null;
  package_weight?: string | null;
  special_instructions?: string | null;
  created_at: string;
};

export type ActivityQuote = {
  id: string;
  origin: string;
  destination: string;
  status: string;
  service_type?: string;
  total_price: number | null;
  weight_kg?: number | null;
  created_at: string;
};

export type ActivityClaim = {
  id: string;
  claim_type: string;
  status: string;
  description?: string;
  created_at: string;
  tracking_number?: string;
};

export type ProfileActivityProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileActivityResult = {
  profile: ProfileActivityProfile;
  shipments: ActivityShipment[];
  assignments: ActivityAssignment[];
  invoices: ActivityInvoice[];
  pickups: ActivityPickup[];
  quotes: ActivityQuote[];
  claims: ActivityClaim[];
};

export type ProfileActivityOptions = {
  /** `preview` = recent slice for table modal; `full` = complete history on detail page */
  scope?: "preview" | "full";
  limit?: number;
};

export function mapAssignments(
  data: {
    id: string;
    status: string;
    assigned_at: string;
    completed_at: string | null;
    shipments: ActivityShipment | ActivityShipment[] | null;
  }[]
): ActivityAssignment[] {
  return data.map((a) => {
    const raw = a.shipments;
    const shipment = Array.isArray(raw) ? raw[0] ?? null : raw;
    return {
      id: a.id,
      status: a.status,
      assigned_at: a.assigned_at,
      completed_at: a.completed_at,
      shipment,
    };
  });
}

export function mapClaims(
  data: {
    id: string;
    claim_type: string;
    status: string;
    description?: string;
    created_at: string;
    shipments: { tracking_number?: string } | { tracking_number?: string }[] | null;
  }[]
): ActivityClaim[] {
  return data.map((c) => {
    const raw = c.shipments;
    const shipment = Array.isArray(raw) ? raw[0] ?? null : raw;
    return {
      id: c.id,
      claim_type: c.claim_type,
      status: c.status,
      description: c.description,
      created_at: c.created_at,
      tracking_number: shipment?.tracking_number,
    };
  });
}
