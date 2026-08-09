// src/features/judge/pages/JudgeDashboardPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getMyAssignedHackathons } from "../services/judgeService";
import { FaGavel } from "react-icons/fa";
import Navbar from "../../../components/layout/Navbar";

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function JudgeHackathonCard({ hackathon }) {
  const navigate = useNavigate();
  const isPending = hackathon.invitationStatus === "INVITED" || hackathon.invitationStatus === "PENDING";
  const isAccepted = hackathon.invitationStatus === "ACCEPTED";
  const isDeclined = hackathon.invitationStatus === "DECLINED" || hackathon.invitationStatus === "REJECTED";

  return (
    <div 
      onClick={() => navigate(`/judge/hackathon/${hackathon.hackathonId}`)}
      className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden transition cursor-pointer hover:border-slate-700 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-1"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
            isPending ? "bg-amber-900/40 text-amber-300 border-amber-700/40" :
            isAccepted ? "bg-emerald-900/40 text-emerald-300 border-emerald-700/40" :
            "bg-red-900/40 text-red-300 border-red-700/40"
          }`}>
            {hackathon.invitationStatus || "UNKNOWN"}
          </span>
          {hackathon.isSuperJudge && (
             <span className="text-xs font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">
               SUPER JUDGE
             </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white line-clamp-1">{hackathon.title || `Hackathon #${hackathon.hackathonId}`}</h3>
        {hackathon.tagline && <p className="mt-1 text-sm text-slate-400 line-clamp-1">{hackathon.tagline}</p>}

        <p className="mt-3 text-xs text-slate-500">
          🗓️ {fmtDate(hackathon.hackathonStarts)} → {fmtDate(hackathon.hackathonEnds)}
        </p>
        
        <div className="mt-2 text-xs text-slate-500">
          Status: {hackathon.hackathonStatus}
        </div>

        {/* Status Text on Card instead of Action Buttons */}
        <div className="mt-auto pt-5 flex gap-2">
          {isPending && (
            <div className="flex-1 text-center py-2 text-xs font-semibold text-amber-500 bg-amber-500/10 rounded-xl border border-amber-500/20">
              Action Required: View Details
            </div>
          )}
          
          {isAccepted && (
            <div className="flex-1 text-center py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              Accepted
            </div>
          )}

          {isDeclined && (
            <div className="flex-1 text-center py-2 text-xs text-slate-500 italic">
              Declined
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JudgeDashboardPage() {
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    try {
      const data = await getMyAssignedHackathons();
      setHackathons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load judge assignments");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  return (
    <>
      <Navbar hideLinks={true} />
      <div className="min-h-screen bg-slate-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky-400 mb-2">
              <FaGavel /> Judge Panel
            </p>
            <h1 className="text-4xl font-bold">My Assignments</h1>
            <p className="mt-2 text-slate-400">Manage your hackathon invitations and judging workspaces.</p>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden animate-pulse"></div>
            ))}
          </div>
        ) : hackathons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/50 py-20 text-center">
            <FaGavel className="mx-auto mb-4 text-slate-600" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No judging assignments yet</h3>
            <p className="text-slate-400 mb-6">You will see hackathons here when organizers invite you to judge.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {hackathons.map((h) => (
              <JudgeHackathonCard key={h.hackathonId} hackathon={h} />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
