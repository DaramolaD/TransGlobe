"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { uploadLocationBatch } from "@/lib/actions/locations";
import {
  enqueueLocation,
  peekQueue,
  removeFromQueue,
  queueSize,
} from "@/lib/tracking/offline-queue";
import {
  gpsUploadIntervalMs,
  makeClientId,
  shouldUploadNow,
} from "@/lib/tracking/throttle";
import { toast } from "sonner";
import { MapPin, Pause, Play, Wifi, WifiOff } from "lucide-react";

export function DriverLocationPublisher({
  shipmentId,
  uploadIntervalSec = 30,
}: {
  shipmentId: string;
  uploadIntervalSec?: number;
}) {
  const uploadIntervalMs = gpsUploadIntervalMs(uploadIntervalSec);
  const [sharing, setSharing] = useState(false);
  const [pending, setPending] = useState(0);
  const [online, setOnline] = useState(true);
  const watchId = useRef<number | null>(null);
  const lastUploadAt = useRef<number | null>(null);
  const buffer = useRef<
    {
      latitude: number;
      longitude: number;
      accuracy_m?: number | null;
      heading?: number | null;
      speed_mps?: number | null;
      recorded_at: string;
      client_id: string;
    }[]
  >([]);

  const flush = useCallback(async () => {
    const queued = await peekQueue(40);
    const fromQueue = queued
      .filter((q) => q.shipmentId === shipmentId)
      .map((q) => q.point);
    const batch = [...fromQueue, ...buffer.current];
    buffer.current = [];
    if (!batch.length) return;

    const r = await uploadLocationBatch(shipmentId, batch);
    if (r.error) {
      for (const p of batch) {
        await enqueueLocation(shipmentId, p);
      }
      toast.error(r.error);
    } else {
      await removeFromQueue(queued.map((q) => q.key));
      lastUploadAt.current = Date.now();
    }
    setPending(await queueSize());
  }, [shipmentId]);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", () => {
      setOnline(true);
      void flush();
    });
    window.addEventListener("offline", () => setOnline(false));
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, [flush]);

  useEffect(() => {
    if (!sharing) {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
      void flush();
      return;
    }

    if (!navigator.geolocation) {
      toast.error("GPS not available on this device");
      setSharing(false);
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const point = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy_m: pos.coords.accuracy,
          heading: pos.coords.heading,
          speed_mps: pos.coords.speed,
          recorded_at: new Date(pos.timestamp).toISOString(),
          client_id: makeClientId(),
        };

        if (!shouldUploadNow(lastUploadAt.current, uploadIntervalMs)) {
          buffer.current.push(point);
          return;
        }

        if (!navigator.onLine) {
          void enqueueLocation(shipmentId, point).then(() => queueSize().then(setPending));
          return;
        }

        buffer.current.push(point);
        void flush();
      },
      () => toast.error("Could not read GPS — check permissions"),
      { enableHighAccuracy: false, maximumAge: 15_000, timeout: 20_000 }
    );

    return () => {
      if (watchId.current != null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [sharing, shipmentId, flush]);

  useEffect(() => {
    queueSize().then(setPending);
  }, []);

  return (
    <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-ember-main" />
          Live GPS
        </div>
        {online ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-amber-600" />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {sharing
          ? "Sharing location (batched every ~12s). Works offline — points sync when back online."
          : "Start sharing when you begin pickup or delivery."}
      </p>
      {pending > 0 && (
        <p className="text-xs text-amber-700">{pending} point(s) queued</p>
      )}
      <Button
        type="button"
        size="sm"
        variant={sharing ? "secondary" : "default"}
        className="w-full"
        onClick={() => setSharing((s) => !s)}
      >
        {sharing ? (
          <>
            <Pause className="h-4 w-4 mr-1" />
            Stop sharing
          </>
        ) : (
          <>
            <Play className="h-4 w-4 mr-1" />
            Start sharing location
          </>
        )}
      </Button>
    </div>
  );
}
