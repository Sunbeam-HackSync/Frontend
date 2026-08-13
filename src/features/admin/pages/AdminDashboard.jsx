// src/features/admin/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getAdminMetrics, getPendingHackathons, approveHackathon, rejectHackathon, banUser, unbanUser } from "../services/adminService";
import Navbar from "../../../components/layout/Navbar";

// ─── Status badge ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  DRAFT: "bg-amber-900/40 text-amber-300 border border-amber-700/50",
  APPROVED: "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50",
  REJECTED: "bg-red-900/40 text-red-300 border border-red-700/50",
  PUBLISHED: "bg-indigo-900/40 text-indigo-300 border border-indigo-700/50",
  ACTIVE: "bg-blue-900/40 text-blue-300 border border-blue-700/50",
  COMPLETED: "bg-slate-700/40 text-slate-300 border border-slate-600/50",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.DRAFT}`}>
      {status}
    </span>
  );
}

// ─── Skeleton components ───────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 animate-pulse space-y-3">
      <div className="h-4 w-24 rounded bg-slate-800" />
      <div className="h-9 w-16 rounded bg-slate-800" />
      <div className="h-3 w-36 rounded bg-slate-800" />
    </div>
  );
}

function HackathonCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 animate-pulse space-y-3">
      <div className="h-5 w-48 rounded bg-slate-800" />
      <div className="h-4 w-64 rounded bg-slate-800" />
      <div className="h-3 w-full rounded bg-slate-800" />
      <div className="h-3 w-5/6 rounded bg-slate-800" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-slate-800" />
        <div className="h-9 w-24 rounded-lg bg-slate-800" />
      </div>
    </div>
  );
}

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sublabel, colorClass = "text-white" }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm text-slate-400 mb-1">{label}</p>
      <p className={`text-4xl font-bold ${colorClass}`}>{value ?? "—"}</p>
      {sublabel && <p className="mt-1 text-xs text-slate-500">{sublabel}</p>}
    </div>
  );
}

// ─── Format date helper ────────────────────────────────────────────────────────
function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [metrics, setMetrics] = useState(null);
  const [pendingHackathons, setPendingHackathons] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Ban user state
  const [banUserEmail, setBanUserEmail] = useState("");
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);

  async function loadMetrics() {
    try {
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMetrics(false);
    }
  }

  async function loadPending() {
    try {
      const data = await getPendingHackathons();
      setPendingHackathons(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingPending(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMetrics();
     
    loadPending();
   
  }, []);

  async function handleApprove(id) {
    setActionLoadingId(id);
    try {
      await approveHackathon(id);
      toast.success("Hackathon approved!");
      setPendingHackathons((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoadingId(null);
      loadMetrics(); // Refresh metrics after change
    }
  }

  async function handleReject(id) {
    setActionLoadingId(id);
    try {
      await rejectHackathon(id);
      toast.success("Hackathon rejected.");
      setPendingHackathons((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleBanUser() {
    const email = banUserEmail.trim();
    if (!email) {
      toast.error("Please enter a valid user email.");
      return;
    }
    setIsBanning(true);
    try {
      const bannedUser = await banUser(email);
      toast.success(`User ${bannedUser?.email || email} has been banned.`);
      setBanUserEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsBanning(false);
    }
  }

  async function handleUnbanUser() {
    const email = banUserEmail.trim();
    if (!email) {
      toast.error("Please enter a valid user email.");
      return;
    }
    setIsUnbanning(true);
    try {
      const unbannedUser = await unbanUser(email);
      toast.success(`User ${unbannedUser?.email || email} has been unbanned.`);
      setBanUserEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUnbanning(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-7xl px-5 py-10 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-2">Platform Admin</p>
          <h1 className="text-4xl font-bold">Command Center</h1>
          <p className="mt-2 text-slate-400">
            Monitor activity, review hackathons, and moderate the platform.
            {user?.email && <span className="ml-2 text-slate-500">Logged in as {user.email}</span>}
          </p>
        </div>

        {/* ── Metrics ─────────────────────────────────────────── */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {loadingMetrics ? (
            <>
              <StatSkeleton /><StatSkeleton /><StatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Active Hackathons"
                value={metrics?.totalActiveHackathons}
                sublabel="Live or approved events"
                colorClass="text-emerald-400"
              />
              <StatCard
                label="Registered Users"
                value={metrics?.totalRegisteredUsers}
                sublabel="Total platform signups"
                colorClass="text-indigo-400"
              />
              <StatCard
                label="Total Submissions"
                value={metrics?.totalSubmissions}
                sublabel="Platform-wide project submissions"
                colorClass="text-amber-400"
              />
            </>
          )}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">

          {/* ── Hackathon Review Pipeline ────────────────────── */}
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">Review Pipeline</h2>
              {!loadingPending && (
                <span className="rounded-full bg-amber-900/40 border border-amber-700/40 px-3 py-0.5 text-xs font-semibold text-amber-300">
                  {pendingHackathons.length} pending
                </span>
              )}
            </div>

            <div className="space-y-4">
              {loadingPending ? (
                <><HackathonCardSkeleton /><HackathonCardSkeleton /></>
              ) : pendingHackathons.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/50 p-10 text-center">
                  <p className="text-slate-400 text-sm">✅ All clear — no hackathons pending review.</p>
                </div>
              ) : (
                pendingHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-700"
                  >
                    {/* Card header */}
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <StatusBadge status={hackathon.hackathonStatus} />
                          <span className="text-xs text-slate-500">ID #{hackathon.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white truncate">{hackathon.title}</h3>
                        <p className="text-sm text-indigo-300 mt-0.5">{hackathon.tagline}</p>
                      </div>
                      {hackathon.profileImageUrl && (
                        <img
                          src={hackathon.profileImageUrl}
                          alt={hackathon.title}
                          className="h-14 w-14 flex-shrink-0 rounded-xl object-cover border border-slate-700"
                        />
                      )}
                    </div>

                    {/* Description */}
                    <p className="mb-4 text-sm leading-relaxed text-slate-400 line-clamp-2">
                      {hackathon.description}
                    </p>

                    {/* Dates */}
                    <div className="mb-4 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>📋 Reg: {fmtDate(hackathon.registrationStart)} → {fmtDate(hackathon.registrationEnd)}</span>
                      <span>🏆 Event: {fmtDate(hackathon.hackathonStart)} → {fmtDate(hackathon.hackathonEnd)}</span>
                      <span>👥 Team: {hackathon.minTeamSize}–{hackathon.maxTeamSize}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(hackathon.id)}
                        disabled={actionLoadingId === hackathon.id}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        {actionLoadingId === hackathon.id ? "..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(hackathon.id)}
                        disabled={actionLoadingId === hackathon.id}
                        className="rounded-lg border border-red-700/50 bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-900/60 disabled:opacity-50"
                      >
                        {actionLoadingId === hackathon.id ? "..." : "✕ Reject"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Right sidebar ──────────────────────────────────── */}
          <div className="space-y-6">

            {/* Ban/Unban User */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-bold text-white mb-1">Ban/Unban User</h3>
              <p className="text-xs text-slate-400 mb-4">
                Enter a user email to ban or unban them from the platform.
              </p>
              <input
                type="email"
                value={banUserEmail}
                onChange={(e) => setBanUserEmail(e.target.value)}
                placeholder="User Email (e.g. user@example.com)"
                className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500 transition"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBanUser}
                  disabled={isBanning || isUnbanning || !banUserEmail}
                  className="flex-1 rounded-lg bg-red-700/70 border border-red-600/50 px-4 py-2.5 text-sm font-semibold text-red-200 transition hover:bg-red-700 disabled:opacity-50"
                >
                  {isBanning ? "Banning..." : "Ban"}
                </button>
                <button
                  onClick={handleUnbanUser}
                  disabled={isBanning || isUnbanning || !banUserEmail}
                  className="flex-1 rounded-lg bg-emerald-700/70 border border-emerald-600/50 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isUnbanning ? "Unbanning..." : "Unban"}
                </button>
              </div>
            </div>

            {/* Quick stats recap */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="font-bold text-white mb-4">Platform Summary</h3>
              <div className="space-y-3">
                {[
                  ["Pending Review", pendingHackathons.length, "text-amber-400"],
                  ["Active Hackathons", metrics?.totalActiveHackathons ?? "—", "text-emerald-400"],
                  ["Total Users", metrics?.totalRegisteredUsers ?? "—", "text-indigo-400"],
                  ["Total Submissions", metrics?.totalSubmissions ?? "—", "text-white"],
                ].map(([label, value, colorClass]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className={`text-sm font-bold ${colorClass}`}>{loadingMetrics && label !== "Pending Review" ? "..." : value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
