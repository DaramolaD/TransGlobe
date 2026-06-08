# Role-Based Access Control (RBAC) — Implementation Plan

Flexible permissions for TransGlobe / SwiftCargo: Super Admin controls everything; roles and users get granular module access (view / create / edit / delete / export / assign).

**Status:** Planning only — do not implement until approved.  
**Stack:** Next.js 15 + Supabase (Postgres + RLS + Auth)  
**Related docs:** `DASHBOARD_PRD.md`, `supabase/migrations/`

---

## 1. Executive summary

Today the app uses a **fixed PostgreSQL enum** (`user_role`) and hardcoded checks in RLS, middleware, and `lib/auth/roles.ts`. That is appropriate for MVP but breaks down when:

- Two admins need different access (e.g. billing-only vs operations-only)
- New team types appear (Content, Support, Dispatch coordinator)
- Super Admin must toggle capabilities without code deploys

This plan introduces a **data-driven RBAC layer** while keeping **Super Admin as full override**. Implementation is phased so the product can ship incrementally without a big-bang rewrite.

---

## 2. Goals and non-goals

### Goals

| Goal | Description |
|------|-------------|
| **Super Admin supremacy** | Full access to all modules, settings, roles, and users |
| **Configurable roles** | Create/edit roles (Admin, Sales, Content, Support, custom) |
| **Granular permissions** | Module + action level (`leads.read`, `invoices.mark_paid`) |
| **Per-user overrides** | Optional exceptions on top of role (grant/deny) |
| **Hierarchy** | Super Admin → Admin → team roles (inheritance or templates) |
| **Defense in depth** | Enforce at DB (RLS), server (actions), and UI (visibility) |
| **Auditability** | Log role/permission changes in `audit_logs` |
| **Single-tenant first** | Scoped to `organization_id`; multi-tenant ready |

### Non-goals (initial phases)

- Customer (`user`) and `driver` roles using the same RBAC UI (keep simpler fixed rules longer)
- External IdP / SAML / SCIM (future)
- Row-level ABAC beyond assignment (e.g. “only leads in region X”) — Phase 4+
- Real-time permission sync across tabs without refresh (session reload is enough)

---

## 3. Role hierarchy & collapsible nav (interim — before full RBAC)

This section is the **simpler model** to ship now: fixed roles with **inheritance**, grouped sidebar, and middleware aligned to “higher role can do what lower roles can do.” Full permission keys (§5+) come later.

### 3.1 Inheritance tree

```
Super Admin
├── Platform-only (team, rates, audit, org settings)
├── Admin capabilities (operations, finance, CMS, reports)
├── Sales capabilities (assigned leads, quotes read)
└── Driver areas (read-only / support access via admin routes)

Admin
├── Sales capabilities (all leads, assign, export)
├── Operations (shipments, dispatch, tracking, drivers)
├── Finance (invoices, claims)
└── Content (CMS, reports)

Sales          →  My leads only
Driver         →  Jobs + GPS (fixed)
Customer       →  Portal only (separate tree, not inherited)
```

**Rule:** `roleIncludes(actor, target)` — Super Admin includes Admin, Sales, Driver; Admin includes Sales. Implemented in `lib/auth/role-hierarchy.ts`.

**Enforcement today (keep until Phase 2 RBAC):**

| Layer | Super Admin | Admin |
|-------|-------------|-------|
| Middleware prefixes | `/app/superadmin`, `/app/admin`, `/app/cms`, `/app/sales`, `/app/driver`, … | `/app/admin`, `/app/cms` |
| RLS | `current_user_role()` + staff checks | Same staff paths |
| Helpers | `isStaff()`, `canManageLeads()`, … | Admin subset |
| Nav | All groups below | Ops + sales + finance groups |

When adding a **new team role** (e.g. Content, Support), attach it under **Admin** in the hierarchy and add a nav group — Super Admin automatically gets it via inheritance.

### 3.2 Collapsible sidebar groups

