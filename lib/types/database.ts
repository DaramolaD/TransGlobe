export type UserRole = "superadmin" | "admin" | "sales" | "driver" | "user";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";
export type LeadCategory = "sales" | "content" | "marketing";
export type QuoteStatus =
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  | "expired"
  | "converted";
export type ClaimStatus = "open" | "investigating" | "resolved" | "rejected";
export type ShipmentStatus =
  | "draft"
  | "quote_pending"
  | "booked"
  | "pickup_scheduled"
  | "picked_up"
  | "at_origin_hub"
  | "in_transit"
  | "customs"
  | "at_destination_hub"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "cancelled"
  | "returned";
/** Service slug — matches `service_types.slug` (e.g. air, sea, or custom codes) */
export type ServiceType = string;

export interface ServiceTypeCatalog {
  id: string;
  organization_id: string;
  slug: string;
  label: string;
  description: string | null;
  delivery_hint: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface FacilityTypeCatalog {
  id: string;
  organization_id: string;
  slug: string;
  label: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}
export type CmsPostStatus = "draft" | "published" | "archived";
export type InvoiceStatus =
  | "draft"
  | "sent"
  | "paid"
  | "overdue"
  | "cancelled";
export type DriverAvailabilityStatus = "available" | "busy" | "offline";

/** JSON shape documented in `lib/organization/settings.ts` (`PlatformSettings`) */
export type OrganizationSettings = import("@/lib/organization/settings").PlatformSettings;

export interface Organization {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  settings: OrganizationSettings | Record<string, unknown>;
  is_active: boolean;
}

export interface Profile {
  id: string;
  organization_id: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  company_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export interface DriverAvailability {
  driver_id: string;
  organization_id: string;
  status: DriverAvailabilityStatus;
  reason: string | null;
  updated_at: string;
}

export interface Lead {
  id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string | null;
  message: string | null;
  status: LeadStatus;
  category: LeadCategory;
  assigned_to: string | null;
  source: string | null;
  last_contacted_at: string | null;
  lost_reason: string | null;
  created_at: string;
  updated_at: string;
  assignee?: {
    id: string;
    full_name: string | null;
    email: string;
  } | null;
}

export interface RateCard {
  id: string;
  organization_id: string;
  name: string;
  service_type: ServiceType;
  price_per_kg: number;
  min_charge: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Quote {
  id: string;
  organization_id: string;
  origin: string;
  destination: string;
  weight_kg: number | null;
  service_type: ServiceType;
  total_price: number | null;
  status: QuoteStatus;
  created_at: string;
}

export interface Shipment {
  id: string;
  organization_id: string;
  created_by: string | null;
  tracking_number: string;
  status: ShipmentStatus;
  service_type: ServiceType;
  origin: string;
  destination: string;
  current_location: string | null;
  estimated_delivery: string | null;
  weight_kg: number | null;
  created_at: string;
}

export interface TrackingEvent {
  id: string;
  shipment_id: string;
  status: string;
  location: string | null;
  description: string | null;
  event_at: string;
  is_public: boolean;
}

export interface CmsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: CmsPostStatus;
  published_at: string | null;
  read_time_minutes: number;
  views_count: number;
  featured: boolean;
  author_id: string | null;
  category_id: string | null;
}

export interface PickupRequest {
  id: string;
  status: string;
  pickup_date: string;
  contact_name: string;
  contact_email: string;
  pickup_address: string;
  pickup_city: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  shipment_id: string;
  driver_id: string;
  status: string;
  assigned_at: string;
}

export interface Invoice {
  id: string;
  organization_id: string;
  shipment_id: string | null;
  customer_id: string | null;
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  sent_at: string | null;
  payment_reference: string | null;
  payment_proof_url: string | null;
  payment_proof_public_id: string | null;
  payment_proof_uploaded_at: string | null;
  payment_submitted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  shipment_id: string;
  claim_type: string;
  description: string;
  status: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
}
