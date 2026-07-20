import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { replaceMock, refreshMock, loginMock, getProfileCachedMock } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  refreshMock: vi.fn(),
  loginMock: vi.fn(),
  getProfileCachedMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock, push: vi.fn() }),
}));

vi.mock("@/lib/auth-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth-api")>("@/lib/auth-api");
  return {
    ...actual,
    login: loginMock,
    getProfileCached: getProfileCachedMock,
  };
});

import {
  LoginFormContainer,
  registrationToastDurationMs,
} from "./LoginFormContainer";

describe("LoginFormContainer", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    refreshMock.mockReset();
    loginMock.mockReset();
    getProfileCachedMock.mockReset();
    getProfileCachedMock.mockResolvedValue({ isAdmin: false });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("redirects to the home page after a successful login", async () => {
    const user = userEvent.setup();
    loginMock.mockResolvedValue(undefined);
    render(<LoginFormContainer />);

    await user.type(screen.getByLabelText("Email"), "danniel@email.com");
    await user.type(screen.getByLabelText("Kata Sandi"), "dannielsigma");
    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(loginMock).toHaveBeenCalledWith({
      email: "danniel@email.com",
      password: "dannielsigma",
    });
    await vi.waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/"));
  });

  it("shows the backend's error message instead of redirecting when login fails", async () => {
    const user = userEvent.setup();
    loginMock.mockRejectedValue(
      new ApiError(401, {
        success: false,
        message: "Login gagal",
        error: "Email atau kata sandi tidak tepat",
        status: 401,
      }),
    );
    render(<LoginFormContainer />);

    await user.type(screen.getByLabelText("Email"), "danniel@email.com");
    await user.type(screen.getByLabelText("Kata Sandi"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findByText("Email atau kata sandi tidak tepat")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("renders the registration notification at the bottom without shifting the form", () => {
    render(<LoginFormContainer successMessage="Akun berhasil dibuat, silakan masuk." />);

    const notification = screen.getByRole("status");
    expect(notification).toHaveTextContent("Akun berhasil dibuat, silakan masuk.");
    expect(notification).toHaveClass("fixed", "bottom-6");
    expect(screen.getByRole("heading", { name: "Selamat Datang Kembali!" })).toBeVisible();
  });

  it("dismisses the registration notification and removes its query flag", async () => {
    vi.useFakeTimers();
    render(<LoginFormContainer successMessage="Akun berhasil dibuat, silakan masuk." />);

    await vi.advanceTimersByTimeAsync(registrationToastDurationMs);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(replaceMock).toHaveBeenCalledWith("/login", { scroll: false });
  });
});
