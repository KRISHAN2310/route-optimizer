import axiosClient from "./axiosClient";
import { Driver } from "../types";

export interface DriverPayload {
  userId: string;
  phone: string;
  licenseNo: string;
  vehicleId?: string;
}

export async function fetchDrivers(): Promise<Driver[]> {
  const { data } = await axiosClient.get<Driver[]>("/drivers");
  return data;
}

export async function fetchMyDriverProfile(): Promise<Driver> {
  const { data } = await axiosClient.get<Driver>("/drivers/me");
  return data;
}

export async function createDriverRequest(payload: DriverPayload): Promise<Driver> {
  const { data } = await axiosClient.post<Driver>("/drivers", payload);
  return data;
}

export async function updateDriverRequest(
  id: string,
  payload: Partial<DriverPayload> & { available?: boolean }
): Promise<Driver> {
  const { data } = await axiosClient.put<Driver>(`/drivers/${id}`, payload);
  return data;
}

export async function deleteDriverRequest(id: string): Promise<void> {
  await axiosClient.delete(`/drivers/${id}`);
}