Nav is defined in **`lib/dashboard/nav-config.ts`** and rendered in **`DashboardShell.tsx`**:

| Role | Groups | Notes |
|------|--------|-------|
| **Super Admin** | Platform · Operations · Sales & finance · Content & reports · Field (driver) | Platform = superadmin-only URLs; other groups mirror Admin + Sales + Driver entry points |
| **Admin** | Overview · Sales · Operations · Finance · Content & reports | Everything the sales team uses, plus ops |
| **Sales** | My work | Single group (flat when one item) |
| **Driver** | Jobs · Account | |
| **Customer** | Shipments · Billing & support | Portal |

**UX rules:**

- Groups with **2+ links** are **collapsible**; chevron rotates when open.
- Group **auto-expands** when the current route matches any child link.
- Groups with **one link** render as a normal sidebar button (no extra click).
- Sidebar still **collapses to icons** via the existing rail trigger.

### 3.3 Mapping hierarchy → future permissions

When RBAC ships, each nav item gets a `permission` key; visibility = `hasPermission(key) || platform.superadmin`. Group labels stay stable; only the filter function changes.

| Nav group | Example permission prefix |
|-----------|---------------------------|
| Platform | `platform.*` |
| Operations | `shipments.*`, `dispatch.*`, `tracking.*` |
| Sales & finance | `leads.*`, `quotes.*`, `invoices.*`, `claims.*` |
| Content & reports | `cms.*`, `reports.read` |
| Field | `driver.*` (Super Admin preview only) |

### 3.4 Implementation checklist (this interim phase)

- [x] `lib/auth/role-hierarchy.ts` — `roleIncludes()`, `inheritedRoles()`
- [x] `lib/dashboard/nav-config.ts` — grouped nav per role
- [x] `DashboardShell.tsx` — collapsible groups
- [ ] Align server actions to use `roleIncludes()` where duplicated checks exist
- [ ] Super Admin middleware: ensure `/app/driver` allowed (already in `allowedPrefixes`)
- [ ] Document in `DEV_CREDENTIALS.md` which accounts see which groups

---

## 4. Current state (baseline)

### Roles today

| Role | Route prefix | Notes |
|------|--------------|-------|
| `superadmin` | `/app/superadmin` + all admin areas | Platform config |
| `admin` | `/app/admin` | Operations |
| `sales` | `/app/sales` | Assigned leads only (RLS) |
| `driver` | `/app/driver` | Jobs + GPS |
| `user` | `/app/portal` | Customer portal |

### Where permissions live today

| Layer | Mechanism | Example |
|-------|-----------|---------|
| **Database** | `profiles.role` enum + `current_user_role()` | RLS on `leads`, `invoices`, … |
| **Middleware** | `allowedPrefixes` per role | `lib/supabase/middleware.ts` |
| **App helpers** | `isStaff()`, `canManageLeads()` | `lib/auth/roles.ts` |
| **Server actions** | Ad-hoc role checks | `lib/actions/*.ts` |
| **UI** | Nav from `getNavForRole()` | `DashboardShell.tsx` |

### Pain points

1. Adding a role requires **enum migration** (e.g. `sales` needed split migration).
2. **Same role ≠ same access** is impossible without new roles.
3. RLS and app checks can **drift** (must update both).
4. No UI for Super Admin to manage permissions.

---

## 4. Target architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Super Admin UI: Roles & Permissions (/app/superadmin/rbac)  │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   roles table      permissions catalog    profile_roles
   role_permissions  (stable keys)         user_overrides (optional)
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
              effective_permissions(user_id, org_id)
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Supabase RLS        Server actions       UI (nav, buttons)
   has_permission()    requirePermission()  usePermissions()
