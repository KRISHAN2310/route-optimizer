import prisma from "../config/prismaClient";
import { AppError } from "../middleware/errorMiddleware";

export interface DriverInput {
  userId: string;
  phone: string;
  licenseNo: string;
  vehicleId?: string;
}

export async function createDriver(input: DriverInput) {
  const existing = await prisma.driver.findUnique({ where: { userId: input.userId } });
  if (existing) {
    throw new AppError("Driver profile already exists for this user", 409);
  }

  return prisma.driver.create({
    data: input,
    include: { user: true, vehicle: true }
  });
}

export async function listDrivers() {
  return prisma.driver.findMany({
    include: { user: true, vehicle: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function getDriverById(id: string) {
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: { user: true, vehicle: true, routes: true }
  });
  if (!driver) {
    throw new AppError("Driver not found", 404);
  }
  return driver;
}

export async function updateDriver(id: string, input: Partial<DriverInput> & { available?: boolean }) {
  await getDriverById(id);
  return prisma.driver.update({
    where: { id },
    data: input,
    include: { user: true, vehicle: true }
  });
}

export async function deleteDriver(id: string) {
  await getDriverById(id);
  await prisma.driver.delete({ where: { id } });
}

export async function getDriverByUserId(userId: string) {
  const driver = await prisma.driver.findUnique({
    where: { userId },
    include: { vehicle: true, routes: { include: { stops: true } } }
  });
  if (!driver) {
    throw new AppError("Driver profile not found", 404);
  }
  return driver;
}
