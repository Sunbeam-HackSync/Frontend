// src/pages/public/HackathonsPage.jsx

import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useSearchParams } from "react-router";

import Badge from "../../features/workspace/components/Badge";
import PageHeader from "../../features/workspace/components/PageHeader";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import { formatDate } from "../../utils/formatters";
import { getDiscoveryFeed } from "../../features/workspace/services/workspaceService";

const filters = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "LIVE" },
  { value: "APPROVED", label: "YET TO COME" }
];

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state (sync with URL query params)
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);
  const [totalPages, setTotalPages] = useState(1);

  const setPage = (newPage) => {
    setSearchParams(prev => {
      prev.set("page", newPage);
      prev.set("size", size);
      return prev;
    });
  };

  const setSize = (newSize) => {
    setSearchParams(prev => {
      prev.set("page", "0");
      prev.set("size", newSize);
      return prev;
    });
  };

  // Search and filter state
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    async function fetchHackathons() {
      try {
        setLoading(true);
        const response = await getDiscoveryFeed(page, size);
        setHackathons(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to load hackathons");
      } finally {
        setLoading(false);
      }
    }
    fetchHackathons();
  }, [page, size]);

  // Frontend search over the currently fetched page (as requested)
  const visibleHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesStatus = status === "ALL" || hackathon.hackathonStatus === status;
      const contentStr = `${hackathon.title || ""} ${hackathon.tagline || ""} ${hackathon.description || ""}`.toLowerCase();
      const matchesSearch = contentStr.includes(debouncedQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [debouncedQuery, hackathons, status]);

  return (
    <section className="py-14 bg-slate-950 min-h-screen">
      <Container>
        <PageHeader
          eyebrow="HACKATHON DISCOVERY"
          title="Find the right challenge to build, compete, and learn"
          description="Browse live and upcoming hackathons, inspect timelines, and register to participate."
        />

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 p-4 text-red-400 border border-red-500/20">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:flex-row md:items-center shadow-lg">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 focus-within:border-indigo-500 transition-colors">
            <FaSearch className="text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tagline, or description..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`
                  rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all
                  ${status === filter.value
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600 hover:text-white"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(size)].map((_, i) => (
              <article
                key={`skeleton-${i}`}
                className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden"
              >
                {/* Banner Skeleton */}
                <div className="relative h-48 bg-slate-800/50 animate-pulse">
                  {/* Status Badge Skeleton */}
                  <div className="absolute top-4 right-4 h-6 w-20 rounded-full bg-slate-700/50" />
                  {/* Profile Image Skeleton */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-20 rounded-xl bg-slate-800 border-4 border-slate-900 shadow-xl" />
                </div>

                {/* Body Skeleton */}
                <div className="flex flex-col flex-1 p-6 pt-14 text-center animate-pulse">
                  {/* Title Skeleton */}
                  <div className="mx-auto h-6 w-3/4 rounded bg-slate-800 mb-3" />
                  {/* Tagline Skeleton */}
                  <div className="mx-auto h-4 w-1/2 rounded bg-indigo-900/30 mb-6" />

                  {/* Description Skeleton */}
                  <div className="space-y-2 mb-8">
                    <div className="h-3 w-full rounded bg-slate-800/50" />
                    <div className="h-3 w-5/6 mx-auto rounded bg-slate-800/50" />
                    <div className="h-3 w-4/6 mx-auto rounded bg-slate-800/50" />
                  </div>

                  {/* Dates & Size Skeleton */}
                  <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800/30 rounded-xl p-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-16 rounded bg-slate-700/50 mb-2" />
                      <div className="h-4 w-20 rounded bg-slate-800" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-16 rounded bg-slate-700/50 mb-2" />
                      <div className="h-4 w-24 rounded bg-slate-800" />
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="mt-auto h-12 w-full rounded-xl bg-slate-800" />
                </div>
              </article>
            ))}
          </div>
        ) : visibleHackathons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
            <span className="text-5xl mb-4 opacity-50">🔍</span>
            <h3 className="text-xl font-bold text-white mb-2">No hackathons found</h3>
            <p className="text-slate-400">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleHackathons.map((hackathon) => (
                <article
                  key={hackathon.id}
                  className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10"
                >
                  {/* Banner Area */}
                  <div className="relative h-48">
                    {/* Inner container for banner image (with overflow-hidden for scale effect) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 overflow-hidden">
                      {hackathon.bannerImageUrl ? (
                        <img
                          src={hackathon.bannerImageUrl}
                          alt="Banner"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl opacity-10">🏆</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-slate-950/80 backdrop-blur-md text-[10px] font-bold tracking-widest uppercase text-white px-3 py-1.5 rounded-full border border-slate-700/50">
                        {hackathon.hackathonStatus}
                      </span>
                    </div>

                    {/* Profile Image (Overlapping) */}
                    {hackathon.profileImageUrl && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 h-20 w-20 rounded-xl overflow-hidden border-4 border-slate-900 shadow-xl">
                        <img
                          src={hackathon.profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Body Area */}
                  <div className="flex flex-col flex-1 p-6 pt-14 text-center">
                    <h2 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {hackathon.title}
                    </h2>
                    <p className="text-sm text-indigo-400 font-medium mb-4 line-clamp-1">
                      {hackathon.tagline}
                    </p>

                    <p className="text-sm text-slate-400 line-clamp-3 mb-6 flex-1">
                      {hackathon.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 mb-6 bg-slate-800/50 rounded-xl p-4">
                      <div>
                        <span className="block text-slate-500 mb-1">Hackathon Starts</span>
                        <span className="font-semibold">{hackathon.hackathonStart ? formatDate(hackathon.hackathonStart) : 'TBA'}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 mb-1">Team Size</span>
                        <span className="font-semibold">{hackathon.minTeamSize} - {hackathon.maxTeamSize} Members</span>
                      </div>
                    </div>

                    <Link to={`/hackathons/${hackathon.id}`} className="mt-auto">
                      <Button className="w-full bg-slate-800 hover:bg-indigo-600 text-white border-none group-hover:bg-indigo-600 transition-colors py-3 rounded-xl font-bold">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Prev / Pages / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed h-10"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${page === i
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                          : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-600 hover:text-white"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed h-10"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

              {/* Size & Go To */}
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-indigo-500"
                >
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="50">50 / page</option>
                </select>

                <div className="flex items-center gap-2">
                  <span>Go to</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                          setPage(val - 1);
                        }
                      }
                    }}
                    className="h-10 w-16 rounded-xl border border-slate-700 bg-slate-900 px-3 text-center text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

