import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cropImageToFile,
  ImageCropError,
  PROFILE_PHOTO_QUALITY,
  PROFILE_PHOTO_SIZE,
} from "@/lib/crop-image";

class MockImage extends EventTarget {
  private source = "";

  get src() {
    return this.source;
  }

  set src(value: string) {
    this.source = value;
    queueMicrotask(() => {
      this.dispatchEvent(new Event(value === "broken-image" ? "error" : "load"));
    });
  }
}

describe("cropImageToFile", () => {
  const drawImage = vi.fn();
  const fillRect = vi.fn();
  const context = {
    drawImage,
    fillRect,
    fillStyle: "",
  } as unknown as CanvasRenderingContext2D;

  beforeEach(() => {
    vi.stubGlobal("Image", MockImage);
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context);
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (callback, type, quality) => {
        callback(new Blob([`${type}:${quality}`], { type: type ?? undefined }));
      },
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    drawImage.mockReset();
    fillRect.mockReset();
  });

  it("renders the selected pixels to a 512x512 JPEG file", async () => {
    const result = await cropImageToFile(
      "blob:source",
      { x: 12, y: 24, width: 300, height: 300 },
      "portrait.png",
    );

    expect(result).toBeInstanceOf(File);
    expect(result.name).toBe("portrait-cropped.jpg");
    expect(result.type).toBe("image/jpeg");
    expect(fillRect).toHaveBeenCalledWith(0, 0, PROFILE_PHOTO_SIZE, PROFILE_PHOTO_SIZE);
    expect(drawImage).toHaveBeenCalledWith(
      expect.any(MockImage),
      12,
      24,
      300,
      300,
      0,
      0,
      PROFILE_PHOTO_SIZE,
      PROFILE_PHOTO_SIZE,
    );
    expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      "image/jpeg",
      PROFILE_PHOTO_QUALITY,
    );
  });

  it("rejects invalid crop coordinates before attempting to render", async () => {
    await expect(
      cropImageToFile("blob:source", { x: -1, y: 0, width: 0, height: 10 }, "photo.jpg"),
    ).rejects.toThrow("Area potong foto tidak valid");

    expect(HTMLCanvasElement.prototype.getContext).not.toHaveBeenCalled();
  });

  it("returns a clear error when the selected image cannot be decoded", async () => {
    await expect(
      cropImageToFile(
        "broken-image",
        { x: 0, y: 0, width: 100, height: 100 },
        "broken.jpg",
      ),
    ).rejects.toEqual(expect.any(ImageCropError));
  });

  it("fails safely when the browser cannot create the JPEG blob", async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce((callback) => {
      callback(null);
    });

    await expect(
      cropImageToFile(
        "blob:source",
        { x: 0, y: 0, width: 100, height: 100 },
        "photo.jpg",
      ),
    ).rejects.toThrow("Foto gagal diproses");
  });
});
