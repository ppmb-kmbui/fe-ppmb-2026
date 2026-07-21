import { BackButton } from "@/components";

import { NetworkingProgressClient } from "../_components/NetworkingProgressClient";
import { NetworkingAccessGate } from "../_components/NetworkingAccessGate";
import { NetworkingSubmissionRightRail } from "../_components/NetworkingSubmissionRightRail";
import { TaskPageShell } from "../_components/TaskPageShell";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function NetworkingTaskPage() {
  return (
    <NetworkingAccessGate>
      <TaskPageShell
        rightRail={<NetworkingSubmissionRightRail />}
        mobileRailLabel="Progres"
        withConstellation
      >
        <div className="flex max-w-[958px] flex-col gap-8">
          <BackButton href="/tugas" />
          <GradientTaskTitle>Networking</GradientTaskTitle>

          <TaskSectionCard>
            <TaskDescription>
              Tugas Networking bertujuan membangun dan memperluas relasi
              mahasiswa baru angkatan 2026 dengan teman seangkatan maupun kakak
              tingkat.
            </TaskDescription>
            <TaskDescription>
              Untuk teman angkatan 2026, kirim permintaan pertemanan dan tunggu
              sampai diterima sebelum mengisi Networking. Untuk kakak tingkat
              angkatan 2023, 2024, dan 2025, pilih tombol Networking secara
              langsung tanpa menambahkan teman terlebih dahulu.
            </TaskDescription>
          </TaskSectionCard>

          <NetworkingProgressClient />
        </div>
      </TaskPageShell>
    </NetworkingAccessGate>
  );
}
