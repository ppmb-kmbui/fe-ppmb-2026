"use client";

import {
  DashboardPageLayout,
  FriendRequestCard,
  MemberCard,
  SearchInput,
  Button,
} from "@/components";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import {
  getFriends,
  getConnectionRequests,
  sendConnectionRequest,
  getMyConnections,
  acceptConnectionRequest,
  rejectConnectionRequest,
  type FriendUser,
  type ConnectionRequestItem,
} from "@/lib/friend-api";
import { LuCornerUpLeft, LuUser, LuUserPlus } from "react-icons/lu";

export default function KalyanamittaPage() {
  const router = useRouter();
  const [myConnections, setMyConnection] = useState<FriendUser[]>([]);
  const [allFriends, setAllFriends] = useState<FriendUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<ConnectionRequestItem[]>(
    [],
  );
  const [sentRequestIds, setSentRequestIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [friends, connections, connectionRequests] = await Promise.all([
          getFriends(),
          getMyConnections(),
          getConnectionRequests(),
        ]);
        setAllFriends(friends);
        setMyConnection(connections);
        setFriendRequests(connectionRequests?.received ?? []);
      } catch {
        // silently fail — data stays as empty arrays
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const notConnectedFriends = allFriends.filter(
    (f) => f.status === "not_connected",
  );
  const connectedFriends = myConnections;

  const friendRequest = (
    <div className="space-y-2">
      <h1 className="text-h3 font-heading text-yellow-600">
        Permintaan Pertemanan
      </h1>
      {friendRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-b3">Belum ada permintaan pertemanan</p>
        </div>
      ) : (
        friendRequests.map((req) => (
          <FriendRequestCard
            key={`fr-${req.id}`}
            name={req.from?.fullname ?? "Unknown"}
            batch={req.from?.batch ?? "—"}
            onAccept={async () => {
              try {
                await acceptConnectionRequest(req.id);
                setFriendRequests((prev) => prev.filter((r) => r.id !== req.id));
              } catch {
                // silently fail
              }
            }}
            onReject={async () => {
              try {
                await rejectConnectionRequest(req.id);
                setFriendRequests((prev) => prev.filter((r) => r.id !== req.id));
              } catch {
                // silently fail
              }
            }}
          />
        ))
      )}
    </div>
  );

  const [requestOpen, setRequestOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"connected" | "not-connected">(
    "connected",
  );

  const [searchQuery, setSearchQuery] = useState("");

  const displayedFriends = (
    activeTab === "connected" ? connectedFriends : notConnectedFriends
  ).filter((f) =>
    f.fullname?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardPageLayout
      activeItem="friends"
      rightRail={friendRequest}
      rightRailClassName="max-lg:hidden"
    >
      <main className="min-h-screen">
        <section id="timeline" className="flex flex-col gap-6">
          <div className="flex flex-wrap w-full justify-between items-center">
            <h1 className="text-6xl max-lg:text-4xl max-md:text-3xl font-heading">
              {requestOpen ? (
                <Button onClick={() => setRequestOpen(false)}>
                  <LuCornerUpLeft />
                </Button>
              ) : (
                <span className="bg-linear-to-br from-yellow-600 to-purple-600 text-transparent bg-clip-text">
                  Kalyanamitta
                </span>
              )}
            </h1>
            {!requestOpen && (
              <Button
                className="lg:hidden flex-0"
                onClick={() => setRequestOpen(true)}
              >
                <LuUserPlus />
              </Button>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-b3">Memuat data...</span>
            </div>
          ) : requestOpen ? (
            friendRequest
          ) : (
            <div className="">
              <div className="mb-6 flex gap-3 max-md:justify-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("not-connected")}
                  className={`inline-flex h-11 min-w-35 items-center justify-center rounded-2xl px-6 text-b2 transition-colors ${
                    activeTab === "not-connected"
                      ? "bg-purple-300/50"
                      : "bg-[#683592]/25 hover:bg-purple-300/30"
                  }`}
                >
                  Cari Teman
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("connected")}
                  className={`inline-flex h-11 min-w-35 items-center justify-center rounded-2xl px-6 text-b2 transition-colors ${
                    activeTab === "connected"
                      ? "bg-purple-300/50"
                      : "bg-[#683592]/25 hover:bg-purple-300/30"
                  }`}
                >
                  Kenali Teman
                </button>
              </div>
              <SearchInput
                placeholder="Cari Kalyanamitta"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {displayedFriends.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-b3">
                      {activeTab === "connected"
                        ? "Belum ada teman yang terhubung"
                        : "Tidak ada teman yang belum terhubung"}
                    </p>
                  </div>
                ) : (
                  displayedFriends.map((friend) => {
                    const isSent = sentRequestIds.has(friend.id);
                    const avatar = friend.imgUrl ? (
                      <img
                        src={friend.imgUrl}
                        alt={`${friend.fullname}'s Picture`}
                      />
                    ) : (
                      <LuUser />
                    );
                    return (
                      <MemberCard
                        key={`${activeTab}-${friend.id}`}
                        avatar={avatar}
                        name={friend.fullname ?? "Unknown"}
                        batch={friend.batch}
                        actionLabel={
                          activeTab === "connected"
                            ? "Lihat Profil"
                            : isSent
                              ? "Terkirim"
                              : undefined
                        }
                        onAction={
                          activeTab === "connected"
                            ? () => router.push(`/profil/${friend.id}`)
                            : isSent
                              ? undefined
                              : async () => {
                                  await sendConnectionRequest(friend.id);
                                  setSentRequestIds((prev) =>
                                    new Set(prev).add(friend.id),
                                  );
                                }
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </DashboardPageLayout>
  );
}
