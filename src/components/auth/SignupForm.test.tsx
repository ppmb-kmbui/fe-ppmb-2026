import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SignupForm } from "./SignupForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nama Lengkap (sesuai SIAK)"), "Danniel Sigma");
  await user.type(screen.getByLabelText("ID Line"), "danniel26");
  await user.type(screen.getByLabelText("Nomor Whatsapp"), "081234567890");
  await user.type(screen.getByLabelText("Email"), "danniel@email.com");
  await user.type(screen.getByLabelText("Fakultas"), "Ilmu Komputer");
  await user.type(screen.getByLabelText("Angkatan"), "2026");
  await user.type(screen.getByLabelText("Kata Sandi (Min. 8 Karakter)"), "password123");
  await user.type(screen.getByLabelText("Konfirmasi Kata Sandi"), "password123");
}

function makePhoto(): File {
  return new File(["fake-image-bytes"], "photo.png", { type: "image/png" });
}

describe("SignupForm", () => {
  it("shows required-field errors and does not call onSubmit when the form is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<SignupForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Nama lengkap wajib diisi")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("rejects a WhatsApp number that does not match the Indonesian mobile format", async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Nomor Whatsapp"), "12345");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Nomor WhatsApp tidak valid")).toBeInTheDocument();
  });

  it("rejects a batch year outside the 2020-2100 range", async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Angkatan"), "1999");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Angkatan harus antara 2020-2100")).toBeInTheDocument();
  });

  it("rejects a confirm-password value that does not match the password", async () => {
    const user = userEvent.setup();
    render(<SignupForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Kata Sandi (Min. 8 Karakter)"), "password123");
    await user.type(screen.getByLabelText("Konfirmasi Kata Sandi"), "different123");
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(await screen.findByText("Konfirmasi kata sandi tidak cocok")).toBeInTheDocument();
  });

  it("calls onSubmit with the entered values and selected photo when the form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<SignupForm onSubmit={onSubmit} />);
    const photo = makePhoto();

    await fillValidForm(user);
    await user.upload(screen.getByLabelText("Foto Profil"), photo);
    await user.click(screen.getByRole("button", { name: "Daftar" }));

    expect(onSubmit).toHaveBeenCalledWith({
      fullName: "Danniel Sigma",
      lineId: "danniel26",
      whatsapp: "081234567890",
      email: "danniel@email.com",
      faculty: "Ilmu Komputer",
      batch: 2026,
      password: "password123",
      confirmPassword: "password123",
      photo,
    });
  });

  it("displays a server-provided field error, e.g. a duplicate email", () => {
    render(<SignupForm serverErrors={{ email: "Email sudah digunakan" }} />);

    expect(screen.getByText("Email sudah digunakan")).toBeInTheDocument();
  });
});
