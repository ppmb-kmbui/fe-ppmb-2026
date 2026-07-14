import {
  Button,
  DashboardPageLayout,
  QuotaCard,
  TaskFileUpload,
  TaskSubmissionPanel,
  Textarea,
} from "@/components";
import Link from "next/link";
import { LuCornerUpLeft } from "react-icons/lu";

export default function FosterSiblingsTaskPage() {
  const networkingProgress =  (
    <div className="flex flex-col gap-2">
      <QuotaCard label="Angkatan 26" completed={5} total={10} />
      <QuotaCard label="Angkatan 25" completed={8} total={10} />
      <QuotaCard label="Angkatan 24" completed={10} total={10} />
    </div>
  );
  return (
    <DashboardPageLayout activeItem="tasks">
      <main className="">
        <section id="timeline" className="flex flex-col gap-6">
          <Link href={"/tugas"} className="w-fit">
            <Button className="rounded-full">
              <span className="flex gap-3 max-md:gap-1 font-body max-md:font-xs font-extralight md:px-5">
                <LuCornerUpLeft />
                <span className="max-md:hidden">
                  Back
                  </span>
              </span>
            </Button>
          </Link>
          <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
            <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
              Foster Siblings
            </span>
          </h1>
          <TaskSubmissionPanel title="Deskripsi Tugas">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magni beatae, aliquid repudiandae incidunt distinctio magnam blanditiis dolore natus perspiciatis quam.</p>
            <h3 className="font-subheading text-s5">Upload Dokumentasi</h3>
            <TaskFileUpload fileType="image"  />
            <h3 className="font-subheading text-s5 mt-3">Upload Hasil Foster Siblings</h3>
            <TaskFileUpload fileType="pdf" maxSizeMb={10} />
          </TaskSubmissionPanel>
        </section>
      </main>
    </DashboardPageLayout>
  );
}
