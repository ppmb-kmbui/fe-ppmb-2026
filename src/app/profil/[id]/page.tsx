import { notFound } from "next/navigation";

import { PublicProfileClient } from "./PublicProfileClient";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  return <PublicProfileClient id={parsedId} />;
}