```

### Design principles

1. **Permission keys are stable strings** — never check role names in business logic.
2. **Super Admin bypass** — `platform.superadmin` or `*` skips normal checks.
3. **Organization scoped** — all roles/assignments tied to `organization_id`.
4. **RLS is authoritative** — UI hiding is UX only.
5. **Default-deny** — no permission = no access.
6. **Templates over chaos** — ship 4–6 built-in role templates; custom roles in Phase 3.

---

## 5. Permission catalog (draft)

Format: `{module}.{action}`

### Platform

| Key | Description |
|-----|-------------|
| `platform.superadmin` | Bypass all checks (Super Admin only) |
| `platform.settings.read` | View platform settings |
| `platform.settings.write` | Edit org branding, tracking rules, billing config |
| `platform.users.read` | View team directory |
| `platform.users.write` | Change roles, activate/deactivate users |
| `platform.rbac.read` | View roles & permissions |
| `platform.rbac.write` | Create/edit roles, assign permissions |
| `platform.audit.read` | View audit logs |
| `platform.rates.read` / `.write` | Rate cards |

### Operations

| Key | Description |
|-----|-------------|
| `leads.read` | View leads (all or assigned — see scope) |
| `leads.read.all` | View all org leads |
| `leads.read.assigned` | View only assigned leads |
| `leads.create` | Create lead manually |
| `leads.write` | Edit lead fields |
| `leads.assign` | Assign/reassign leads |
| `leads.export` | CSV export |
| `leads.delete` | Delete/archive leads |
| `quotes.read` / `.write` | Quotes pipeline |
| `shipments.read` / `.write` | Shipments list & status |
| `dispatch.read` / `.write` | Driver assignment |
| `drivers.read` / `.write` | Driver roster |
| `tracking.read` | Live tracking map |
| `pickups.read` / `.write` | Pickup scheduling |

### Billing

| Key | Description |
|-----|-------------|
| `invoices.read` | View invoices |
| `invoices.create` | Create/send invoices |
| `invoices.write` | Edit draft invoices |
| `invoices.mark_paid` | Confirm payment |
| `invoices.cancel` | Cancel invoices |
| `claims.read` / `.write` | Claims management |

### Content & marketing

| Key | Description |
|-----|-------------|
| `cms.read` / `.write` | Blog/CMS posts |
| `leads.category.content` | Manage content/marketing lead category |

### Portal (usually `user` role — fixed)

| Key | Description |
|-----|-------------|
| `portal.self.read` | Own shipments, invoices, quotes |

### Driver (usually fixed)

| Key | Description |
|-----|-------------|
| `driver.jobs.read` / `.write` | Assigned jobs, status, GPS |

---

## 6. Default role templates (recommended)

These map roughly to today’s enum roles and become **editable templates** in RBAC UI.

| Template | Inherits | Typical permissions |
|----------|----------|-------------------|
| **Super Admin** | — | `platform.superadmin` |
| **Operations Admin** | — | Full ops + billing except `platform.rbac.write`, `platform.settings.write` (configurable) |
| **Sales Rep** | — | `leads.read.assigned`, `leads.write`, contact logs; no invoices |
| **Billing Admin** | — | `invoices.*`, read shipments; no dispatch |
| **Content Manager** | — | `cms.*`, `leads.read.all`, content category |
| **Support** | — | Read shipments/invoices, limited claims |
| **Driver** | — | Fixed driver set (minimal RBAC UI) |
| **Customer** | — | Portal self-service only |

**Note:** Not every admin needs identical permissions — two users both labeled “Admin” can reference different **role records** (e.g. `Admin — Operations` vs `Admin — Billing`).

---

## 7. Data model (proposed)

### New tables

```sql
-- Stable permission definitions (seeded, rarely changes)
CREATE TABLE permissions (
  key TEXT PRIMARY KEY,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- Roles per organization (system templates + custom)
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  slug TEXT NOT NULL,                    -- e.g. 'sales', 'billing-admin'
  name TEXT NOT NULL,                      -- display name
  description TEXT,
  is_system BOOLEAN DEFAULT false,         -- seeded templates
  parent_role_id UUID REFERENCES roles(id), -- optional inheritance
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (organization_id, slug)
);

