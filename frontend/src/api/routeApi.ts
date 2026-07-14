import axiosClient from "./axiosClient";
import { RouteRecord, CsvStopRow } from "../types";

export interface CreateRoutePayload {
  name: string;
  vehicleId: string;
  driverId?: string;
  algorithm: "nearest-neighbor" | "priority-first";
  depot: { id: string; latitude: number; longitude: number };
  stops: Omit<CsvStopRow, "">[];
  averageSpeedKmh: number;
  trafficFactor?: number;
}

export async function fetchRoutes(): Promise<RouteRecord[]> {
  const { data } = await axiosClient.get<RouteRecord[]>("/routes");
  return data;
}

export async function fetchRoute(id: string): Promise<RouteRecord> {
  const { data } = await axiosClient.get<RouteRecord>(`/routes/${id}`);
  return data;
}

export async function createRouteRequest(payload: CreateRoutePayload): Promise<RouteRecord> {
  const { data } = await axiosClient.post<RouteRecord>("/routes", payload);
  return data;
}

export async function updateRouteStatusRequest(
  id: string,
  status: string
): Promise<RouteRecord> {
  const { data } = await axiosClient.patch<RouteRecord>(`/routes/${id}/status`, { status });
  return data;
}

export async function markStopVisitedRequest(routeId: string, stopId: string) {
  const { data } = await axiosClient.patch(`/routes/${routeId}/stops/${stopId}/visit`);
  return data;
}

export async function deleteRouteRequest(id: string): Promise<void> {
  await axiosClient.delete(`/routes/${id}`);
}
