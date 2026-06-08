# TransGlobe / SwiftCargo Platform PRD

Single-tenant logistics platform with role-based dashboards, CMS, and a path to multi-tenant expansion.

## Roles

| Role | Route prefix | Purpose |
|------|----------------|---------|
| **Superadmin** | `/app/superadmin` | Platform config, users, rates, audit |
| **Admin** | `/app/admin` | Operations, leads, dispatch, billing |
| **Driver** | `/app/driver` | Field jobs, status updates, POD |
| **User** | `/app/portal` | Customer self-service |

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. Copy `.env.example` → `.env.local` and fill in keys.
3. Run SQL in `supabase/migrations/` via Supabase SQL Editor (in order).
4. Register at `/login`, then promote your user to `superadmin` in SQL:

```sql
UPDATE profiles SET role = 'superadmin' WHERE email = 'your@email.com';
```

5. Optional: set `SUPABASE_SERVICE_ROLE_KEY` for public forms and role promotion UI.
6. `npm run dev` → `/login` → `/app`

## Customer journey (implemented)

1. **Lead** — Contact form → `leads` table → Admin leads inbox  
2. **Quote** — Estimator → `quotes` table → Admin quotes  
3. **Register** — `/login` signup → `profiles` (role: user)  
4. **Book** — Portal book shipment → `shipments` + tracking events  
5. **Pickup** — `/pickup` form → `pickup_requests`  
6. **Dispatch** — Admin assigns driver → `assignments`  
7. **Execute** — Driver updates status → `tracking_events`  
8. **Track** — Public `/tracking` + portal track (DB-backed when seeded)  
9. **Claims** — Portal claims → `claims`  
10. **CMS** — `/app/cms` → published posts on `/blog`  
11. **Billing** — Deliver shipment → auto draft invoice (DB trigger) → Admin send → Client view/pay ref → Admin mark paid  

### Billing flow (flexible)

1. Admin creates invoice **anytime** (booked, in transit, or after delivery) from **Invoices**, **Shipments**, or **Dispatch**  
2. **Send** to customer → customer pays / submits reference at `/app/portal/invoices`  
3. Admin **Mark paid** → dispatch unlocked for that shipment  
4. **Dispatch** → assign driver only when invoice status is **paid**  
5. Optional fallback: if no invoice exists when marked **delivered**, DB trigger still creates a draft  

Run migration `supabase/migrations/20250526000000_invoice_billing.sql` in Supabase SQL Editor.

12. **Live tracking (Phase 1)** — Driver GPS → `shipment_locations` → Realtime → Map on `/tracking` + `/app/portal/track/[id]`  
    See `LIVE_TRACKING_PLAN.md`. Run `supabase/migrations/20250527000000_live_tracking.sql`.

## Database

All business tables include `organization_id` (default slug: `default`) for future multi-tenant support.

## Key routes

- Marketing: `/`, `/services`, `/tracking`, `/pickup`, `/estimator`, `/blog`
- Auth: `/login`
- App shell: `/app` (redirects by role)
- CMS: `/app/cms`

## Phase 2 (not yet built)

- Stripe Checkout (online card pay), Supabase Storage documents, SMS/email automation, Swiftcargo API sync, route maps.
