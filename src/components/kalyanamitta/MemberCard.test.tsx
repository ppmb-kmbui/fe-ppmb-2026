import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MemberCard } from "./MemberCard";

describe("MemberCard", () => {
  it("uses a square avatar below the desktop breakpoint", () => {
    render(<MemberCard name="Budi" batch={2025} avatar={<span>Foto</span>} />);

    expect(screen.getByTestId("member-avatar")).toHaveClass("size-28");
    expect(screen.getByTestId("member-avatar")).toHaveClass(
      "lg:h-[132px]",
      "lg:w-[42%]",
    );
  });

  it("shows faculty before the batch on the Kalyanamitta card", () => {
    render(<MemberCard name="Budi" faculty="Fasilkom" batch={2025} />);

    expect(screen.getByText("Fasilkom • Angkatan 2025")).toBeInTheDocument();
  });

  it.each([null, undefined, "", "   "])(
    "falls back cleanly when faculty is %s",
    (faculty) => {
      render(<MemberCard name="Budi" faculty={faculty} batch={2025} />);

      expect(screen.getByText("Angkatan 2025")).toBeInTheDocument();
      expect(screen.queryByText(/null|•/i)).not.toBeInTheDocument();
    },
  );

  it("supports independent profile and Networking actions", async () => {
    const user = userEvent.setup();
    const onProfile = vi.fn();
    const onNetworking = vi.fn();

    render(
      <MemberCard
        name="Budi"
        batch={2025}
        actionLabel="Lihat Profil"
        onAction={onProfile}
        secondaryActionLabel="Networking"
        onSecondaryAction={onNetworking}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Lihat Profil" }));
    await user.click(screen.getByRole("button", { name: "Networking" }));

    expect(onProfile).toHaveBeenCalledOnce();
    expect(onNetworking).toHaveBeenCalledOnce();
  });
});
