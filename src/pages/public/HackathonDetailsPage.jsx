// src/pages/public/HackathonDetailsPage.jsx

import { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaQuestionCircle, FaGavel, FaInfoCircle } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import Badge from "../../features/workspace/components/Badge";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import { formatDateTime } from "../../utils/formatters";
import { getParticipantHackathonById } from "../../features/workspace/services/workspaceService";

export default function HackathonDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, platformRoles } = useSelector((state) => state.auth);

  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHackathon() {
      try {
        setLoading(true);
        const data = await getParticipantHackathonById(id);
        setHackathon(data);
      } catch (err) {
        setError("Failed to load hackathon details.");
      } finally {
        setLoading(false);
      }
    }
    fetchHackathon();
  }, [id]);

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 pt-24 pb-14">
        <Container>
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-slate-400 font-medium animate-pulse">Loading hackathon details...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error || !hackathon) {
    return (
      <section className="min-h-screen bg-slate-950 pt-24 pb-14 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 opacity-50 block">⚠️</span>
          <h2 className="text-2xl font-bold text-white mb-2">Hackathon not found</h2>
          <p className="text-red-400 mb-6">{error}</p>
          <Link to="/hackathons">
            <Button className="bg-indigo-600 hover:bg-indigo-500">Back to Discovery</Button>
          </Link>
        </div>
      </section>
    );
  }

  // Determine the correct CTA based on role
  function getWorkspaceLink() {
    if (!isAuthenticated) return null;
    if (platformRoles?.includes("PARTICIPANT")) return `/workspace/${hackathon.id}/team`;
    return `/workspace/${hackathon.id}/overview`;
  }

  const deadlinePassed = hackathon.registrationEnd ? new Date(hackathon.registrationEnd) < new Date() : false;
  const workspaceLink = getWorkspaceLink();

  return (
    <section className="min-h-screen bg-slate-950 pb-20">
      {/* Hero Banner Section */}
      <div className="relative h-[250px] md:h-[300px] bg-slate-900 overflow-hidden">
        {hackathon.bannerImageUrl && (
          <img
            src={hackathon.bannerImageUrl}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

        <Container className="relative h-full flex flex-col justify-end pb-8 z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-5">
            {hackathon.profileImageUrl ? (
              <img
                src={hackathon.profileImageUrl}
                alt="Profile"
                className="h-20 w-20 md:h-28 md:w-28 rounded-2xl object-cover border-4 border-slate-950 shadow-2xl bg-slate-800 shrink-0"
              />
            ) : (
              <div className="h-20 w-20 md:h-28 md:w-28 rounded-2xl border-4 border-slate-950 shadow-2xl bg-slate-800 flex items-center justify-center text-3xl shrink-0">🏆</div>
            )}
            <div className="flex flex-col pb-1">
              <div className="mb-2">
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                  {hackathon.hackathonStatus === 'ACTIVE' ? 'LIVE' : (hackathon.hackathonStatus === 'APPROVED' ? 'YET TO COME' : hackathon.hackathonStatus || 'UNKNOWN')}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-md mb-1">
                {hackathon.title}
              </h1>
              <p className="text-base md:text-lg text-indigo-200 font-medium max-w-3xl drop-shadow-sm">
                {hackathon.tagline}
              </p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-colors">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-indigo-500" /> About Hackathon
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm md:text-base">
                <p className="whitespace-pre-wrap">{hackathon.description}</p>
              </div>
            </div>

            {/* Rules */}
            {hackathon.rules && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaGavel className="text-rose-400" /> Rules & Requirements
                </h2>
                <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4 text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {hackathon.rules}
                </div>
              </div>
            )}

            {/* FAQ */}
            {hackathon.faq && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-colors">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaQuestionCircle className="text-teal-400" /> Frequently Asked Questions
                </h2>
                <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4 text-slate-300 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {hackathon.faq}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* CTA Card */}
            <div className="bg-gradient-to-b from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500" />

              <div className="text-center mb-6 relative z-10">
                <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Team Size</p>
                <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                  <FaUsers className="text-indigo-400" /> {hackathon.minTeamSize} - {hackathon.maxTeamSize}
                </div>
                <p className="text-xs text-slate-500 mt-1">Members per team</p>
              </div>

              <div className="relative z-10">
                {workspaceLink ? (
                  <Link to={workspaceLink} className="block">
                    {platformRoles?.includes("PARTICIPANT") &&
                      <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02]">
                        Join Hackathons
                      </Button>
                    }
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base rounded-lg shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:bg-slate-700"
                      disabled={deadlinePassed}
                      onClick={() => navigate("/login")}
                    >
                      {deadlinePassed ? "Registration Closed" : "Log In to Participate"}
                    </Button>
                    {!deadlinePassed && (
                      <p className="text-center text-xs text-slate-400 font-medium">Create an account or login to join.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                <FaCalendarAlt className="text-sky-400" /> Key Dates
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-slate-700 before:to-transparent">

                {[
                  { label: "Registration Opens", date: hackathon.registrationStart, color: "text-emerald-400", dot: "bg-emerald-500" },
                  { label: "Registration Closes", date: hackathon.registrationEnd, color: "text-rose-400", dot: "bg-rose-500" },
                  { label: "Hackathon Starts", date: hackathon.hackathonStart, color: "text-indigo-400", dot: "bg-indigo-500" },
                  { label: "Hackathon Ends", date: hackathon.hackathonEnd, color: "text-orange-400", dot: "bg-orange-500" },
                  { label: "Result Declaration", date: hackathon.resultDeclarationDate, color: "text-amber-400", dot: "bg-amber-500" }
                ].map((item, index) => (
                  <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className={`flex items-center justify-center w-4 h-4 rounded-full border-[3px] border-slate-900 ${item.dot} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 z-10`}></div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] ml-10 md:ml-0 p-4 rounded-2xl border border-slate-800 bg-slate-900/80 shadow transition-all hover:border-slate-700 hover:bg-slate-800 hover:-translate-y-1">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">{item.label}</span>
                        <span className={`text-sm font-bold ${item.color}`}>
                          {item.date ? formatDateTime(item.date) : "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
