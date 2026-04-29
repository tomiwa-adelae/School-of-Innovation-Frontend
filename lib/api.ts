import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuth } from "@/store/useAuth";
import { env } from "./env";

const api: AxiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the stored access token as a Bearer header on every request.
// This is the fallback path for Safari, which blocks cross-site httpOnly cookies.
// Chrome/Firefox will use cookies; Safari will use this header.
api.interceptors.request.use((config) => {
  const { accessToken } = useAuth.getState();
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/verify-code",
  "/auth/set-new-password",
  "/auth/refresh", // never re-intercept the refresh endpoint itself
];

function isPublicRoute(url?: string) {
  if (!url) return false;
  return PUBLIC_ROUTES.some((r) => url.includes(r));
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v?: any) => void;
  reject: (e?: any) => void;
}> = [];

function processQueue(error: any) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: any }) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const message = (error.response?.data as any)?.message;
    const path = originalRequest?.url || "";

    if (isPublicRoute(path)) {
      return Promise.reject(error);
    }

    // Handle 401 (access token expired)
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Send the stored refresh token in the body for Safari (cookie blocked),
        // withCredentials still covers Chrome/Firefox via cookie.
        const { refreshToken, setAccessToken, setRefreshToken } = useAuth.getState();
        const { data } = await api.post(
          "/auth/refresh",
          { refreshToken },
          { withCredentials: true },
        );

        // Store the rotated tokens so future requests and page reloads work.
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);

        processQueue(null);
        isRefreshing = false;

        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        isRefreshing = false;

        // Refresh failed — session fully expired, send to login
        const { clearUser } = useAuth.getState();
        clearUser();
        if (typeof window !== "undefined") window.location.assign("/login");

        return Promise.reject(err);
      }
    }

    // Handle auth guard rejections (role/session) — but NOT business logic 403s.
    // Business logic ForbiddenExceptions have custom messages (e.g. "You must purchase
    // this product first"), while the auth/roles guard returns exactly "Forbidden".
    if (message === "Unauthorized" || message === "Forbidden") {
      const { clearUser } = useAuth.getState();
      clearUser();
      if (typeof window !== "undefined") window.location.assign("/login");
    }

    return Promise.reject(error);
  },
);

export default api;

// ── Authenticated helpers ──────────────────────────────────────────────────────

export async function fetchData<T>(url: string): Promise<T> {
  const res = await api.get(url);
  return res.data;
}
export async function postData<T>(url: string, data: any): Promise<T> {
  const res = await api.post(url, data);
  return res.data;
}
export async function updateData<T>(url: string, data: any): Promise<T> {
  const res = await api.patch(url, data);
  return res.data;
}
export async function deleteData<T>(url: string): Promise<T> {
  const res = await api.delete(url);
  return res.data;
}

// ── Public (unauthenticated) helper ───────────────────────────────────────────
// Uses a plain fetch so it never triggers the auth interceptor / redirect.
export async function publicFetch<T>(url: string): Promise<T> {
  const res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}
