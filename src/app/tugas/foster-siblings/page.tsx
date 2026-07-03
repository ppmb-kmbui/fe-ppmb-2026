import {
  Button,
  TaskFileUpload,
  TaskSubmissionPanel,
  Textarea,
} from "@/components";
import Link from "next/link";
import { LuCornerUpLeft } from "react-icons/lu";

export default function FosterSiblingsTaskPage() {
  return (
    <main className="">
      <section id="timeline" className="flex flex-col gap-6">
        <Link href={"/tugas"} className="w-fit">
          <Button className="rounded-full" >
            <span className="flex gap-3 font-body font-extralight px-5">
              <LuCornerUpLeft />
              Back
            </span>
          </Button>
        </Link>
        <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
          <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
            Foster Siblings
          </span>
        </h1>
        <TaskSubmissionPanel>
          <Textarea placeholder="Jelaskan apa saja yang didapatkan saat kegiatan..." />
        </TaskSubmissionPanel>
        <TaskSubmissionPanel>
          <TaskFileUpload fileType="pdf" maxSizeMb={10} />
        </TaskSubmissionPanel>
      </section>
    </main>
  );
}
