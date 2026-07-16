import { DashboardPageLayout } from "@/components";

import { MaterialsClient } from "./MaterialsClient";
import { GradientTaskTitle } from "../tugas/_components/TaskTypography";

export default function MaterialsPage() {
  return (
    <DashboardPageLayout
      activeItem="materials"
      mainClassName="md:pt-9"
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <GradientTaskTitle>Materi</GradientTaskTitle>
        <MaterialsClient />
      </div>
    </DashboardPageLayout>
  );
}
