"use client";

import { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";

import { MaterialCard } from "@/components";
import { getMaterials, type MaterialCategory } from "@/lib/material-api";

export function MaterialsClient() {
  const [categories, setCategories] = useState<MaterialCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getMaterials()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const hasMaterials = categories.some((category) => category.materials.length > 0);

  if (isLoading) {
    return (
      <p className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85">
        Memuat materi...
      </p>
    );
  }

  if (!hasMaterials) {
    return (
      <section className="rounded-3xl border border-white/10 bg-blue-200/25 p-8">
        <h2 className="font-subheading text-s3 font-semibold">
          Materi belum tersedia
        </h2>
        <p className="mt-3 text-b2 text-foreground/80">
          Materi dari panitia akan muncul di halaman ini setelah dipublikasikan.
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {categories.map((category) =>
        category.materials.length ? (
          <section key={category.id} className="flex flex-col gap-5">
            <h2 className="font-heading text-h3 text-yellow-500">
              {category.name}
            </h2>
            <div className="grid gap-5 lg:grid-cols-2">
              {category.materials.map((material) => (
                <MaterialCard
                  key={material.id}
                  title={material.title}
                  description={material.description ?? "Materi PPMB KMBUI 2026"}
                  href={material.videoUrl ?? undefined}
                  thumbnail={
                    material.thumbnailUrl ? (
                      <span
                        aria-hidden="true"
                        className="block size-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${material.thumbnailUrl})` }}
                      />
                    ) : (
                      <span className="grid size-full place-items-center bg-background">
                        <FaCirclePlay
                          aria-hidden="true"
                          className="size-16 text-yellow-400"
                        />
                      </span>
                    )
                  }
                />
              ))}
            </div>
          </section>
        ) : null,
      )}
    </div>
  );
}
