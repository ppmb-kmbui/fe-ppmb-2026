import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type HTMLAttributes } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { cropImageToFileMock } = vi.hoisted(() => ({
  cropImageToFileMock: vi.fn(),
}));

vi.mock("@/lib/crop-image", async () => {
  const actual = await vi.importActual<typeof import("@/lib/crop-image")>("@/lib/crop-image");
  return { ...actual, cropImageToFile: cropImageToFileMock };
});

vi.mock("react-easy-crop", () => ({
  default: ({
    onCropComplete,
    cropperProps,
    mediaProps,
  }: {
    onCropComplete?: (
      percentageArea: { x: number; y: number; width: number; height: number },
      pixelArea: { x: number; y: number; width: number; height: number },
    ) => void;
    cropperProps?: HTMLAttributes<HTMLDivElement>;
    mediaProps?: { alt?: string };
  }) => (
    <div {...cropperProps}>
      <span>{mediaProps?.alt}</span>
      <button
        type="button"
        onClick={() =>
          onCropComplete?.(
            { x: 10, y: 10, width: 80, height: 80 },
            { x: 20, y: 30, width: 400, height: 400 },
          )
        }
      >
        Tetapkan Area
      </button>
    </div>
  ),
}));

import { ProfilePhotoUpload } from "./ProfilePhotoUpload";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

function makePhoto(name = "photo.png") {
  return new File(["fake-image-bytes"], name, { type: "image/png" });
}

function ControlledUpload({
  onChange,
  existingImageUrl,
  maxSizeMb,
}: {
  onChange: (file: File | null) => void;
  existingImageUrl?: string;
  maxSizeMb?: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <ProfilePhotoUpload
      value={file}
      existingImageUrl={existingImageUrl}
      maxSizeMb={maxSizeMb}
      onChange={(nextFile) => {
        setFile(nextFile);
        onChange(nextFile);
      }}
    />
  );
}

describe("ProfilePhotoUpload", () => {
  const createObjectURL = vi.fn();
  const revokeObjectURL = vi.fn();
  let objectUrlCounter = 0;

  beforeEach(() => {
    objectUrlCounter = 0;
    createObjectURL.mockReset();
    revokeObjectURL.mockReset();
    createObjectURL.mockImplementation(() => `blob:test-${++objectUrlCounter}`);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revokeObjectURL,
    });
    cropImageToFileMock.mockReset();
  });

  afterEach(() => {
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: originalRevokeObjectURL,
    });
    vi.restoreAllMocks();
  });

  it("opens an accessible square crop dialog and emits the processed file", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const croppedPhoto = new File(["cropped"], "photo-cropped.jpg", {
      type: "image/jpeg",
    });
    cropImageToFileMock.mockResolvedValue(croppedPhoto);
    const { unmount } = render(<ControlledUpload onChange={onChange} />);

    await user.upload(screen.getByLabelText("Foto Profil"), makePhoto());
    const dialog = screen.getByRole("dialog", { name: "Potong Foto Profil" });

    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("button", { name: "Gunakan Foto" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Perbesar foto"), { target: { value: "2.4" } });
    expect(screen.getByLabelText("Perbesar foto")).toHaveValue("2.4");

    await user.click(screen.getByRole("button", { name: "Tetapkan Area" }));
    await user.click(screen.getByRole("button", { name: "Gunakan Foto" }));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith(croppedPhoto));
    expect(cropImageToFileMock).toHaveBeenCalledWith(
      "blob:test-1",
      { x: 20, y: 30, width: 400, height: 400 },
      "photo.png",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Pratinjau foto profil yang sudah dipotong" }),
    ).toBeInTheDocument();
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-1"));

    unmount();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-2");
  });

  it("cancels with Escape, restores focus, and allows the same file to be selected again", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledUpload onChange={onChange} />);
    const browseButton = screen.getByRole("button", { name: "+ Cari Foto" });
    const input = screen.getByLabelText("Foto Profil");
    const photo = makePhoto();

    browseButton.focus();
    await user.upload(input, photo);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(browseButton).toHaveFocus();
    expect(onChange).not.toHaveBeenCalled();

    await user.upload(input, photo);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(createObjectURL).toHaveBeenCalledTimes(2);
  });

  it("rejects unsupported file types before opening the crop dialog", async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onChange = vi.fn();
    render(<ControlledUpload onChange={onChange} />);

    await user.upload(
      screen.getByLabelText("Foto Profil"),
      new File(["not-an-image"], "profile.pdf", { type: "application/pdf" }),
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Format foto harus PNG, JPG, atau JPEG.");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects a file larger than the configured limit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ControlledUpload onChange={onChange} maxSizeMb={0.000001} />);

    await user.upload(screen.getByLabelText("Foto Profil"), makePhoto());

    expect(screen.getByRole("alert")).toHaveTextContent("Ukuran file maksimal 0.000001 MB.");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows an existing profile photo until a new crop is confirmed", () => {
    render(
      <ControlledUpload
        onChange={vi.fn()}
        existingImageUrl="https://res.cloudinary.com/example/current.jpg"
      />,
    );

    expect(screen.getByRole("img", { name: "Foto profil saat ini" })).toHaveStyle({
      backgroundImage: 'url("https://res.cloudinary.com/example/current.jpg")',
    });
  });
});
