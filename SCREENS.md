# TransGlobe — Screen inventory (industry standard)

Status: **Done** | **Partial** | **Planned (Phase 2)**

## Public marketing (B2B logistics website)

| Screen | Route | Status |
|--------|-------|--------|
| Home | `/` | Done |
| Services | `/services` | Done |
| Solutions | `/solutions` | Done |
| Pricing | `/pricing` | Done |
| About | `/about` | Done |
| Contact / lead capture | `/contact` | Done |
| Rate estimator | `/estimator` | Done |
| Public tracking | `/tracking` | Done |
| Schedule pickup | `/pickup` | Done |
| Blog (CMS) | `/blog` | Done |
| Resources / case studies | `/resources/*` | Done |

## Auth

| Screen | Route | Status |
|--------|-------|--------|
| Login / signup | `/login` | Done |
| Forgot / reset password | `/login/forgot-password`, `/reset-password` | Done |

## Admin operations (`admin`)

| Screen | Route | Status |
|--------|-------|--------|
| Dashboard (KPIs + recent) | `/app/admin` | Done |
| Shipments list | `/app/admin/shipments` | Done |
| **Shipment 360 detail** | `/app/admin/shipments/[id]` | Done |
| Live tracking search | `/app/admin/tracking` | Done |
| Shipment live tracking | `/app/admin/tracking/[id]` | Done |
| Leads pipeline | `/app/admin/leads` | Done |
| **Lead detail** | `/app/admin/leads/[id]` | Done |
| Quotes list | `/app/admin/quotes` | Done |
| **Quote detail** | `/app/admin/quotes/[id]` | Done |
| Pickups inbox | `/app/admin/pickups` | Done |
| Dispatch board | `/app/admin/dispatch` | Done |
| Drivers roster | `/app/admin/drivers` | Done |
| Invoices list | `/app/admin/invoices` | Done |
| Invoice detail | `/app/admin/invoices/[id]` | Done |
| Claims queue | `/app/admin/claims` | Done |
| **Claim detail** | `/app/admin/claims/[id]` | Done |
| Reports / KPIs | `/app/admin/reports` | Done (enhanced) |
| Facility locations | `/app/admin/settings/locations` | Done |
| **Settings hub** | `/app/admin/settings` | Done |
| **Notifications inbox** | `/app/admin/notifications` | Done |
| **Documents registry** | `/app/admin/documents` | Done |
| CMS | `/app/cms` | Done |

## Customer portal (`user`)

| Screen | Route | Status |
|--------|-------|--------|
| Portal home | `/app/portal` | Done |
| Track list | `/app/portal/track` | Done |
| Live track shipment | `/app/portal/track/[id]` | Done |
| Quotes | `/app/portal/quotes` | Done |
| Book shipment | `/app/portal/book` | Done |
| Pickups + schedule | `/app/portal/pickups` | Done |
| Invoices + detail | `/app/portal/invoices`, `[id]` | Done |
| Claims | `/app/portal/claims` | Done |
| Documents | `/app/portal/documents` | Done (DB list) |
| Support | `/app/portal/support` | Done |
| **Account / profile** | `/app/portal/account` | Done |
| **Notifications** | `/app/portal/notifications` | Done |

## Driver field app

| Screen | Route | Status |
|--------|-------|--------|
| Today / dashboard | `/app/driver` | Done |
| Active jobs | `/app/driver/jobs` | Done |
| Job history | `/app/driver/history` | Done |
| Profile + availability | `/app/driver/profile` | Done |

## Superadmin platform

| Screen | Route | Status |
|--------|-------|--------|
| Overview | `/app/superadmin` | Done |
| Organization | `/app/superadmin/organization` | Done |
| Team directory + member detail | `/app/superadmin/users`, `[id]` | Done |
| Customers + customer 360 | `/app/superadmin/customers`, `[id]` | Done |
| Rate cards & service types | `/app/superadmin/rates` | Done |
| Audit logs | `/app/superadmin/audit` | Done |
| Settings | `/app/superadmin/settings` | Done |

## Phase 2 (not in this build)

- Stripe / online payments
- Supabase Storage uploads (BOL, POD photos)
- Email/SMS automation templates
- Route optimization / multi-stop maps
- API keys & webhooks settings
- Customer self-service rate contracts
