# TransGlobe — Logistics Platform

Full-stack logistics platform: public website, customer portal, admin operations, driver app, live tracking, billing, and CMS.

## Quick start (developer)

1. Copy `.env.example` → `.env.local` and add your Supabase keys.
2. Run migrations in `supabase/migrations/` (Supabase CLI or dashboard).
3. `npm install` then `npm run dev` → [http://localhost:3000](http://localhost:3000)
4. Create a superadmin user in Supabase Auth and set `profiles.role = 'superadmin'`.

## Client handover

Give your client **`CLIENT_SETUP.md`** — it explains how to brand the company, configure services, invite staff, and run daily operations **without SQL**.

After first login, the client should:

1. Open **Superadmin → Settings** and set company name, support email/phone, and toggles.
2. Configure **Pricing** (service types + rate cards).
3. Add **Facility locations** for map tracking.
4. Invite team members under **Team**.

Branding from Platform settings updates the website header/footer, login, dashboards, invoices, portal support, and contact page automatically.

## Key routes

| Audience | URL |
|----------|-----|
| Public site | `/` |
| Tracking | `/tracking` |
| Login / portal | `/login` → `/app/portal` |
| Admin ops | `/app/admin` |
| Superadmin | `/app/superadmin` |
| Driver | `/app/driver` |

## Stack

- Next.js 15 (App Router)
- Supabase (Auth, Postgres, Realtime)
- MapLibre / optional Mapbox for live maps
