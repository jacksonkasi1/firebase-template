// API response helpers — standardized shape
// ──────────────────────────────────────────

// ─── Types ───────────────────────────────────
import type { ApiSuccess, ApiError } from "@/types";

// ─────────────────────────────────────────────
export const ok = <T>(data: T, message = "Success"): ApiSuccess<T> => ({
  success: true,
  message,
  data,
});

export const fail = (message: string, error?: string): ApiError => ({
  success: false,
  message,
  ...(error ? { error } : {}),
});
