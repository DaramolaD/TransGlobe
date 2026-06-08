export const DASHBOARD_TRACKING_PATH = "/app/admin/tracking";

export function dashboardTrackingHref(shipmentId: string) {
  return `${DASHBOARD_TRACKING_PATH}/${shipmentId}`;
}

export function dashboardTrackingSearchUrl(query: string) {
  const q = query.trim();
  return q
    ? `${DASHBOARD_TRACKING_PATH}?q=${encodeURIComponent(q)}`
    : DASHBOARD_TRACKING_PATH;
}
