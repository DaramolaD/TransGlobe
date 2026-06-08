/** IndexedDB queue for GPS points when offline (driver PWA) */

const DB_NAME = "swiftcargo-tracking";
const STORE = "pending-locations";
const DB_VERSION = 1;

export type QueuedPoint = {
  key: string;
  shipmentId: string;
  point: {
    latitude: number;
    longitude: number;
    accuracy_m?: number | null;
    heading?: number | null;
    speed_mps?: number | null;
    recorded_at: string;
    client_id: string;
  };
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "key" });
      }
    };
  });
}

export async function enqueueLocation(
  shipmentId: string,
  point: QueuedPoint["point"]
): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({
      key: `${shipmentId}:${point.client_id}`,
      shipmentId,
      point,
    });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function peekQueue(limit = 50): Promise<QueuedPoint[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const all = (req.result as QueuedPoint[]) ?? [];
      resolve(all.slice(0, limit));
    };
    req.onerror = () => reject(req.error);
  });
}

export async function removeFromQueue(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    for (const k of keys) store.delete(k);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function queueSize(): Promise<number> {
  const items = await peekQueue(1000);
  return items.length;
}
