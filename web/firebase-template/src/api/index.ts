// Axios instance — centralized API client
// ────────────────────────────────────────
// All server API calls go through this instance.
// The auth interceptor automatically attaches the Firebase ID token.

// ─── External ────────────────────────────────
import axios from "axios";

// ─── Internal ────────────────────────────────
import { useAuthStore } from "@/store/auth.store";

// ─────────────────────────────────────────────
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL ?? "http://localhost:3000",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor — attach ID token ───
apiClient.interceptors.request.use(
  (config) => {
    const { idToken } = useAuthStore.getState();
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — normalize errors ─
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
