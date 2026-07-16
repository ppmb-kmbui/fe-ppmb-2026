import { FaCirclePlay } from "react-icons/fa6";

export interface VideoLessonCardProps {
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  thumbnailUrl?: string;
}

export function VideoLessonCard({
  title,
  description,
  duration,
  videoUrl,
  thumbnailUrl,
}: VideoLessonCardProps) {
  const thumbnailStyle = thumbnailUrl
    ? {
        backgroundImage: `linear-gradient(rgba(31, 20, 48, 0.18), rgba(31, 20, 48, 0.18)), url(${thumbnailUrl})`,
      }
    : undefined;

  return (
    <article className="flex gap-5 rounded-lg border border-white/10 bg-blue-200/25 p-5">
      <div
        className="grid aspect-video w-44 shrink-0 place-items-center rounded-lg bg-background bg-cover bg-center"
        style={thumbnailStyle}
      >
        <FaCirclePlay className="size-12 text-yellow-400" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
        <p className="text-b3 text-yellow-100">{duration}</p>
        <h2 className="font-subheading text-s3 font-semibold">{title}</h2>
        <p className="text-b2 text-foreground/80">{description}</p>
        {videoUrl && (
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 w-fit text-b2 font-semibold text-yellow-100 underline underline-offset-4"
          >
            Tonton Video
          </a>
        )}
      </div>
    </article>
  );
}
