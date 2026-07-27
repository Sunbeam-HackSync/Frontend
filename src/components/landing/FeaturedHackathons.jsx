// src/components/landing/FeaturedHackathons.jsx
// Fetches the first 3 live hackathons from the real backend for the landing page preview.

import { useEffect, useState } from "react";
import { Link } from "react-router";

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import Button from "../ui/Button";
import { getDiscoveryFeed } from "../../features/workspace/services/workspaceService";
import { formatDate } from "../../utils/formatters";

function HackathonPreviewCard({ hackathon }) {
    const gradients = [
        "from-indigo-500/30 to-cyan-500/20",
        "from-violet-500/30 to-fuchsia-500/20",
        "from-emerald-500/30 to-teal-500/20",
    ];
    const idx = hackathon.id % gradients.length;

    return (
        <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5">
            {/* Banner */}
            <div className={`h-40 bg-gradient-to-br ${gradients[idx]}`} />

            {/* Content */}
            <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        {hackathon.status?.replace("_", " ") || "Live"}
                    </span>
                    <span className="text-sm text-slate-400">{hackathon.mode || "Online"}</span>
                </div>

                <h3 className="text-xl font-bold text-white line-clamp-2">{hackathon.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400 line-clamp-2">
                    {hackathon.shortDescription || hackathon.tagline || "Join this exciting hackathon challenge."}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-400">
                    {hackathon.prizePool && (
                        <div className="flex justify-between">
                            <span>Prize Pool</span>
                            <span className="font-medium text-white">{hackathon.prizePool}</span>
                        </div>
                    )}
                    {hackathon.registrationEnd && (
                        <div className="flex justify-between">
                            <span>Registration Ends</span>
                            <span className="font-medium text-white">{formatDate(hackathon.registrationEnd)}</span>
                        </div>
                    )}
                    {hackathon.minTeamSize && (
                        <div className="flex justify-between">
                            <span>Team Size</span>
                            <span className="font-medium text-white">{hackathon.minTeamSize}–{hackathon.maxTeamSize}</span>
                        </div>
                    )}
                </div>

                <Link to={`/hackathons/${hackathon.id}`} className="mt-6 block">
                    <Button className="w-full">View Details</Button>
                </Link>
            </div>
        </div>
    );
}

// Skeleton card for loading state
function SkeletonCard() {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 animate-pulse">
            <div className="h-40 bg-slate-800" />
            <div className="p-6 space-y-3">
                <div className="h-4 w-24 rounded bg-slate-800" />
                <div className="h-6 w-3/4 rounded bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-800" />
                <div className="h-4 w-2/3 rounded bg-slate-800" />
                <div className="mt-6 h-10 w-full rounded-lg bg-slate-800" />
            </div>
        </div>
    );
}

export default function FeaturedHackathons() {
    const [hackathons, setHackathons] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFeatured() {
            try {
                const response = await getDiscoveryFeed(0, 3);
                setHackathons((response.content || []).slice(0, 3));
            } catch {
                // Silently fail — landing page still renders without featured section
                setHackathons([]);
            } finally {
                setLoading(false);
            }
        }
        fetchFeatured();
    }, []);

    // Don't render the section if there's nothing to show and we're not loading
    if (!loading && hackathons.length === 0) return null;

    return (
        <section className="py-24">
            <Container>
                <SectionTitle
                    badge="Featured Events"
                    title="Explore Trending Hackathons"
                    description="Discover exciting hackathons from top communities, universities, and organizations worldwide."
                />

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {loading
                        ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                        : hackathons.map((hackathon) => (
                            <HackathonPreviewCard key={hackathon.id} hackathon={hackathon} />
                        ))
                    }
                </div>

                {!loading && hackathons.length > 0 && (
                    <div className="mt-12 text-center">
                        <Link to="/hackathons">
                            <Button variant="secondary" className="px-8">
                                Browse All Hackathons →
                            </Button>
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
}