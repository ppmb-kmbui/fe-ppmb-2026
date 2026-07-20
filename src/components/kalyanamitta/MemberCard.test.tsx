import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MemberCard } from "./MemberCard";

describe("MemberCard", () => {
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
