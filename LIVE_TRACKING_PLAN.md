# Live Tracking — Phase 1 Plan (SwiftCargo / TransGlobe)

Uber-style visibility using **free-tier-friendly** stack: **PostGIS + Supabase Realtime + MapLibre** (optional Mapbox token).

---

## 1. Goals

| Goal | Phase 1 |
|------|---------|
| Driver shares GPS on active jobs | Yes — PWA geolocation + offline queue |
| Customer sees live dot + trail | Yes — portal + public `/tracking` |
| Works on weak network | Yes — IndexedDB queue, batch upload, last-known position |
| Milestone timeline (existing) | Yes — `tracking_events` unchanged |
| Geofence auto-status | Phase 2 |
| Carrier EDI (ocean/air) | Phase 3 |
| Native driver SDK (Hypertrack) | Phase 2 if PWA GPS insufficient |

---

## 2. Architecture

```
Driver phone (GPS watch)
    → throttle ~12s
    → offline? IndexedDB queue : batch upload
    → Supabase shipment_locations (PostGIS)
    → trigger updates shipments.last_*
    → Realtime broadcast
    → Portal / Public map (MapLibre + trail)
```

**Free components**

| Piece | Service | Cost |
|-------|---------|------|
| Database + geo | Supabase Postgres + PostGIS | Free tier |
| Live updates | Supabase Realtime | Free tier |
| Maps | MapLibre demo tiles | Free |
| Optional maps | Mapbox (50k loads/mo) | Free tier with token |
| Offline queue | Browser IndexedDB | Free |

---

## 3. Data model (implemented)

### `shipment_locations`

- `latitude`, `longitude`, `accuracy_m`, `heading`, `speed_mps`
- `recorded_at` (device time), `received_at` (server time)
- `client_id` — idempotent dedup for offline replay
- `is_public` — hide from anon if false (Phase 2 privacy)
- `geom` — PostGIS geography for geofencing (Phase 2)

### `shipments` (denormalized)

- `last_latitude`, `last_longitude`, `last_location_at`
- `live_tracking_enabled` — admin can disable map per shipment

### Existing `tracking_events`

- Business milestones (picked up, customs, delivered)
- **Not replaced** by GPS — both show in UI

---

## 4. Security (RLS)

| Actor | Read locations | Write locations |
|-------|----------------|-----------------|
| Anonymous | Public points, last 7 days, live enabled | No |
| Customer | Own shipments | No |
| Driver | Assigned shipments | Active assignment only |
| Admin | All in org | Yes (testing) |

---

## 5. User flows

### A. Last-mile (Uber-like) — primary

1. Customer books shipment
2. Admin invoice → paid → **dispatch driver**
3. Driver opens **Today's jobs** → **Start sharing location**
4. Customer opens **Portal → Track → Live map** or public link
5. Map updates via **Realtime**; if offline, sees last position + “Updated X ago”

### B. Pre-dispatch (no GPS yet)

1. Shipment `booked`, no driver
2. Public/portal track shows **milestones only** (no trail)
3. Message: “Live map when driver is en route”

### C. Weak / offline network

| Situation | Behavior |
|-----------|----------|
| Driver offline | Points queued in IndexedDB |
| Driver back online | Queue flushes in batches |
| Customer offline | Last fetched position + stale banner |
| Realtime disconnect | Map frozen; poll via refresh (Phase 2: 30s poll) |

### D. Line-haul / hub-based (low GPS frequency)

- Driver shares GPS only at hubs (manual start/stop) — same UI
- Phase 2: reduce upload interval config per `service_type`
- Phase 3: merge carrier scan events into one timeline

### E. International / multimodal

- Phone GPS ends at port; milestones from `tracking_events` / carrier API
- Phase 3: project44/FourKites feed as non-GPS events on map (port markers)

### F. Privacy / compliance

- `live_tracking_enabled = false` → milestones only
- Phase 2: `is_public = false` for internal legs
- Phase 2: retention job (delete points > 90 days)

---

## 6. Edge cases checklist

| Case | Phase 1 handling | Phase 2+ |
|------|------------------|----------|
| GPS permission denied | Toast; no upload | In-app instructions |
| Duplicate offline points | `client_id` unique constraint | — |
| Driver not assigned | Insert blocked by RLS | — |
| Wrong shipment ID | RLS blocks | — |
| Battery drain | `enableHighAccuracy: false`, 12s throttle | Adaptive interval |
| Browser tab backgrounded | Best-effort (PWA limits) | Native SDK |
| No PostGIS extension | Migration fails — enable in Supabase dashboard | — |
| Map load failure | Show timeline only | Fallback tile server |
| Delivered / job closed | Driver should stop sharing (manual) | Auto-stop on status |
| Multiple drivers | One assignment per shipment row | Split legs |

---

## 7. Setup (required)

### 7.1 Run migration

In **Supabase → SQL Editor**, run:

`supabase/migrations/20250527000000_live_tracking.sql`

Enable **PostGIS** under **Database → Extensions** if prompted.

### 7.2 Environment variables

```env
# Already required
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional — Mapbox streets (otherwise MapLibre free demo tiles)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

### 7.3 Realtime

Migration adds `shipment_locations` to `supabase_realtime` publication.  
Confirm in **Database → Publications → supabase_realtime**.

### 7.4 Test flow

1. Superadmin → **Seed demo tracking** (`SC001234567`)
2. Create/login driver, assign to shipment (paid invoice first)
3. Driver → **Start sharing location**
4. Open `/tracking?number=SC001234567` or portal live map
5. Confirm trail + “Live” badge when Realtime connected

---

## 8. Files added (Phase 1)

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20250527000000_live_tracking.sql` |
| Types | `lib/types/tracking.ts` |
| Public fetch | `lib/tracking/public.ts`, `app/api/tracking/[number]/route.ts` |
| Actions | `lib/actions/locations.ts` |
| Offline | `lib/tracking/offline-queue.ts`, `lib/tracking/throttle.ts` |
| Map | `lib/tracking/map-style.ts`, `components/tracking/LiveMap.tsx` |
| UI | `LiveTrackingPanel`, `DriverLocationPublisher`, `PublicTrackingSearch` |
| Driver | `app/app/driver/DriverJobCard.tsx` |
| Portal | `app/app/portal/track/[id]/page.tsx` |
| Public | `app/(site)/tracking/` |

---

## 9. Phase 2 backlog

- [ ] Geofence triggers (hub arrival → auto `tracking_event`)
- [ ] Admin live dispatch map (all drivers)
- [ ] Polling fallback when Realtime unavailable
- [ ] `service_type` upload profiles (last-mile vs line-haul)
- [ ] Stop GPS automatically on `delivered`
- [ ] Hypertrack/Radar SDK if PWA insufficient
- [ ] ETA via Mapbox Directions API

## 10. Phase 3 backlog

- [ ] Carrier integrations (project44 / FourKites)
- [ ] IoT container trackers (Tive)
- [ ] Customer push notifications on geofence
- [ ] Analytics heatmaps (PostGIS aggregates)

---

## 10. Success metrics

- Median location upload latency &lt; 30s
- Offline queue drain success rate &gt; 99% after reconnect
- Public track p95 load &lt; 3s (map + API)
- Zero RLS violations in logs for location inserts
