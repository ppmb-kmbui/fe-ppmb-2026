import { BackButton } from "@/components";

import { NetworkingProgressClient } from "../_components/NetworkingProgressClient";
import { NetworkingSubmissionRightRail } from "../_components/NetworkingSubmissionRightRail";
import { TaskPageShell } from "../_components/TaskPageShell";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../_components/TaskTypography";

export default function NetworkingTaskPage() {
  return (
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
            Tugas Networking adalah tugas yang bertujuan untuk membangun dan
            memperluas relasi mahasiswa baru angkatan 2026 dengan teman
            seangkatan maupun kakak tingkat.
          </TaskDescription>
          <TaskDescription>
            Tambahkan teman melalui halaman Teman Saya dan tunggu sampai
            permintaan diterima. Setelah terhubung, pilih tombol Networking pada
            kartu teman untuk mengisi jawaban dan foto dokumentasi.
          </TaskDescription>
        </TaskSectionCard>

        <NetworkingProgressClient />
      </div>
    </TaskPageShell>
  );
}
