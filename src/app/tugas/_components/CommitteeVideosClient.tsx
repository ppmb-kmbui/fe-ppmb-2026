"use client";

import { useEffect, useState } from "react";

import {
  getCommitteeVideos,
  getTaskApiErrorMessage,
  type CommitteeVideo,
} from "@/lib/task-api";

import { VideoLessonCard } from "./VideoLessonCard";

export function CommitteeVideosClient() {
  const [videos, setVideos] = useState<CommitteeVideo[]>([]);
  const [statusMessage, setStatusMessage] = useState("Memuat video panitia...");

  useEffect(() => {
    let active = true;

    getCommitteeVideos()
      .then((category) => {
        if (!active) return;
        setVideos(category?.materials ?? []);
        setStatusMessage("");
      })
      .catch((error: unknown) => {
        if (!active) return;
        setStatusMessage(
          getTaskApiErrorMessage(error) || "Gagal memuat video panitia.",
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const displayedVideos = videos.length
    ? videos.map((video) => ({
        title: video.title,
        description: video.description ?? "Materi video dari panitia PPMB.",
        duration: "Video Panitia",
        videoUrl: video.videoUrl ?? undefined,
        thumbnailUrl: video.thumbnailUrl ?? undefined,
      }))
    : [];

  return (
    <div className="flex flex-col gap-4">
      {statusMessage && (
        <p className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85">
          {statusMessage}
        </p>
      )}

      {!statusMessage && displayedVideos.length === 0 && (
        <p className="rounded-2xl border border-white/10 bg-blue-200/20 px-4 py-3 text-b2 text-foreground/85">
          Belum ada video panitia yang dipublikasikan.
        </p>
      )}

      {displayedVideos.map((video) => (
        <VideoLessonCard key={video.title} {...video} />
      ))}
    </div>
  );
}
