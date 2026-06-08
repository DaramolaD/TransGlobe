"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PublicTrackingPayload } from "@/lib/types/tracking";
import { buildMapWaypoints, routeLineFromWaypoints } from "@/lib/tracking/map-route";
import { normalizeTrackingEvent } from "@/lib/tracking/queries";
import { LiveMap, type MapCoordinate } from "./LiveMap";
import { DeliveryTrackingReceipt } from "./DeliveryTrackingReceipt";
import { formatDistanceToNow } from "date-fns";
import { Radio, Route, WifiOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

function toCoords(
  lat: number | null | undefined,
  lng: number | null | undefined
): MapCoordinate | null {
  if (lat == null || lng == null) return null;
  return { lat, lng };
}

export function LiveTrackingPanel({
  initial,
  subscribeRealtime = true,
}: {
  initial: PublicTrackingPayload;
  subscribeRealtime?: boolean;
}) {
  const [payload, setPayload] = useState(initial);
  const [live, setLive] = useState(false);
  const [offline, setOffline] = useState(false);
  const [showRoutePath, setShowRoutePath] = useState(true);
  const [animateRoute, setAnimateRoute] = useState(false);

  const shipment = payload.shipment;

  const waypoints = useMemo(
    () => buildMapWaypoints(payload, shipment.status),
    [payload, shipment.status]
  );

  const gpsTrail: MapCoordinate[] = useMemo(() => {
    const fromGps = payload.locations.map((l) => ({
      lat: l.latitude,
      lng: l.longitude,
    }));
    if (fromGps.length) return fromGps;
    const last = toCoords(shipment.last_latitude, shipment.last_longitude);
    return last ? [last] : [];
  }, [payload.locations, shipment.last_latitude, shipment.last_longitude]);

  const milestoneTrail = useMemo(
    () =>
      showRoutePath
        ? routeLineFromWaypoints(waypoints, {
            showMilestones: true,
            showGps: false,
          })
        : [],
    [waypoints, showRoutePath]
  );

  const gpsLine = useMemo(
    () =>
      showRoutePath
        ? routeLineFromWaypoints(waypoints, {
            showMilestones: false,
            showGps: true,
          })
        : gpsTrail,
    [waypoints, showRoutePath, gpsTrail]
  );

  const current =
    gpsTrail[gpsTrail.length - 1] ??
    (waypoints.length
      ? { lat: waypoints[waypoints.length - 1].lat, lng: waypoints[waypoints.length - 1].lng }
      : null);

  const lastUpdateLabel = shipment.last_location_at
    ? formatDistanceToNow(new Date(shipment.last_location_at), { addSuffix: true })
    : "No GPS yet";

  const mapModeLabel = shipment.map_visibility_mode.replace(/_/g, " ");

  useEffect(() => {
    setPayload(initial);
  }, [initial]);

  useEffect(() => {
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    setOffline(typeof navigator !== "undefined" && !navigator.onLine);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    if (!subscribeRealtime) return;

    const supabase = createClient();
    const channel = supabase.channel(`tracking:${shipment.id}`);

    if (shipment.live_tracking_enabled) {
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shipment_locations",
          filter: `shipment_id=eq.${shipment.id}`,
        },
        (change) => {
          const row = change.new as {
            id: string;
            shipment_id: string;
            latitude: number;
            longitude: number;
            recorded_at: string;
            accuracy_m?: number | null;
            heading?: number | null;
            speed_mps?: number | null;
            driver_id?: string | null;
            received_at?: string;
            source?: string;
          };
          setLive(true);
          setPayload((prev) => ({
            ...prev,
            shipment: {
              ...prev.shipment,
              last_latitude: row.latitude,
              last_longitude: row.longitude,
              last_location_at: row.recorded_at,
            },
            locations: [
              ...prev.locations,
              {
                id: row.id,
                shipment_id: row.shipment_id,
                driver_id: row.driver_id ?? null,
                latitude: row.latitude,
                longitude: row.longitude,
                accuracy_m: row.accuracy_m ?? null,
                heading: row.heading ?? null,
                speed_mps: row.speed_mps ?? null,
                recorded_at: row.recorded_at,
                received_at: row.received_at ?? new Date().toISOString(),
                source: row.source ?? "driver_gps",
                client_id: "",
              },
            ],
          }));
        }
      );
    }

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "tracking_events",
        filter: `shipment_id=eq.${shipment.id}`,
      },
      (change) => {
        const raw = change.new as Record<string, unknown>;
        if (raw.is_public === false) return;
        setLive(true);
        setPayload((prev) => {
          let event = normalizeTrackingEvent(raw);
          const facId = raw.facility_location_id as string | null;
          if (facId && !event.facility) {
            const fac = prev.facilities.find((f) => f.id === facId);
            if (fac) {
              event = {
                ...event,
                latitude: event.latitude ?? fac.latitude,
                longitude: event.longitude ?? fac.longitude,
                facility: {
                  id: fac.id,
                  name: fac.name,
                  facility_type: fac.facility_type,
                  city: fac.city,
                  latitude: fac.latitude,
                  longitude: fac.longitude,
                },
              };
            }
          }
          if (prev.events.some((e) => e.id === event.id)) return prev;
          return {
            ...prev,
            shipment: {
              ...prev.shipment,
              status: event.status,
              current_location: event.location ?? prev.shipment.current_location,
            },
            events: [...prev.events, event],
          };
        });
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shipment.id, shipment.live_tracking_enabled, subscribeRealtime]);

  return (
    <div className="space-y-6">
      <DeliveryTrackingReceipt payload={payload} />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {live && (
            <span className="inline-flex items-center gap-1 text-green-700">
              <Radio className="h-4 w-4" />
              Live
            </span>
          )}
          <span className="text-muted-foreground">Updated {lastUpdateLabel}</span>
          <span className="text-muted-foreground capitalize">
            Map: {mapModeLabel}
          </span>
          {offline && (
            <span className="inline-flex items-center gap-1 text-amber-700">
              <WifiOff className="h-4 w-4" />
              Offline — showing last known position
            </span>
          )}
        </div>

        {shipment.live_tracking_enabled || waypoints.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="show-route"
                  checked={showRoutePath}
                  onCheckedChange={setShowRoutePath}
                />
                <Label htmlFor="show-route" className="text-sm font-normal cursor-pointer">
                  Show route between stops
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="animate-route"
                  checked={animateRoute}
                  onCheckedChange={setAnimateRoute}
                  disabled={!showRoutePath || milestoneTrail.length < 2}
                />
                <Label
                  htmlFor="animate-route"
                  className="text-sm font-normal cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Route className="h-3.5 w-3.5" />
                  Animate movement along route
                </Label>
              </div>
            </div>

            <LiveMap
              trail={gpsLine}
              milestoneTrail={milestoneTrail}
              waypoints={waypoints}
              current={current}
              height={400}
              animateRoute={animateRoute}
            />

            {waypoints.length > 0 ? (
              <p className="text-xs text-muted-foreground">
                Blue dashed line = facility milestones · Orange = live GPS · Gray/amber
                markers = past and planned stops (per admin map settings).
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-muted-foreground rounded-lg border p-4">
            Live map is disabled and no checkpoint locations are recorded yet. Add
            facilities when updating status, or enable live GPS.
          </p>
        )}
      </section>

    </div>
  );
}