CREATE TABLE role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_key TEXT REFERENCES permissions(key) ON DELETE CASCADE,
  granted BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (role_id, permission_key)
);

-- User ↔ role (replaces or supplements profiles.role)
CREATE TABLE profile_role_assignments (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  assigned_by UUID REFERENCES profiles(id),
  PRIMARY KEY (profile_id, role_id)
);

-- Optional per-user overrides
CREATE TABLE profile_permission_overrides (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  permission_key TEXT REFERENCES permissions(key),
  granted BOOLEAN NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (profile_id, permission_key)
);
```

### Migration from `profiles.role` enum

**Phase 2 strategy (recommended):**

1. Seed `permissions` + system `roles` from current behavior.
2. Add `profile_role_assignments` and backfill from `profiles.role`.
3. Keep `profiles.role` as **primary role shortcut** during transition (denormalized cache).
4. Gradually replace `current_user_role()` in RLS with `has_permission(auth.uid(), 'leads.read')`.
5. Deprecate enum in Phase 4 once all paths migrated.

### Effective permissions function

```sql
-- Pseudocode
CREATE FUNCTION effective_permissions(p_user_id UUID, p_org_id UUID)
RETURNS SETOF TEXT AS $$
  -- 1. If platform.superadmin → return all keys
  -- 2. Union permissions from all assigned roles (+ inheritance)
  -- 3. Apply profile_permission_overrides (deny wins over grant)
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

Expose to RLS:

```sql
CREATE FUNCTION has_permission(p_key TEXT)
RETURNS BOOLEAN AS $$
  SELECT p_key = ANY(
    ARRAY(SELECT effective_permissions(auth.uid(), current_org_id()))
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

---

## 8. Enforcement layers

### 8.1 Database (RLS) — source of truth

Replace patterns like:

```sql
current_user_role() IN ('superadmin', 'admin')
```

With:

```sql
has_permission('leads.read.all')
OR (has_permission('leads.read.assigned') AND assigned_to = auth.uid())
```

**Module migration order:** leads → quotes → shipments → invoices → cms → platform settings.

### 8.2 Server actions — `lib/auth/permissions.ts`

```typescript
export async function requirePermission(key: PermissionKey) {
  const profile = await requireProfile();
  const allowed = await userHasPermission(profile.id, key);
  if (!allowed) return { error: "Forbidden" as const };
  return { profile };
}
```

Replace `isStaff()`, `canManageLeads()`, etc. with permission checks over time.

### 8.3 Middleware — route → permission map

```typescript
const ROUTE_PERMISSIONS: { prefix: string; permission: PermissionKey }[] = [
  { prefix: "/app/admin/leads", permission: "leads.read" },
  { prefix: "/app/admin/invoices", permission: "invoices.read" },
  { prefix: "/app/superadmin/rbac", permission: "platform.rbac.read" },
  // ...
];
```

Super Admin with `platform.superadmin` passes all route checks.

### 8.4 UI — navigation and buttons

- **`getNavForPermissions(permissions[])`** replaces `getNavForRole()`.
- Wrap destructive actions: `<Can permission="invoices.mark_paid">…</Can>`.
- Settings pages hide tabs user cannot access.

Load permissions once per request in `app/app/layout.tsx` (server) and pass to `DashboardShell`.

---

## 9. Super Admin UI (planned screens)

### `/app/superadmin/rbac`

| Screen | Features |
|--------|----------|
| **Roles list** | System templates + custom roles; duplicate role |
| **Role editor** | Name, description, parent role, permission matrix (grouped by module) |
| **Permission matrix** | Checkboxes: Read / Create / Edit / Delete / Export / Assign per module |
| **User assignments** | Extend existing Users page — assign multiple roles, show effective permissions |
| **User overrides** | Advanced tab — grant/deny single permissions with reason |
| **Preview as user** | Optional Phase 3 — see nav as another user |

### UX patterns

- Group permissions by module (Leads, Billing, Platform).
- “Select all in module” / “Operations preset” shortcuts.
- Warn when removing own `platform.rbac.write`.
- Confirm before deleting custom roles with assigned users.

---

## 10. Hierarchy model

```
Super Admin (platform.superadmin)
    │
    ├── Admin templates (Operations, Billing, Full Admin)
    │       │
    │       ├── Sales Rep
    │       ├── Content Manager
    │       └── Support
    │
    ├── Driver (fixed)
    └── Customer (fixed)
