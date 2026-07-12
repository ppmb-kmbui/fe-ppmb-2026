import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("shows required-field errors and does not call onSubmit when the form is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findByText("Email wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi wajib diisi")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows a validation error for a malformed email", async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Kata Sandi"), "somepassword");
    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(await screen.findByText("Format email tidak valid")).toBeInTheDocument();
  });

  it("calls onSubmit with the entered credentials when the form is valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Kata Sandi"), "somepassword");
    await user.click(screen.getByRole("button", { name: "Masuk" }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "somepassword",
    });
  });

  it("displays a server-provided field error next to the matching input", () => {
    render(<LoginForm serverErrors={{ email: "Email atau kata sandi tidak tepat" }} />);

    expect(screen.getByText("Email atau kata sandi tidak tepat")).toBeInTheDocument();
  });

  it("displays the form-level error message when provided", () => {
    render(<LoginForm formError="Tidak dapat terhubung ke server." />);

    expect(screen.getByRole("alert")).toHaveTextContent("Tidak dapat terhubung ke server.");
  });
});
