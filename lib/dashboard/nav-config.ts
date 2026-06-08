import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  FileText,
  Settings,
  Bell,
  PenSquare,
  BarChart3,
  ClipboardList,
  MapPin,
  DollarSign,
  AlertTriangle,
  Briefcase,
  UserCircle,
} from "lucide-react";
import type { UserRole } from "@/lib/types/database";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export type NavGroup = {
  id: string;
  label: string;
  icon: LucideIcon;
  items: NavItem[];
};

const ICONS = {
  dashboard: LayoutDashboard,
  shipments: Package,
  leads: Users,
  quotes: ClipboardList,
  dispatch: MapPin,
  drivers: Truck,
  invoices: DollarSign,
  claims: AlertTriangle,
  cms: PenSquare,
  reports: BarChart3,
  settings: Settings,
  users: Users,
  pickups: Package,
  track: Package,
  book: Package,
  documents: FileText,
  support: Bell,
  team: Briefcase,
  customers: UserCircle,
} as const;

const SUPERADMIN_NAV: NavGroup[] = [
  {
    id: "platform",
    label: "Platform",
    icon: ICONS.settings,
    items: [
      { label: "Overview", href: "/app/superadmin", icon: ICONS.dashboard },
      { label: "Team", href: "/app/superadmin/users", icon: ICONS.team },
      { label: "Customers", href: "/app/superadmin/customers", icon: ICONS.customers },
      { label: "Rate cards", href: "/app/superadmin/rates", icon: ICONS.invoices },
      { label: "Audit logs", href: "/app/superadmin/audit", icon: ICONS.reports },
      { label: "Settings", href: "/app/superadmin/settings", icon: ICONS.settings },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: ICONS.dispatch,
    items: [
      { label: "Ops dashboard", href: "/app/admin", icon: ICONS.dashboard },
      { label: "Tracking", href: "/app/admin/tracking", icon: ICONS.dispatch },
      { label: "Shipments", href: "/app/admin/shipments", icon: ICONS.shipments },
      { label: "Pickups", href: "/app/admin/pickups", icon: ICONS.pickups },
      { label: "Dispatch", href: "/app/admin/dispatch", icon: ICONS.dispatch },
      { label: "Drivers", href: "/app/admin/drivers", icon: ICONS.drivers },
      { label: "Locations", href: "/app/admin/settings/locations", icon: ICONS.dispatch },
    ],
  },
  {
    id: "sales-finance",
    label: "Sales & finance",
    icon: ICONS.invoices,
    items: [
      { label: "Leads", href: "/app/admin/leads", icon: ICONS.leads },
      { label: "Quotes", href: "/app/admin/quotes", icon: ICONS.quotes },
      { label: "Invoices", href: "/app/admin/invoices", icon: ICONS.invoices },
      { label: "Claims", href: "/app/admin/claims", icon: ICONS.claims },
    ],
  },
  {
    id: "content",
    label: "Content & reports",
    icon: ICONS.cms,
    items: [
      { label: "CMS", href: "/app/cms", icon: ICONS.cms },
      { label: "Reports", href: "/app/admin/reports", icon: ICONS.reports },
    ],
  },
  {
    id: "field",
    label: "Field (driver)",
    icon: ICONS.drivers,
    items: [
      { label: "Driver home", href: "/app/driver", icon: ICONS.dashboard },
      { label: "Driver jobs", href: "/app/driver/jobs", icon: ICONS.shipments },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    icon: ICONS.dashboard,
    items: [{ label: "Dashboard", href: "/app/admin", icon: ICONS.dashboard }],
  },
  {
    id: "sales",
    label: "Sales",
    icon: ICONS.leads,
    items: [
      { label: "Leads", href: "/app/admin/leads", icon: ICONS.leads },
      { label: "Quotes", href: "/app/admin/quotes", icon: ICONS.quotes },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    icon: ICONS.shipments,
    items: [
      { label: "Tracking", href: "/app/admin/tracking", icon: ICONS.dispatch },
      { label: "Shipments", href: "/app/admin/shipments", icon: ICONS.shipments },
      { label: "Pickups", href: "/app/admin/pickups", icon: ICONS.pickups },
      { label: "Dispatch", href: "/app/admin/dispatch", icon: ICONS.dispatch },
      { label: "Drivers", href: "/app/admin/drivers", icon: ICONS.drivers },
      { label: "Locations", href: "/app/admin/settings/locations", icon: ICONS.dispatch },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: ICONS.invoices,
    items: [
      { label: "Invoices", href: "/app/admin/invoices", icon: ICONS.invoices },
      { label: "Claims", href: "/app/admin/claims", icon: ICONS.claims },
    ],
  },
  {
    id: "content",
    label: "Content & reports",
    icon: ICONS.reports,
    items: [
      { label: "CMS", href: "/app/cms", icon: ICONS.cms },
      { label: "Reports", href: "/app/admin/reports", icon: ICONS.reports },
    ],
  },
];

const SALES_NAV: NavGroup[] = [
  {
    id: "work",
    label: "My work",
    icon: ICONS.leads,
    items: [{ label: "My leads", href: "/app/sales", icon: ICONS.leads }],
  },
];

const DRIVER_NAV: NavGroup[] = [
  {
    id: "jobs",
    label: "Jobs",
    icon: ICONS.shipments,
    items: [
      { label: "Today", href: "/app/driver", icon: ICONS.dashboard },
      { label: "My jobs", href: "/app/driver/jobs", icon: ICONS.shipments },
      { label: "History", href: "/app/driver/history", icon: ICONS.reports },
    ],
  },
  {
    id: "account",
    label: "Account",
    icon: ICONS.settings,
    items: [{ label: "Profile", href: "/app/driver/profile", icon: ICONS.settings }],
  },
];

const CUSTOMER_NAV: NavGroup[] = [
  {
    id: "shipments",
    label: "Shipments",
    icon: ICONS.shipments,
    items: [
      { label: "Home", href: "/app/portal", icon: ICONS.dashboard },
      { label: "Track", href: "/app/portal/track", icon: ICONS.track },
      { label: "Book shipment", href: "/app/portal/book", icon: ICONS.book },
      { label: "Pickups", href: "/app/portal/pickups", icon: ICONS.pickups },
    ],
  },
  {
    id: "billing",
    label: "Billing & support",
    icon: ICONS.support,
    items: [
      { label: "Quotes", href: "/app/portal/quotes", icon: ICONS.quotes },
      { label: "Invoices", href: "/app/portal/invoices", icon: ICONS.invoices },
      { label: "Claims", href: "/app/portal/claims", icon: ICONS.claims },
      { label: "Documents", href: "/app/portal/documents", icon: ICONS.documents },
      { label: "Support", href: "/app/portal/support", icon: ICONS.support },
    ],
  },
];

const NAV_BY_ROLE: Record<UserRole, NavGroup[]> = {
  superadmin: SUPERADMIN_NAV,
  admin: ADMIN_NAV,
  sales: SALES_NAV,
  driver: DRIVER_NAV,
  user: CUSTOMER_NAV,
};

export function getNavGroupsForRole(role: UserRole): NavGroup[] {
  return NAV_BY_ROLE[role] ?? [];
}

/** Flat list for active-route detection and legacy callers. */
export function getNavForRole(role: UserRole): NavItem[] {
  return getNavGroupsForRole(role).flatMap((group) => group.items);
}
