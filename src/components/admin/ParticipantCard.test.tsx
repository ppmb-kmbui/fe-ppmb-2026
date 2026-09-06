import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParticipantCard } from "./ParticipantCard";

describe("participant lateness", () => {
  it("shows the late task count while preserving participant navigation and progress", () => {
    render(<ParticipantCard name="Peserta" batch={2026} progress={50} lateTaskCount={2} href="/admin/peserta/42" />);
    expect(screen.getByText("Telat · 2 tugas")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/admin/peserta/42");
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("does not mark a participant late when no task is late", () => {
    render(<ParticipantCard name="Peserta" batch={2026} progress={100} lateTaskCount={0} />);
    expect(screen.queryByText(/Telat/)).not.toBeInTheDocument();
  });
});
