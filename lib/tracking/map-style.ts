/** Free MapLibre style; optional Mapbox when token is set */

export function getMapStyleUrl(): string {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (mapboxToken) {
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${mapboxToken}`;
  }
  return "https://demotiles.maplibre.org/style.json";
}

export function getMapProviderLabel(): string {
  return process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? "Mapbox" : "MapLibre (free)";
}
