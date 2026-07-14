import axiosClient from "./axiosClient";
import { AuthResponse, User } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await axiosClient.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function fetchProfile(): Promise<User> {
  const { data } = await axiosClient.get<User>("/auth/me");
  return data;
}
