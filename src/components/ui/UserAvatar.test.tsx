import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { UserAvatar } from "./UserAvatar";

describe("UserAvatar", () => {
  it("shows the neutral generic avatar when no image URL exists", () => {
    render(<UserAvatar src={null} alt="Foto Kak Sari" />);

    expect(
      screen.getByRole("img", { name: "Foto Kak Sari" }),
    ).toBeInTheDocument();
  });

  it("shows the uploaded profile image when an URL exists", () => {
    render(
      <UserAvatar
        src="https://cdn.example.test/sari.jpg"
        alt="Foto Kak Sari"
      />,
    );

    expect(screen.getByAltText("Foto Kak Sari")).toHaveAttribute(
      "src",
      "https://cdn.example.test/sari.jpg",
    );
  });
});
