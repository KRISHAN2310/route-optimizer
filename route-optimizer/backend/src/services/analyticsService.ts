import prisma from "../config/prismaClient";

export async function getDashboardSummary() {
  const [totalRoutes, activeRoutes, totalVehicles, availableVehicles, totalDrivers] =
    await Promise.all([
      prisma.route.count(),
      prisma.route.count({ where: { status: "IN_PROGRESS" } }),
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.driver.count()
    ]);

  const fuelAgg = await prisma.route.aggregate({
    _sum: { estimatedFuel: true, totalDistanceKm: true }
  });

  return {
    totalRoutes,
    activeRoutes,
    totalVehicles,
    availableVehicles,
    totalDrivers,
    totalFuelLiters: fuelAgg._sum.estimatedFuel || 0,
    totalDistanceKm: fuelAgg._sum.totalDistanceKm || 0
  };
}

export async function getFuelReport() {
  const routes = await prisma.route.findMany({
    select: {
      id: true,
      name: true,
      estimatedFuel: true,
      totalDistanceKm: true,
      createdAt: true,
      vehicle: { select: { plateNumber: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return routes;
}

export async function getRouteStatusBreakdown() {
  const statuses = ["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;

  const counts = await Promise.all(
    statuses.map((status) => prisma.route.count({ where: { status } }))
  );

  return statuses.map((status, idx) => ({ status, count: counts[idx] }));
}

export async function getVehicleUtilization() {
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      plateNumber: true,
      status: true,
      _count: { select: { routes: true } }
    }
  });

  return vehicles.map((v) => ({
    plateNumber: v.plateNumber,
    status: v.status,
    totalRoutes: v._count.routes
  }));
}
