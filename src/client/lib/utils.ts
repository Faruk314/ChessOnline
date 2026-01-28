import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AxiosError } from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const axiosError = error as AxiosError<{ message: string }>;
    return axiosError.response?.data?.message || "Unexpected error occurred";
  }
  return "Unknown error";
}
