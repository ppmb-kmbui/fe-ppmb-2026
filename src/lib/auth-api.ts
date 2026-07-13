import { apiFetch, ApiError } from "@/lib/api";
import type { ValidationError } from "@/types/api";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  fullName: string;
  lineId: string;
  whatsapp: string;
  email: string;
  faculty: string;
  batch: number;
  password: string;
  confirmPassword: string;
  imgUrl?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  fullname: string | null;
  imgUrl: string | null;
  faculty: string | null;
  batch: number;
  isAdmin: boolean;
  lineId: string | null;
  whatsappNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

let cachedProfile: AuthUser | null = null;
let profileRequest: Promise<AuthUser> | null = null;

export async function login(input: LoginInput): Promise<void> {
  await apiFetch<{ token: string }>("auth/login", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      password: input.password,
    }),
  });
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const response = await apiFetch<AuthUser>("auth/register", {
    method: "POST",
    body: JSON.stringify({
      fullname: input.fullName,
      lineId: input.lineId,
      whatsappNumber: input.whatsapp,
      email: input.email,
      password: input.password,
      confirmPassword: input.confirmPassword,
      faculty: input.faculty,
      batch: input.batch,
      imgUrl: input.imgUrl,
    }),
  });

  if (!response.data) {
    throw new Error("Registrasi berhasil tetapi data pengguna tidak diterima dari server");
  }

  return response.data;
}

export function getCachedProfileSnapshot(): AuthUser | null {
  return cachedProfile;
}

export async function getProfile(): Promise<AuthUser> {
  const response = await apiFetch<AuthUser>("auth/profile");

  if (!response.data) {
    throw new Error("Data profil tidak diterima dari server");
  }

  cachedProfile = response.data;
  return response.data;
}

export async function getProfileCached(): Promise<AuthUser> {
  if (cachedProfile) return cachedProfile;

  profileRequest ??= getProfile().finally(() => {
    profileRequest = null;
  });

  return profileRequest;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch<void>("auth/logout", { method: "POST" });
  } finally {
    cachedProfile = null;
    profileRequest = null;
  }
}

export interface AuthErrorResult {
  formError?: string;
  fieldErrors: Record<string, string>;
}

const REGISTER_RESPONSE_FIELD_TO_FORM_FIELD: Record<string, string> = {
  fullname: "fullName",
  whatsappNumber: "whatsapp",
  imgUrl: "photo",
};

function mapFieldName(field: string): string {
  return REGISTER_RESPONSE_FIELD_TO_FORM_FIELD[field] ?? field;
}

function isValidationErrorArray(error: unknown): error is ValidationError[] {
  return (
    Array.isArray(error) &&
    error.every(
      (item): item is ValidationError =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).field === "string" &&
        typeof (item as Record<string, unknown>).message === "string",
    )
  );
}

const GENERIC_ERROR_MESSAGE = "Terjadi kesalahan pada server. Silakan coba lagi.";
const NETWORK_ERROR_MESSAGE = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";

export function translateAuthError(error: unknown): AuthErrorResult {
  if (error instanceof ApiError) {
    const payloadError = error.payload?.error;

    if (isValidationErrorArray(payloadError)) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of payloadError) {
        fieldErrors[mapFieldName(issue.field)] = issue.message;
      }
      return { fieldErrors };
    }

    if (error.status === 401) {
      const message = typeof payloadError === "string" ? payloadError : "Email atau kata sandi tidak tepat";
      return { formError: message, fieldErrors: {} };
    }

    if (error.status === 409) {
      return { fieldErrors: { email: "Email sudah digunakan" } };
    }

    return { formError: error.payload?.message ?? GENERIC_ERROR_MESSAGE, fieldErrors: {} };
  }

  if (error instanceof TypeError) {
    return { formError: NETWORK_ERROR_MESSAGE, fieldErrors: {} };
  }

  return { formError: GENERIC_ERROR_MESSAGE, fieldErrors: {} };
}
