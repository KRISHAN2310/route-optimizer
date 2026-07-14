import prisma from "../config/prismaClient";
import { AppError } from "../middleware/errorMiddleware";
import { optimizeRoute, OptimizationStopInput } from "./optimizationService";
import { GeoPoint } from "../algorithms/nearestNeighbor";

export interface CreateRouteInput {
  name: string;
  vehicleId: string;
  driverId?: string;
  algorithm: "nearest-neighbor" | "priority-first";
  depot: GeoPoint;
  stops: Omit<OptimizationStopInput, "id">[];
  averageSpeedKmh: number;
  trafficFactor?: number;
}

export async function createOptimizedRoute(input: CreateRouteInput) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  const stopsWithIds: OptimizationStopInput[] = input.stops.map((s, idx) => ({
    ...s,
    id: `temp-${idx}`
  }));

  const result = optimizeRoute({
    algorithm: input.algorithm,
    depot: input.depot,
    stops: stopsWithIds,
    vehicleCapacityKg: vehicle.capacityKg,
    fuelEfficiencyKmPerL: vehicle.fuelEfficiency,
    averageSpeedKmh: input.averageSpeedKmh,
    trafficFactor: input.trafficFactor
  });

  const route = await prisma.route.create({
    data: {
      name: input.name,
      vehicleId: input.vehicleId,
      driverId: input.driverId,
      algorithm: input.algorithm,
      totalDistanceKm: result.totalDistanceKm,
      estimatedFuel: result.estimatedFuelLiters,
      etaMinutes: result.etaMinutes,
      status: "PLANNED",
      stops: {
        create: result.orderedStops.map((stop, index) => ({
          sequence: index + 1,
          label: stop.label,
          latitude: stop.latitude,
          longitude: stop.longitude,
          demandKg: stop.demandKg,
          priority: stop.priority
        }))
      }
    },
    include: { stops: true, vehicle: true, driver: true }
  });

  await prisma.vehicle.update({
    where: { id: input.vehicleId },
    data: { status: "ON_ROUTE" }
  });

  return route;
}

export async function listRoutes() {
  return prisma.route.findMany({
    include: { stops: true, vehicle: true, driver: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  });
}

export async function getRouteById(id: string) {
  const route = await prisma.route.findUnique({
    where: { id },
    include: { stops: { orderBy: { sequence: "asc" } }, vehicle: true, driver: { include: { user: true } } }
  });
  if (!route) {
    throw new AppError("Route not found", 404);
  }
  return route;
}

export async function updateRouteStatus(id: string, status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED") {
  const route = await getRouteById(id);

  const updated = await prisma.route.update({
    where: { id },
    data: { status },
    include: { stops: true, vehicle: true }
  });

  if (status === "COMPLETED" || status === "CANCELLED") {
    if (route.vehicleId) {
      await prisma.vehicle.update({
        where: { id: route.vehicleId },
        data: { status: "AVAILABLE" }
      });
    }
  }

  return updated;
}

export async function markStopVisited(routeId: string, stopId: string) {
  await getRouteById(routeId);
  return prisma.stop.update({
    where: { id: stopId },
    data: { visited: true }
  });
}

export async function deleteRoute(id: string) {
  await getRouteById(id);
  await prisma.route.delete({ where: { id } });
}
