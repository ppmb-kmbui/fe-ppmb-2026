"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { LuCornerUpLeft, LuUser, LuUserPlus } from "react-icons/lu";

import {
  Button,
  DashboardPageLayout,
  FriendRequestCard,
  MemberCard,
  SearchInput,
} from "@/components";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getFriendsPage,
  getMyConnections,
  rejectConnectionRequest,
  sendConnectionRequest,
  type ConnectionRequestItem,
  type FriendUser,
} from "@/lib/friend-api";
import { isNetworkingTargetBatch } from "@/app/tugas/_components/networking-requirements";

function getFriendActionErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) return error.message;

  return "Aksi Kalyanamitta gagal. Coba lagi beberapa saat lagi.";
}

const toastDurationMs = 3000;
const friendsPerPage = 8;

function KalyanamittaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [myConnections, setMyConnection] = useState<FriendUser[]>([]);
  const [allFriends, setAllFriends] = useState<FriendUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<ConnectionRequestItem[]>(
    [],
  );
  const [sentRequestIds, setSentRequestIds] = useState<Set<number>>(new Set());
  const [processingRequestIds, setProcessingRequestIds] = useState<Set<number>>(
    new Set(),
  );
  const [processingFriendIds, setProcessingFriendIds] = useState<Set<number>>(
    new Set(),
  );
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"connected" | "not-connected">(
    searchParams.get("tab") === "connected" ? "connected" : "not-connected",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsTotalPages, setFriendsTotalPages] = useState(1);
  const [friendsTotal, setFriendsTotal] = useState(0);
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);

  const refreshKalyanamittaData = useCallback(async () => {
    const [connections, connectionRequests] = await Promise.all([
      getMyConnections(),
      getConnectionRequests(),
    ]);
    const pendingReceived = (connectionRequests?.received ?? []).filter(
      (request) => request.status === "pending",
    );
    const pendingSentIds = new Set(
      (connectionRequests?.sent ?? [])
        .filter((request) => request.status === "pending")
        .map((request) => request.toId),
    );

    setMyConnection(connections);
    setFriendRequests(pendingReceived);
    setSentRequestIds(pendingSentIds);
  }, []);

  const refreshKalyanamittaDataSilently = useCallback(() => {
    void refreshKalyanamittaData().catch(() => undefined);
  }, [refreshKalyanamittaData]);

  const loadFriendCandidates = useCallback(async () => {
    setIsFriendsLoading(true);
    setActionError("");

    try {
      const { friends, pagination } = await getFriendsPage({
        name: debouncedSearchQuery,
        page: friendsPage,
        limit: friendsPerPage,
      });

      setAllFriends(friends);
      setFriendsTotalPages(Math.max(1, pagination.totalPages));
      setFriendsTotal(pagination.total);
    } catch (error) {
      setActionError(getFriendActionErrorMessage(error));
    } finally {
      setIsFriendsLoading(false);
    }
  }, [debouncedSearchQuery, friendsPage]);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setActionError("");

      try {
        await refreshKalyanamittaData();
      } catch (error) {
        if (active) setActionError(getFriendActionErrorMessage(error));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [refreshKalyanamittaData]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setFriendsPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    if (activeTab !== "not-connected") return;

    const timeout = setTimeout(() => {
      void loadFriendCandidates();
    }, 0);

    return () => clearTimeout(timeout);
  }, [activeTab, loadFriendCandidates]);

  useEffect(() => {
    if (!statusMessage && !actionError) return;

    const timeout = setTimeout(() => {
      setStatusMessage("");
      setActionError("");
    }, toastDurationMs);

    return () => clearTimeout(timeout);
  }, [statusMessage, actionError]);

  const notConnectedFriends = useMemo(
    () =>
      allFriends.filter(
        (friend) =>
          friend.status === "not_connected" ||
          friend.status === "menunggu_konfirmasi",
      ),
    [allFriends],
  );
  const displayedFriends = useMemo(
    () =>
      (activeTab === "connected" ? myConnections : notConnectedFriends).filter(
        (friend) =>
          friend.fullname?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [activeTab, myConnections, notConnectedFriends, searchQuery],
  );

  async function handleSendRequest(friendId: number) {
    setProcessingFriendIds((prev) => new Set(prev).add(friendId));
    setActionError("");
    setStatusMessage("");

    try {
      await sendConnectionRequest(friendId);
      setSentRequestIds((prev) => new Set(prev).add(friendId));
      setAllFriends((prev) =>
        prev.map((friend) =>
          friend.id === friendId
            ? { ...friend, status: "menunggu_konfirmasi" }
            : friend,
        ),
      );
      setStatusMessage("Permintaan pertemanan berhasil dikirim.");
      refreshKalyanamittaDataSilently();
    } catch (error) {
      setActionError(getFriendActionErrorMessage(error));
    } finally {
      setProcessingFriendIds((prev) => {
        const next = new Set(prev);
        next.delete(friendId);
        return next;
      });
    }
  }

  async function handleAcceptRequest(request: ConnectionRequestItem) {
    setProcessingRequestIds((prev) => new Set(prev).add(request.id));
    setActionError("");
    setStatusMessage("");

    try {
      await acceptConnectionRequest(request.fromId);
      setFriendRequests((prev) =>
        prev.filter((item) => item.id !== request.id),
      );
      const requester = request.from;
      if (requester) {
        setMyConnection((prev) =>
          prev.some((friend) => friend.id === requester.id)
            ? prev
            : [{ ...requester, status: "connected" }, ...prev],
        );
      }
      setStatusMessage("Permintaan pertemanan berhasil diterima.");
      refreshKalyanamittaDataSilently();
    } catch (error) {
      setActionError(getFriendActionErrorMessage(error));
    } finally {
      setProcessingRequestIds((prev) => {
        const next = new Set(prev);
        next.delete(request.id);
        return next;
      });
    }
  }

  async function handleRejectRequest(request: ConnectionRequestItem) {
    setProcessingRequestIds((prev) => new Set(prev).add(request.id));
    setActionError("");
    setStatusMessage("");

    try {
      await rejectConnectionRequest(request.fromId);
      setFriendRequests((prev) =>
        prev.filter((item) => item.id !== request.id),
      );
      setStatusMessage("Permintaan pertemanan berhasil ditolak.");
      refreshKalyanamittaDataSilently();
    } catch (error) {
      setActionError(getFriendActionErrorMessage(error));
    } finally {
      setProcessingRequestIds((prev) => {
        const next = new Set(prev);
        next.delete(request.id);
        return next;
      });
    }
  }

  const friendRequest = (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-h3 font-heading text-yellow-600">
          Permintaan Pertemanan
        </h1>
        {friendRequests.length > 0 && (
          <span className="rounded-full bg-purple-600 px-3 py-1 text-b3 text-yellow-50">
            {friendRequests.length}
          </span>
        )}
      </div>

      {friendRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-b3">Belum ada permintaan pertemanan</p>
        </div>
      ) : (
        friendRequests.map((request) => (
          <FriendRequestCard
            key={`request-${request.id}`}
            name={request.from?.fullname ?? "Nama tidak diketahui"}
            avatar={
              request.from?.imgUrl ? (
                <Image
                  src={request.from.imgUrl}
                  alt={`Foto ${request.from.fullname ?? "pengguna"}`}
                  width={134}
                  height={91}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <LuUser aria-hidden="true" className="size-10" />
              )
            }
            batch={request.from?.batch ?? "-"}
            isLoading={processingRequestIds.has(request.id)}
            onAccept={() => handleAcceptRequest(request)}
            onReject={() => handleRejectRequest(request)}
          />
        ))
      )}
    </div>
  );

  return (
    <DashboardPageLayout
      activeItem="friends"
      rightRail={friendRequest}
      rightRailClassName="max-lg:hidden"
    >
      {(statusMessage || actionError) && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 z-[100] w-[min(calc(100vw-2rem),420px)] -translate-x-1/2 md:bottom-auto md:left-auto md:right-6 md:top-6 md:translate-x-0"
        >
          <p
            className={`rounded-2xl border px-5 py-4 text-b2 shadow-modal backdrop-blur-glass ${
              actionError
                ? "border-red-300/40 bg-red-500/20 text-red-50"
                : "border-green-300/40 bg-green-500/20 text-green-50"
            }`}
          >
            {actionError || statusMessage}
          </p>
        </div>
      )}

      <main className="min-h-screen">
        <section id="timeline" className="flex flex-col gap-6">
          <div className="flex w-full flex-wrap items-center justify-between">
            <h1 className="text-6xl font-heading max-lg:text-4xl max-md:text-3xl">
              {requestOpen ? (
                <Button onClick={() => setRequestOpen(false)}>
                  <LuCornerUpLeft />
                </Button>
              ) : (
                <span className="bg-linear-to-br from-yellow-600 to-purple-600 bg-clip-text text-transparent">
                  Kalyanamitta
                </span>
              )}
            </h1>
            {!requestOpen && (
              <Button
                className="flex-0 relative lg:hidden"
                onClick={() => setRequestOpen(true)}
              >
                <LuUserPlus />
                {friendRequests.length > 0 && (
                  <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-red-500 text-b3 text-white">
                    {friendRequests.length}
                  </span>
                )}
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
            <div>
              <div className="mb-6 flex gap-3 max-md:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("not-connected");
                    setFriendsPage(1);
                  }}
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
                  Teman Saya
                </button>
              </div>

              <SearchInput
                placeholder="Cari Kalyanamitta"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {activeTab === "not-connected" && isFriendsLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-b3">Memuat kandidat teman...</p>
                  </div>
                ) : displayedFriends.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
                    <p className="text-b3">
                      {activeTab === "connected"
                        ? "Belum ada teman yang terhubung"
                        : "Tidak ada teman yang belum terhubung"}
                    </p>
                  </div>
                ) : (
                  displayedFriends.map((friend) => {
                    const isSent =
                      sentRequestIds.has(friend.id) ||
                      friend.status === "menunggu_konfirmasi";
                    const isProcessing = processingFriendIds.has(friend.id);
                    const canDoNetworking =
                      activeTab === "connected" &&
                      isNetworkingTargetBatch(friend.batch);
                    const avatar = friend.imgUrl ? (
                      <Image
                        src={friend.imgUrl}
                        alt={`Foto ${friend.fullname ?? "pengguna"}`}
                        width={132}
                        height={132}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <LuUser aria-hidden="true" className="size-10" />
                    );

                    return (
                      <MemberCard
                        key={`${activeTab}-${friend.id}`}
                        avatar={avatar}
                        name={friend.fullname ?? "Nama tidak diketahui"}
                        batch={friend.batch}
                        actionLabel={
                          activeTab === "connected"
                            ? "Lihat Profil"
                            : isSent
                              ? "Terkirim"
                              : undefined
                        }
                        isActionLoading={isProcessing}
                        isActionDisabled={activeTab !== "connected" && isSent}
                        onAction={
                          activeTab === "connected"
                            ? () => router.push(`/profil/${friend.id}`)
                            : isSent
                              ? undefined
                              : () => handleSendRequest(friend.id)
                        }
                        secondaryActionLabel={
                          canDoNetworking ? "Networking" : undefined
                        }
                        onSecondaryAction={
                          canDoNetworking
                            ? () => router.push(`/tugas/networking/${friend.id}`)
                            : undefined
                        }
                      />
                    );
                  })
                )}
              </div>

              {activeTab === "not-connected" &&
                !isFriendsLoading &&
                displayedFriends.length > 0 && (
                  <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-purple-900/20 px-4 py-3 text-b3 sm:flex-row">
                    <p>
                      Menampilkan {displayedFriends.length} dari {friendsTotal} kandidat
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled={friendsPage <= 1}
                        onClick={() =>
                          setFriendsPage((current) => Math.max(1, current - 1))
                        }
                        className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Sebelumnya
                      </button>
                      <span>
                        {friendsPage} / {friendsTotalPages}
                      </span>
                      <button
                        type="button"
                        disabled={friendsPage >= friendsTotalPages}
                        onClick={() =>
                          setFriendsPage((current) =>
                            Math.min(friendsTotalPages, current + 1),
                          )
                        }
                        className="rounded-xl bg-purple-300/40 px-4 py-2 transition-colors hover:bg-purple-300/60 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Berikutnya
                      </button>
                    </div>
                  </div>
                )}
            </div>
          )}
        </section>
      </main>
    </DashboardPageLayout>
  );
}

export default function KalyanamittaPage() {
  return (
    <Suspense
      fallback={
        <DashboardPageLayout activeItem="friends" rightRail={null}>
          <div className="flex min-h-screen items-center justify-center">
            <p className="text-b3">Memuat Kalyanamitta...</p>
          </div>
        </DashboardPageLayout>
      }
    >
      <KalyanamittaContent />
    </Suspense>
  );
}
