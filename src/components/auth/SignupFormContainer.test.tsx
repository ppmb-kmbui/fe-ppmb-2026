import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/lib/api";

const { pushMock, registerMock, uploadImageMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  registerMock: vi.fn(),
  uploadImageMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("@/lib/auth-api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/auth-api")>("@/lib/auth-api");
  return { ...actual, register: registerMock };
});

vi.mock("@/lib/image-upload", async () => {
  const actual = await vi.importActual<typeof import("@/lib/image-upload")>("@/lib/image-upload");
  return { ...actual, uploadImage: uploadImageMock };
});

import { SignupFormContainer } from "./SignupFormContainer";

function makePhoto(): File {
  return new File(["fake-image-bytes"], "photo.png", { type: "image/png" });
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nama Lengkap (sesuai SIAK)"), "Danniel Sigma");
  await user.type(screen.getByLabelText("ID Line"), "danniel26");
  await user.type(screen.getByLabelText("Nomor Whatsapp"), "081234567890");
  await user.type(screen.getByLabelText("Email"), "danniel@email.com");
  await user.type(screen.getByLabelText("Fakultas"), "Ilmu Komputer");
  await user.type(screen.getByLabelText("Angkatan"), "2026");
  await user.type(screen.getByLabelText("Kata Sandi (Min. 8 Karakter)"), "password123");
  await user.type(screen.getByLabelText("Konfirmasi Kata Sandi"), "password123");
  await user.upload(screen.getByLabelText("Foto Profil"), makePhoto());
}

describe("SignupFormContainer", () => {
  beforeEach(() => {
    pushMock.mockReset();
    registerMock.mockReset();
    uploadImageMock.mockReset();
    uploadImageMock.mockResolvedValue("https://res.cloudinary.com/xuytis3l/image/upload/v1/photo.png");
  });

  it("redirects to the login page with a registered flag after successful signup", async () => {
    const user = userEvent.setup();
    registerMock.mockResolvedValue({ id: 1, email: "danniel@email.com" });
    render(<SignupFormContainer />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    await vi.waitFor(() => expect(registerMock).toHaveBeenCalled());
    expect(pushMock).toHaveBeenCalledWith("/login?registered=1");
  });

  it("shows a duplicate-email error on the email field instead of redirecting", async () => {
    const user = userEvent.setup();
    registerMock.mockRejectedValue(
      new ApiError(409, {
        success: false,
        message: "Email sudah digunakan",
        error: "DUPLICATE_EMAIL",
        status: 409,
      }),
    );
    render(<SignupFormContainer />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Email sudah digunakan")).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("uploads the selected photo first and registers with the resulting imgUrl", async () => {
    const user = userEvent.setup();
    uploadImageMock.mockResolvedValue("https://res.cloudinary.com/xuytis3l/image/upload/v1/photo.png");
    registerMock.mockResolvedValue({ id: 1, email: "danniel@email.com" });
    render(<SignupFormContainer />);

    await fillValidForm(user);
    const photo = makePhoto();
    await user.upload(screen.getByLabelText("Foto Profil"), photo);
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    await vi.waitFor(() => expect(registerMock).toHaveBeenCalled());
    expect(uploadImageMock).toHaveBeenLastCalledWith(photo);
    expect(registerMock).toHaveBeenCalledWith(
      expect.objectContaining({
        imgUrl: "https://res.cloudinary.com/xuytis3l/image/upload/v1/photo.png",
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/login?registered=1");
  });

  it("shows an upload error and does not call register when the photo upload fails", async () => {
    const user = userEvent.setup();
    uploadImageMock.mockRejectedValue(new Error("Gagal mengunggah foto"));
    render(<SignupFormContainer />);

    await fillValidForm(user);
    const photo = makePhoto();
    await user.upload(screen.getByLabelText("Foto Profil"), photo);
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Gagal mengunggah foto")).toBeInTheDocument();
    expect(registerMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
