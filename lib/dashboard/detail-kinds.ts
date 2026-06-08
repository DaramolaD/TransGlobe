import type { LucideIcon } from "lucide-react";
import {
  User,
  UserCircle,
  Package,
  Users,
  Truck,
  ClipboardList,
  AlertTriangle,
  Receipt,
  Warehouse,
} from "lucide-react";

export type DataTableDetailKind =
  | "member"
  | "customer"
  | "shipment"
  | "lead"
  | "pickup"
  | "invoice"
  | "quote"
  | "claim"
  | "facility";

export const DETAIL_KIND_CONFIG: Record<
  DataTableDetailKind,
  { label: string; icon: LucideIcon; iconClass: string; headerClass: string }
> = {
  member: {
    label: "Team member",
    icon: User,
    iconClass: "bg-violet-100 text-violet-800 ring-violet-200",
    headerClass: "bg-violet-50/80 border-violet-100",
  },
  customer: {
    label: "Customer",
    icon: UserCircle,
    iconClass: "bg-slate-100 text-slate-800 ring-slate-200",
    headerClass: "bg-slate-50/80 border-slate-100",
  },
  shipment: {
    label: "Shipment",
    icon: Package,
    iconClass: "bg-sky-100 text-sky-800 ring-sky-200",
    headerClass: "bg-sky-50/80 border-sky-100",
  },
  lead: {
    label: "Lead",
    icon: Users,
    iconClass: "bg-blue-100 text-blue-800 ring-blue-200",
    headerClass: "bg-blue-50/80 border-blue-100",
  },
  pickup: {
    label: "Pickup request",
    icon: Truck,
    iconClass: "bg-amber-100 text-amber-900 ring-amber-200",
    headerClass: "bg-amber-50/80 border-amber-100",
  },
  invoice: {
    label: "Invoice",
    icon: Receipt,
    iconClass: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    headerClass: "bg-emerald-50/80 border-emerald-100",
  },
  quote: {
    label: "Quote",
    icon: ClipboardList,
    iconClass: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    headerClass: "bg-indigo-50/80 border-indigo-100",
  },
  claim: {
    label: "Claim",
    icon: AlertTriangle,
    iconClass: "bg-orange-100 text-orange-800 ring-orange-200",
    headerClass: "bg-orange-50/80 border-orange-100",
  },
  facility: {
    label: "Facility location",
    icon: Warehouse,
    iconClass: "bg-teal-100 text-teal-800 ring-teal-200",
    headerClass: "bg-teal-50/80 border-teal-100",
  },
};
