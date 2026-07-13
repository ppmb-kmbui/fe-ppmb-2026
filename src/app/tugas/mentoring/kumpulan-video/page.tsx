import { BackButton } from "@/components";

import { committeeVideos } from "../../_components/task-page-data";
import { CommitteeVideosClient } from "../../_components/CommitteeVideosClient";
import { TaskPageShell } from "../../_components/TaskPageShell";
import { TaskRightRail } from "../../_components/TaskRightRail";
import {
  GradientTaskTitle,
  TaskDescription,
  TaskSectionCard,
} from "../../_components/TaskTypography";

export default function CommitteeVideoCollectionPage() {
  return (
    <TaskPageShell
      rightRail={
        <TaskRightRail
          title="Video Panitia"
          showCalendar={false}
          progress={{
            label: "Video Ditonton : 0",
            completed: 0,
            total: committeeVideos.length,
          }}
          agenda={[
            {
              category: "Mentoring",
              title: "Tugas Vlog",
              date: "13 Juni",
            },
          ]}
        />
      }
      withConstellation
    >
      <div className="flex max-w-[958px] flex-col gap-8">
        <BackButton href="/tugas/mentoring" />
        <GradientTaskTitle>Kumpulan Video dari Panitia</GradientTaskTitle>

        <TaskSectionCard>
          <TaskDescription />
          <CommitteeVideosClient />
        </TaskSectionCard>
      </div>
    </TaskPageShell>
  );
}
