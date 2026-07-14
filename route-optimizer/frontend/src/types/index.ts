export type Role = "ADMIN" | "DISPATCHER" | "DRIVER";
export type VehicleStatus = "AVAILABLE" | "ON_ROUTE" | "MAINTENANCE";
export type RouteStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  capacityKg: number;
  fuelEfficiency: number;
  status: VehicleStatus;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface Driver {
  id: string;
  userId: string;
  phone: string;
  licenseNo: string;
  vehicleId: string | null;
  available: boolean;
  user?: User;
  vehicle?: Vehicle | null;
}

export interface Stop {
  id: string;
  routeId: string;
  sequence: number;
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
  visited: boolean;
}

export interface RouteRecord {
  id: string;
  name: string;
  vehicleId: string | null;
  driverId: string | null;
  status: RouteStatus;
  algorithm: string;
  totalDistanceKm: number;
  estimatedFuel: number;
  etaMinutes: number;
  createdAt: string;
  stops: Stop[];
  vehicle?: Vehicle | null;
  driver?: Driver | null;
}

export interface DashboardSummary {
  totalRoutes: number;
  activeRoutes: number;
  totalVehicles: number;
  availableVehicles: number;
  totalDrivers: number;
  totalFuelLiters: number;
  totalDistanceKm: number;
}

export interface StatusBreakdownItem {
  status: RouteStatus;
  count: number;
}

export interface VehicleUtilizationItem {
  plateNumber: string;
  status: VehicleStatus;
  totalRoutes: number;
}

export interface CsvStopRow {
  label: string;
  latitude: number;
  longitude: number;
  demandKg: number;
  priority: number;
}