```

**Inheritance options:**

| Approach | Pros | Cons |
|----------|------|------|
| **A. Flat roles** (no inheritance) | Simple, auditable | Duplicate permission toggles |
| **B. Parent role inherits** | DRY for Admin → Sales | Harder to debug effective set |
| **C. Permission presets only** | Best UX for Super Admin | Not true OOP inheritance |

**Recommendation:** Start with **A (flat)** for system templates; add **parent_role_id** in Phase 3 if needed.

---

## 11. Scoping rules (assignment-aware)

Some permissions need **data scope**, not just module access:

| Permission | Scope rule |
|------------|------------|
| `leads.read.all` | All leads in org |
| `leads.read.assigned` | `leads.assigned_to = auth.uid()` |
| `shipments.read` | All for admin; assigned for driver |
| `invoices.read` | All for staff; own for customer (`customer_id`) |

Implement scope in **RLS policies**, not only in app filters.

---

## 12. Audit & compliance

Log to `audit_logs`:

| Action | Entity |
|--------|--------|
| `role.created` / `role.updated` / `role.deleted` | `role` |
| `role.permissions_updated` | `role` |
| `user.roles_assigned` | `user` |
| `user.permission_override` | `user` |

Include payload: `{ permission_keys: [...], granted: true/false, actor_id }`.

---

## 13. Implementation phases

### Phase 0 — Planning (now)

- [x] Draft this document
- [ ] Review permission matrix with stakeholders
- [ ] Sign off on role templates for v1

### Phase 1 — Foundation (≈ 1 week)

- Migration: `permissions`, `roles`, `role_permissions`, `profile_role_assignments`
- Seed permissions catalog + system role templates matching **current** behavior
- Backfill assignments from `profiles.role`
- `lib/auth/permissions.ts` + `userHasPermission()` server helper
- Super Admin bypass
- **No RLS changes yet** — parallel read-only effective permission API

### Phase 2 — First module + UI (≈ 1–2 weeks)

- Super Admin **Roles & Permissions** UI (read/write roles, assign to users)
- Migrate **Leads** module end-to-end (RLS + actions + nav + leads CRM)
- Replace `canManageLeads()` / sales RLS with permission keys
- Audit logging for RBAC changes

### Phase 3 — Rollout remaining modules (≈ 2–3 weeks)

Migrate in order:

1. Quotes  
2. Shipments / dispatch / tracking  
3. Invoices / claims  
4. CMS  
5. Platform settings / rates / users / audit  

Each module: RLS policies → server actions → UI nav/buttons → remove old role helper usage.

### Phase 4 — Advanced (optional)

- Custom roles (non-template)
- Per-user permission overrides UI
- `parent_role_id` inheritance
- Deprecate `user_role` enum on `profiles`
- Multi-tenant: roles per org fully isolated (already designed for this)

---

## 14. Module × action matrix (checklist for sign-off)

Use this table when reviewing with stakeholders. Mark **R/C/E/D/X/A** = Read, Create, Edit, Delete, Export, Assign.

| Module | Super Admin | Ops Admin | Billing Admin | Sales | Content | Support | Driver | Customer |
|--------|:-----------:|:---------:|:-------------:|:-----:|:-------:|:-------:|:------:|:--------:|
| Platform settings | R/E | — | — | — | — | — | — | — |
| RBAC / roles | R/E | — | — | — | — | — | — | — |
| Team users | R/E | R/E* | — | — | — | — | — | — |
| Audit logs | R | R* | — | — | — | — | — | — |
| Rate cards | R/E | R/E* | — | — | — | — | — | — |
| Leads | All | All | — | R/E assigned | R* | R* | — | — |
| Quotes | All | All | R | — | — | R | — | R own |
| Shipments | All | All | R | — | — | R | R/E assigned | R own |
| Dispatch | All | All | — | — | — | — | — | — |
| Invoices | All | All | All | — | — | R | — | R own |
| Claims | All | All | R/E | — | — | R/E | — | R own |
| CMS | All | R/E | — | — | All | — | — | — |
| Portal | — | — | — | — | — | — | — | All |
| Driver app | — | — | — | — | — | — | All | — |

`*` = configurable in template; not all admins get by default.

---

## 15. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| RLS / app drift | Single permission catalog; module migration checklist |
| Locking out all admins | Keep break-glass Super Admin; DB seed script restores access |
| Performance (permission lookup) | Cache effective set in JWT custom claim or session; refresh on role change |
| Enum migration pain | Keep `profiles.role` as cache during transition |
| Over-engineering | Phase 2 only Leads + 4 templates; defer custom roles |
| Supabase JWT size limits | Store permission hash or role IDs in JWT, full set in DB |

---

## 16. Testing strategy

| Layer | Tests |
|-------|-------|
| **Unit** | `effectivePermissions()` merge logic, deny-over-grant overrides |
| **Integration** | Server actions return 403 without permission |
| **RLS** | SQL tests as different users (supabase test helpers) |
| **E2E** | Sales user cannot open `/app/admin/invoices`; admin with billing role can |

Test users: use `seed-dev-users.sql` pattern + dedicated RBAC test accounts.

---

## 17. Open questions (decide before Phase 1)

1. **Multiple roles per user?** Recommended yes (`profile_role_assignments`); effective set = union.
2. **Deny overrides?** Recommended yes for exceptions; rare use.
3. **Can Admin create roles?** Recommended no — only `platform.rbac.write` (Super Admin).
4. **Driver / Customer in RBAC UI?** Recommended no for Phase 2–3; keep fixed.
5. **Rename `superadmin` enum value?** Keep for backward compatibility until Phase 4.

---

## 18. Success criteria

Phase 2 complete when:

- Super Admin can edit **Sales** template permissions in UI without deploy
- Two **Admin** users can have different effective access (e.g. billing vs ops)
- Leads module fully enforced in RLS + actions + UI
- All RBAC changes appear in audit log
- Existing dev accounts (`superadmin@`, `admin@`, `sales@`) behave as today with default templates

---

## 19. File / code touch list (when implementing)

| Area | Files / locations |
|------|-------------------|
| Migrations | `supabase/migrations/YYYYMMDD_rbac.sql` |
| Seeds | `supabase/seed-rbac.sql` |
| Auth | `lib/auth/permissions.ts`, deprecate gradual `lib/auth/roles.ts` |
| Session | `lib/auth/session.ts` — load effective permissions |
| Middleware | `lib/supabase/middleware.ts` |
| RLS | All policies in `supabase/migrations/*` |
| UI | `app/app/superadmin/rbac/`, `DashboardShell.tsx`, `<Can />` component |
| Actions | Every `lib/actions/*.ts` with role checks |
| Types | `lib/types/database.ts`, `PermissionKey` union |

---

## 20. References in repo (current)

- Role helpers: `lib/auth/roles.ts`
- Middleware routes: `lib/supabase/middleware.ts`
- User role UI: `app/app/superadmin/users/`
- RLS baseline: `supabase/migrations/20250524000000_initial_platform.sql`
- Lead assignment scope ( precedent ): `supabase/migrations/20250604000001_lead_crm_invoice_proof.sql`
- Audit pattern: `lib/audit/log.ts`, `lib/audit/action-labels.ts`

---

*Drafted for TransGlobe — planning document only. Implement when approved.*
