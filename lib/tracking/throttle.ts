const DEFAULT_INTERVAL_MS = 30_000;

export function gpsUploadIntervalMs(seconds?: number): number {
  const sec = Number(seconds);
  if (!Number.isFinite(sec)) return DEFAULT_INTERVAL_MS;
  return Math.min(300, Math.max(15, sec)) * 1000;
}

export function shouldUploadNow(
  lastUploadAt: number | null,
  intervalMs = DEFAULT_INTERVAL_MS
): boolean {
  if (!lastUploadAt) return true;
  return Date.now() - lastUploadAt >= intervalMs;
}

export function makeClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
