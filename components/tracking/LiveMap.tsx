"use client";

import { useEffect, useMemo, useState } from "react";
import Map, { Layer, Marker, Source } from "react-map-gl/maplibre";
import type { LayerProps } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { getMapStyleUrl } from "@/lib/tracking/map-style";
import type { MapWaypoint } from "@/lib/types/tracking";
import { cn } from "@/lib/utils";

export type MapCoordinate = { lat: number; lng: number };

const trailLayer: LayerProps = {
  id: "trail",
  type: "line",
  paint: {
    "line-color": "#e85d04",
    "line-width": 4,
    "line-opacity": 0.85,
  },
};

const milestoneLayer: LayerProps = {
  id: "milestone-route",
  type: "line",
  paint: {
    "line-color": "#1d4ed8",
    "line-width": 3,
    "line-opacity": 0.75,
    "line-dasharray": [2, 2],
  },
};

const KIND_MARKER: Record<
  MapWaypoint["kind"],
  { bg: string; ring: string; pulse?: boolean }
> = {
  past: { bg: "bg-slate-500", ring: "border-white" },
  current: { bg: "bg-ember-main", ring: "border-white", pulse: true },
  planned: { bg: "bg-amber-400", ring: "border-white" },
  gps: { bg: "bg-ember-main", ring: "border-white", pulse: true },
};

function coordsFromWaypoints(waypoints: MapWaypoint[]): MapCoordinate[] {
  return waypoints.map((w) => ({ lat: w.lat, lng: w.lng }));
}

function lineGeoJson(trail: MapCoordinate[]) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: trail.map((p) => [p.lng, p.lat]),
    },
  };
}

export function LiveMap({
  trail = [],
  milestoneTrail = [],
  waypoints = [],
  current,
  height = 360,
  className = "",
  animateRoute = false,
}: {
  trail?: MapCoordinate[];
  milestoneTrail?: MapCoordinate[];
  waypoints?: MapWaypoint[];
  current?: MapCoordinate | null;
  height?: number;
  className?: string;
  animateRoute?: boolean;
}) {
  const [animIndex, setAnimIndex] = useState(0);

  const displayTrail = trail.length > 0 ? trail : coordsFromWaypoints(waypoints);
  const center =
    current ??
    displayTrail[displayTrail.length - 1] ??
    milestoneTrail[milestoneTrail.length - 1] ?? { lat: 40.7128, lng: -74.006 };

  const gpsLine = useMemo(() => lineGeoJson(trail), [trail]);
  const milestoneLine = useMemo(
    () => lineGeoJson(milestoneTrail),
    [milestoneTrail]
  );

  const animPoints = milestoneTrail.length > 1 ? milestoneTrail : displayTrail;

  useEffect(() => {
    if (!animateRoute || animPoints.length < 2) {
      setAnimIndex(0);
      return;
    }
    setAnimIndex(0);
    const id = window.setInterval(() => {
      setAnimIndex((i) => (i + 1) % animPoints.length);
    }, 1200);
    return () => window.clearInterval(id);
  }, [animateRoute, animPoints]);

  const animMarker = animateRoute && animPoints.length > 0 ? animPoints[animIndex] : null;

  return (
    <div
      className={cn("rounded-lg overflow-hidden border", className)}
      style={{ height }}
    >
      <Map
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: displayTrail.length > 1 || waypoints.length > 1 ? 6 : 8,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={getMapStyleUrl()}
      >
        {milestoneTrail.length > 1 && (
          <Source id="milestone-route" type="geojson" data={milestoneLine}>
            <Layer {...milestoneLayer} />
          </Source>
        )}
        {trail.length > 1 && (
          <Source id="gps-route" type="geojson" data={gpsLine}>
            <Layer {...trailLayer} />
          </Source>
        )}
        {waypoints.map((w) => {
          const style = KIND_MARKER[w.kind];
          return (
            <Marker key={w.id} longitude={w.lng} latitude={w.lat} anchor="bottom">
              <div className="flex flex-col items-center gap-0.5 max-w-[140px]">
                <div className="relative">
                  {style.pulse && w.kind !== "planned" ? (
                    <span className="absolute -inset-2 rounded-full bg-ember-main/25 animate-ping" />
                  ) : null}
                  <span
                    className={cn(
                      "relative block h-3 w-3 rounded-full border-2 shadow-sm",
                      style.bg,
                      style.ring
                    )}
                  />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight px-1 py-0.5 rounded bg-background/90 border shadow-sm truncate w-full">
                  {w.label}
                </span>
              </div>
            </Marker>
          );
        })}
        {animMarker && (
          <Marker
            longitude={animMarker.lng}
            latitude={animMarker.lat}
            anchor="center"
          >
            <span className="block h-5 w-5 rounded-full bg-primary border-2 border-white shadow-lg ring-2 ring-primary/30" />
          </Marker>
        )}
        {current && !animMarker && (
          <Marker longitude={current.lng} latitude={current.lat} anchor="center">
            <div className="relative">
              <span className="absolute -inset-3 rounded-full bg-ember-main/30 animate-ping" />
              <span className="relative block h-4 w-4 rounded-full bg-ember-main border-2 border-white shadow-md" />
            </div>
          </Marker>
        )}
      </Map>
    </div>
  );
}
