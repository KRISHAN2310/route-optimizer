export interface GeoPoint {
  id: string;
  latitude: number;
  longitude: number;
}

export function haversineDistanceKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return R * c;
}

export interface NearestNeighborResult {
  orderedIds: string[];
  totalDistanceKm: number;
}

export function nearestNeighborRoute(
  start: GeoPoint,
  points: GeoPoint[]
): NearestNeighborResult {
  const remaining = [...points];
  const orderedIds: string[] = [];
  let current = start;
  let totalDistanceKm = 0;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineDistanceKm(current, remaining[i]);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const next = remaining.splice(nearestIdx, 1)[0];
    totalDistanceKm += nearestDist;
    orderedIds.push(next.id);
    current = next;
  }

  return { orderedIds, totalDistanceKm };
}
