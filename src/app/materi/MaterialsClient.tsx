"use client";

import { FaBookOpen } from "react-icons/fa6";

import { MaterialCard } from "@/components";

const canvaMaterialPublishAt = new Date("2026-08-08T00:00:00+07:00");
const canvaMaterialUrl = "https://canva.link/nuefu6dbmlumfg7";

function isCanvaMaterialPublished() {
  return Date.now() >= canvaMaterialPublishAt.getTime();
}

export function MaterialsClient() {
  const canvaPublished = isCanvaMaterialPublished();

  return (
    <section className="flex flex-col gap-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <MaterialCard
          title="Materi Mentoring"
          description={
            canvaPublished
              ? "Materi ini sudah tersedia. Klik kartu ini untuk membuka materi."
              : "Materi ini akan di publikasikan pada 8 Agustus"
          }
          descriptionClassName={
            canvaPublished
              ? "text-green-200"
              : "rounded-xl border border-yellow-400/35 bg-yellow-400/15 px-3 py-2 font-subheading text-yellow-200"
          }
          href={canvaPublished ? canvaMaterialUrl : undefined}
          icon={<FaBookOpen className="size-4" />}
          thumbnail={
            <span
              aria-hidden="true"
              className="relative flex size-full overflow-hidden bg-[radial-gradient(circle_at_20%_15%,rgba(255,226,122,0.95),transparent_26%),radial-gradient(circle_at_82%_22%,rgba(126,68,255,0.75),transparent_30%),linear-gradient(135deg,#223f75_0%,#4a2b8c_52%,#16072d_100%)] p-6"
            >
              <span className="absolute -left-8 top-10 size-32 rounded-full border border-white/25" />
              <span className="absolute -right-10 bottom-5 size-40 rounded-full bg-white/10 blur-sm" />
              <span className="relative mt-auto flex flex-col">
                <span className="font-heading text-h3 leading-none text-yellow-500">
                  Materi
                </span>
                <span className="font-heading text-h3 leading-none text-white">
                  Mentoring
                </span>
                <span className="mt-3 w-fit rounded-full bg-white/15 px-4 py-1 font-subheading text-b3 text-white/90">
                  Materi Canva
                </span>
              </span>
            </span>
          }
        />
      </div>
    </section>
  );
}
