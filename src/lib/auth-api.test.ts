import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { apiFetchMock } = vi.hoisted(() => ({ apiFetchMock: vi.fn() }));

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch: apiFetchMock };
});

const { login, register, logout, translateAuthError } = await import("@/lib/auth-api");

describe("register", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("maps form field names to the backend payload and omits the photo", async () => {
    apiFetchMock.mockResolvedValue({
      success: true,
      data: { id: 1, email: "danniel@email.com" },
    });

    await register({
      fullName: "Danniel",
      lineId: "danniel26",
      whatsapp: "081234567890",
      email: "danniel@email.com",
      faculty: "Ilmu Komputer",
      batch: 2026,
      password: "password123",
      confirmPassword: "password123",
    });

    expect(apiFetchMock).toHaveBeenCalledWith("auth/register", {
      method: "POST",
      body: JSON.stringify({
        fullname: "Danniel",
        lineId: "danniel26",
        whatsappNumber: "081234567890",
        email: "danniel@email.com",
        password: "password123",
        confirmPassword: "password123",
        faculty: "Ilmu Komputer",
        batch: 2026,
      }),
    });
  });

  it("throws when the server responds successfully but without user data", async () => {
    apiFetchMock.mockResolvedValue({ success: true, status: 201 });

    await expect(
      register({
        fullName: "Danniel",
        lineId: "danniel26",
        whatsapp: "081234567890",
        email: "danniel@email.com",
        faculty: "Ilmu Komputer",
        batch: 2026,
        password: "password123",
        confirmPassword: "password123",
      }),
    ).rejects.toThrow();
  });
});

describe("login", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("posts credentials to the login endpoint", async () => {
    apiFetchMock.mockResolvedValue({ success: true, data: { token: "t" } });

    await login({ email: "danniel@email.com", password: "dannielsigma" });

    expect(apiFetchMock).toHaveBeenCalledWith("auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "danniel@email.com", password: "dannielsigma" }),
    });
  });
});

describe("logout", () => {
  beforeEach(() => {
    apiFetchMock.mockReset();
  });

  it("posts to the logout endpoint with no body", async () => {
    apiFetchMock.mockResolvedValue({ success: true });

    await logout();

    expect(apiFetchMock).toHaveBeenCalledWith("auth/logout", { method: "POST" });
  });
});

describe("translateAuthError", () => {
  it("maps a 400 validation error array to form field names", () => {
    const error = new ApiError(400, {
      success: false,
      message: "Validasi gagal",
      error: [
        { field: "whatsappNumber", message: "Nomor WhatsApp tidak valid" },
        { field: "fullname", message: "Nama lengkap minimal 3 karakter" },
        { field: "batch", message: "Angkatan tidak valid" },
      ],
      status: 400,
    });

    const result = translateAuthError(error);

    expect(result.fieldErrors).toEqual({
      whatsapp: "Nomor WhatsApp tidak valid",
      fullName: "Nama lengkap minimal 3 karakter",
      batch: "Angkatan tidak valid",
    });
    expect(result.formError).toBeUndefined();
  });

  it("returns the backend message as formError for a 401 login failure", () => {
    const error = new ApiError(401, {
      success: false,
      message: "Login gagal",
      error: "Email atau kata sandi tidak tepat",
      status: 401,
    });

    const result = translateAuthError(error);

    expect(result.formError).toBe("Email atau kata sandi tidak tepat");
    expect(result.fieldErrors).toEqual({});
  });

  it("maps a 409 duplicate-email conflict to the email field", () => {
    const error = new ApiError(409, {
      success: false,
      message: "Email sudah digunakan",
      error: "DUPLICATE_EMAIL",
      status: 409,
    });

    const result = translateAuthError(error);

    expect(result.fieldErrors).toEqual({ email: "Email sudah digunakan" });
  });

  it("uses the backend message for an unhandled error status", () => {
    const error = new ApiError(500, {
      success: false,
      message: "Terjadi kesalahan internal",
      error: "Unknown error",
      status: 500,
    });

    const result = translateAuthError(error);

    expect(result.formError).toBe("Terjadi kesalahan internal");
  });

  it("returns a network-error message when fetch itself fails", () => {
    const result = translateAuthError(new TypeError("Failed to fetch"));

    expect(result.formError).toBe(
      "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.",
    );
  });

  it("falls back to a generic message for unrecognized errors", () => {
    const result = translateAuthError("something unexpected");

    expect(result.formError).toBe("Terjadi kesalahan pada server. Silakan coba lagi.");
    expect(result.fieldErrors).toEqual({});
  });
});
