"use client";

import {
  DashboardPageLayout,
  FriendRequestCard,
  MemberCard,
  SearchInput,
  Button,
} from "@/components";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

export default function KalyanamittaPage() {
  const friendRequestData: { name: string; batch: string }[] = [
    {
      name: "Nanda",
      batch: "2024",
    },
    {
      name: "Jaysen",
      batch: "2024",
    },
    {
      name: "Derrick",
      batch: "2024",
    },
    {
      name: "Darrel",
      batch: "2024",
    },
    {
      name: "Matthew",
      batch: "2024",
    },
  ];

  const memberCardData: { name: string; batch: string }[] = [
    {
      name: "Nanda",
      batch: "2024",
    },
    {
      name: "Jaysen",
      batch: "2024",
    },
    {
      name: "Derrick",
      batch: "2024",
    },
    {
      name: "Darrel",
      batch: "2024",
    },
    {
      name: "Matthew",
      batch: "2024",
    },
  ];

  const friendRequest = (
    <div className="space-y-2">
      {friendRequestData.map((data, i) => (
        <FriendRequestCard
          key={`${i}-${data.name}-${data.batch}`}
          name={data.name}
          batch={data.batch}
        />
      ))}
    </div>
  );

  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <DashboardPageLayout
      activeItem="friends"
      rightRail={friendRequest}
      rightRailClassName="max-lg:hidden"
    >
      <main>
        <section id="timeline" className="flex flex-col gap-6">
          <div className="flex flex-wrap w-full justify-between items-center">
            <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
              {requestOpen ? (
                <FaArrowLeft onClick={() => setRequestOpen(false)} />
              ) : (
                <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
                  Kalyanamitta
                </span>
              )}
            </h1>
            <Button
              className="lg:hidden flex-0 max-md:text-sm"
              onClick={() => setRequestOpen(true)}
            >
              Permintaan
            </Button>
          </div>
          {requestOpen ? (
            friendRequest
          ) : (
            <div className="">
              <SearchInput placeholder="Cari Kalyanamitta" />
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {memberCardData.map((data, i) => (
                  <MemberCard
                    key={`${i}-${data.name}-${data.batch}`}
                    name={data.name}
                    batch={data.batch}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </DashboardPageLayout>
  );
}
