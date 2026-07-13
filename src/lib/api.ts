import type { ApiResponse } from "@/types/api";

interface ApiRequestInit extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiResponse<unknown>;

  constructor(status: number, payload?: ApiResponse<unknown>) {
    super(payload?.message ?? `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function getApiBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return baseUrl.replace(/\/+$/, "");
}

export async function apiFetch<T>(
  path: string,
  init: ApiRequestInit = {},
): Promise<ApiResponse<T>> {
  const { token, headers: initialHeaders, ...requestInit } = init;
  const headers = new Headers(initialHeaders);

  if (
    requestInit.body &&
    !(requestInit.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const normalizedPath = path.replace(/^\/+/, "");
  const response = await fetch(`${getApiBaseUrl()}/${normalizedPath}`, {
    ...requestInit,
    headers,
    credentials: requestInit.credentials ?? "same-origin",
  });

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const payload = isJson
    ? ((await response.json()) as ApiResponse<T>)
    : undefined;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      payload as ApiResponse<unknown> | undefined,
    );
  }

  if (!payload) {
    throw new ApiError(response.status, {
      success: false,
      message: "API returned a non-JSON response",
      status: response.status,
    });
  }

  return payload;
}
