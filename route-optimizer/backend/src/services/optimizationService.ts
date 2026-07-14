import { GeoPoint, nearestNeighborRoute } from "../algorithms/nearestNeighbor";
import { calculateEtaMinutes } from "../algorithms/etaCalculator";
import { estimateFuelLiters } from "../algorithms/fuelEstimator";
import { priorityScheduleStops } from "../algorithms/priorityScheduler";
import { validateVehicleCapacity } from "../algorithms/capacityValidator";
import { AppError } from "../middleware/errorMiddleware";

export interface OptimizationStopInput {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
}

export interface OptimizationInput {
  algorithm: "nearest-neighbor" | "priority-first";
  depot: GeoPoint;
  stops: OptimizationStopInput[];
  vehicleCapacityKg: number;
  fuelEfficiencyKmPerL: number;
  averageSpeedKmh: number;
  trafficFactor?: number;
}

export interface OptimizationResult {
  orderedStops: OptimizationStopInput[];
  totalDistanceKm: number;
  etaMinutes: number;
  estimatedFuelLiters: number;
  capacityCheck: ReturnType<typeof validateVehicleCapacity>;
}

export function optimizeRoute(input: OptimizationInput): OptimizationResult {
  const capacityCheck = validateVehicleCapacity(
    input.stops.map((s) => ({ id: s.id, demandKg: s.demandKg })),
    input.vehicleCapacityKg
  );

  if (!capacityCheck.valid) {
    throw new AppError(
      `Total demand (${capacityCheck.totalDemandKg}kg) exceeds vehicle capacity (${input.vehicleCapacityKg}kg)`,
      422
    );
  }

  let orderedStops: OptimizationStopInput[];
  let totalDistanceKm: number;

  if (input.algorithm === "priority-first") {
    const scheduled = priorityScheduleStops(
      input.stops.map((s) => ({ id: s.id, priority: s.priority, demandKg: s.demandKg }))
    );
    const idOrder = scheduled.map((s) => s.id);
    orderedStops = idOrder.map((id) => input.stops.find((s) => s.id === id)!);

    let dist = 0;
    let current: GeoPoint = input.depot;
    for (const stop of orderedStops) {
      const point: GeoPoint = { id: stop.id, latitude: stop.latitude, longitude: stop.longitude };
      dist += haversineFallback(current, point);
      current = point;
    }
    totalDistanceKm = dist;
  } else {
    const points: GeoPoint[] = input.stops.map((s) => ({
      id: s.id,
      latitude: s.latitude,
      longitude: s.longitude
    }));
    const result = nearestNeighborRoute(input.depot, points);
    orderedStops = result.orderedIds.map((id) => input.stops.find((s) => s.id === id)!);
    totalDistanceKm = result.totalDistanceKm;
  }

  const etaMinutes = calculateEtaMinutes({
    distanceKm: totalDistanceKm,
    averageSpeedKmh: input.averageSpeedKmh,
    trafficFactor: input.trafficFactor ?? 1,
    stopCount: orderedStops.length
  });

  const totalLoad = orderedStops.reduce((sum, s) => sum + s.demandKg, 0);
  const estimatedFuelLiters = estimateFuelLiters({
    distanceKm: totalDistanceKm,
    fuelEfficiencyKmPerL: input.fuelEfficiencyKmPerL,
    loadKg: totalLoad
  });

  return {
    orderedStops,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    etaMinutes,
    estimatedFuelLiters,
    capacityCheck
  };
}

function haversineFallback(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
