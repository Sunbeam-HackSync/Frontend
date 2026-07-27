import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaUsers } from "react-icons/fa";
import { Link } from "react-router";

import Badge from "../../features/workspace/components/Badge";
import PageHeader from "../../features/workspace/components/PageHeader";
import StatCard from "../../features/workspace/components/StatCard";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import { formatDate } from "../../utils/formatters";
import { getDiscoveryFeed } from "../../features/workspace/services/workspaceService";

const filters = ["ALL", "LIVE", "APPROVED", "PENDING_APPROVAL"];

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    async function fetchHackathons() {
      try {
        setLoading(true);
        // Using page=0, size=50 to fetch a bunch of them. We can add actual pagination later.
        const response = await getDiscoveryFeed(0, 50);
        // The API returns PageHackathonDetailResponseDTO which contains `content` array
        setHackathons(response.content || []);
      } catch (err) {
        setError(err.message || "Failed to load hackathons");
      } finally {
        setLoading(false);
      }
    }
    
    fetchHackathons();
  }, []);

  const visibleHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesStatus = status === "ALL" || hackathon.status === status;
      const content = `${hackathon.title || ""} ${hackathon.shortDescription || ""} ${hackathon.tracks?.join(" ") || ""}`.toLowerCase();

      return matchesStatus && content.includes(query.toLowerCase());
    });
  }, [query, hackathons, status]);

  return (
    <section className="py-14">
      <Container>
        <PageHeader
          eyebrow="Hackathon Discovery"
          title="Find the right challenge to build, compete, and learn"
          description="Browse live and upcoming hackathons, inspect timelines, and register to participate."
        />

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

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

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading hackathons...</div>
        ) : visibleHackathons.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No hackathons found matching your criteria.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {visibleHackathons.map((hackathon) => (
              <article
                key={hackathon.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-5 transition hover:border-sky-500/50"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <Badge>{hackathon.status || "UNKNOWN"}</Badge>
                  <span className="text-sm text-slate-400">{hackathon.mode || "ONLINE"}</span>
                </div>

                <h2 className="text-2xl font-bold text-white">{hackathon.title}</h2>
                <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">
                  {hackathon.shortDescription}
                </p>

                <div className="mt-5 grid gap-3 text-sm text-slate-300">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Registration Ends</span>
                    <span>{hackathon.registrationEnd ? formatDate(hackathon.registrationEnd) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Prize Pool</span>
                    <span>{hackathon.prizePool || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Team Size</span>
                    <span>
                      {hackathon.minTeamSize}-{hackathon.maxTeamSize}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {hackathon.tracks?.map((track) => (
                    <Badge key={track} tone="slate">
                      {track}
                    </Badge>
                  ))}
                </div>

                {/* Using hackathon.id instead of slug since API might not return slug */}
                <Link to={`/hackathons/${hackathon.id}`} className="mt-6 block">
                  <Button className="w-full">View Details</Button>
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

