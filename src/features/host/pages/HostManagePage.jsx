// src/features/hackathons/pages/HostManagePage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import {
  getHostHackathonById,
  inviteJudge,
  inviteMentor,
  publishHackathonResults,
} from "../services/hostService";

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  DRAFT:     "bg-amber-900/40 text-amber-300 border-amber-700/40",
  APPROVED:  "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
  REJECTED:  "bg-red-900/40 text-red-300 border-red-700/40",
  PUBLISHED: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
  ACTIVE:    "bg-blue-900/40 text-blue-300 border-blue-700/40",
  COMPLETED: "bg-slate-700/40 text-slate-300 border-slate-600/40",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.DRAFT}`}>
      {status}
    </span>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-xl bg-slate-800" />
      <div className="h-5 w-48 rounded bg-slate-800" />
      <div className="h-40 rounded-2xl bg-slate-900" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-slate-900" />
        <div className="h-48 rounded-2xl bg-slate-900" />
      </div>
    </div>
  );
}

// ─── Invite form ───────────────────────────────────────────────────────────────
function InviteForm({ title, description, onInvite, placeholder = "user@example.com" }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      await onInvite(data.email);
      toast.success(`${title.replace("Invite ", "")} added successfully!`);
      reset();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-5">{description}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          type="email"
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          {...register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email." } })}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Sending..." : "Send Invite"}
        </button>
      </form>
    </div>
  );
}

// ─── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex gap-4 py-2 border-b border-slate-800 last:border-0">
      <span className="min-w-40 text-sm text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-white font-medium">{value || "—"}</span>
    </div>
  );
}

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function HostManagePage() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getHostHackathonById(id);
        setHackathon(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  async function handlePublish() {
    if (!window.confirm("Publish results? This will make the winning results public. This action cannot be undone.")) return;
    setIsPublishing(true);
    try {
      await publishHackathonResults(id);
      toast.success("Results published successfully!");
      setHackathon((prev) => ({ ...prev, hackathonStatus: "PUBLISHED" }));
    } catch (err) {
      toast.error(err.message); // Backend returns "Hackathon results are not yet completed" when judging isn't done
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-white">
      <div className="mx-auto max-w-5xl px-5 md:px-8">

        {/* Back nav */}
        <Link to="/host-dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          ← Back to My Hackathons
        </Link>

        {isLoading ? (
          <Skeleton />
        ) : !hackathon ? (
          <div className="py-20 text-center text-slate-400">Hackathon not found.</div>
        ) : (
          <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={hackathon.hackathonStatus} />
                  <span className="text-xs text-slate-500">ID #{hackathon.id}</span>
                </div>
                <h1 className="text-3xl font-bold text-white">{hackathon.title}</h1>
                <p className="mt-1 text-indigo-300">{hackathon.tagline}</p>
              </div>
              {hackathon.profileImageUrl && (
                <img src={hackathon.profileImageUrl} alt="" className="h-20 w-20 rounded-2xl object-cover border border-slate-700 shrink-0" />
              )}
            </div>

            {/* Banner */}
            {hackathon.bannerImageUrl && (
              <img src={hackathon.bannerImageUrl} alt="Banner" className="w-full h-52 rounded-2xl object-cover border border-slate-800" />
            )}

            {/* Details */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Hackathon Details</h2>
              <DetailRow label="Description" value={hackathon.description} />
              <DetailRow label="Min Team Size" value={hackathon.minTeamSize} />
              <DetailRow label="Max Team Size" value={hackathon.maxTeamSize} />
              <DetailRow label="Registration Opens" value={fmtDate(hackathon.registrationStart)} />
              <DetailRow label="Registration Closes" value={fmtDate(hackathon.registrationEnd)} />
              <DetailRow label="Hackathon Starts" value={fmtDate(hackathon.hackathonStart)} />
              <DetailRow label="Hackathon Ends" value={fmtDate(hackathon.hackathonEnd)} />
            </div>

            {/* Invite judges and mentors */}
            <div className="grid gap-4 md:grid-cols-2">
              <InviteForm
                title="Invite Judge"
                description="Judges evaluate and score participant submissions. Enter their registered email."
                onInvite={(email) => inviteJudge(id, email)}
              />
              <InviteForm
                title="Invite Mentor"
                description="Mentors guide teams and resolve blockers during the hackathon. Enter their registered email."
                onInvite={(email) => inviteMentor(id, email)}
              />
            </div>

            {/* Publish Results */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-bold text-white mb-1">Publish Results</h2>
              <p className="text-sm text-slate-400 mb-5">
                Publishing results makes the winner standings publicly visible. This is only possible once all judges have completed their evaluations and the hackathon status is{" "}
                <span className="text-amber-300 font-semibold">COMPLETED</span>.
              </p>

              {hackathon.hackathonStatus === "COMPLETED" ? (
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isPublishing ? "Publishing..." : "🏆 Publish Results"}
                </button>
              ) : (
                <div className="rounded-xl border border-amber-800/40 bg-amber-900/20 px-5 py-4">
                  <p className="text-sm text-amber-300">
                    ⏳ Results can only be published when the hackathon status is <strong>COMPLETED</strong>.
                    Currently: <strong>{hackathon.hackathonStatus}</strong>.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
