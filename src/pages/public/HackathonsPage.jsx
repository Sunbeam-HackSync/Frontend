import { useMemo, useState } from "react";

import { FaSearch, FaUsers } from "react-icons/fa";
import { Link } from "react-router";

import Badge from "../../components/dashboard/Badge";
import PageHeader from "../../components/dashboard/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import useDemoData from "../../hooks/useDemoData";
import { formatDate } from "../../utils/formatters";

const filters = ["ALL", "LIVE", "APPROVED", "PENDING_APPROVAL"];

export default function HackathonsPage() {
  const { state } = useDemoData();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  const visibleHackathons = useMemo(() => {
    return state.hackathons.filter((hackathon) => {
      const matchesStatus = status === "ALL" || hackathon.status === status;
      const content = `${hackathon.title} ${hackathon.shortDescription} ${hackathon.tracks.join(
        " ",
      )}`.toLowerCase();

      return matchesStatus && content.includes(query.toLowerCase());
    });
  }, [query, state.hackathons, status]);

  return (
    <section className="py-14">
      <Container>
        <PageHeader
          eyebrow="Hackathon Discovery"
          title="Find the right challenge to build, compete, and learn"
          description="Browse live and upcoming hackathons, inspect timelines, and register with dummy data that behaves like a real frontend."
        />

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Listed Hackathons"
            value={state.hackathons.length}
            helper="Across live, approved, and pending events"
          />
          <StatCard
            label="Registered Users"
            value={state.users.length}
            helper="Seeded demo accounts plus new signups"
            icon={FaUsers}
          />
          <StatCard
            label="Submitted Projects"
            value={state.submissions.length}
            helper="Available for organizer and judge review"
          />
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900/50 p-4 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3">
            <FaSearch className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title, track, or description"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatus(filter)}
                className={`
                  rounded-lg
                  border
                  px-4
                  py-2
                  text-sm
                  font-semibold
                  transition
                  ${
                    status === filter
                      ? "border-sky-400 bg-sky-500/10 text-sky-200"
                      : "border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                  }
                `}
              >
                {filter.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {visibleHackathons.map((hackathon) => (
            <article
              key={hackathon.id}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 transition hover:border-sky-500/50"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <Badge>{hackathon.status}</Badge>
                <span className="text-sm text-slate-400">{hackathon.mode}</span>
              </div>

              <h2 className="text-2xl font-bold text-white">{hackathon.title}</h2>
              <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                {hackathon.shortDescription}
              </p>

              <div className="mt-5 grid gap-3 text-sm text-slate-300">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Registration Ends</span>
                  <span>{formatDate(hackathon.registrationEnd)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Prize Pool</span>
                  <span>{hackathon.prizePool}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Team Size</span>
                  <span>
                    {hackathon.minTeamSize}-{hackathon.maxTeamSize}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {hackathon.tracks.map((track) => (
                  <Badge key={track} tone="slate">
                    {track}
                  </Badge>
                ))}
              </div>

              <Link to={`/hackathons/${hackathon.slug}`} className="mt-6 block">
                <Button className="w-full">View Details</Button>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
