// /src/components/landing/HeroSection.jsx

import Container from "../common/Container";
import Button from "../ui/Button";

import {useNavigate} from "react-router";

export default function HeroSection() {

    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden py-24 lg:py-14">

            {/* Background Glow */}
            <div
                className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-125
                    h-125
                    bg-indigo-500/20
                    blur-[120px]
                    rounded-full
                    
                "
            />

            <Container>

                <div
                    className="
                        relative
                        grid
                        lg:grid-cols-2
                        gap-16
                        items-center
                    "
                >

                    {/* Left Content */}
                    <div>

                        <p
                            className="
                                inline-block
                                px-4
                                py-2
                                rounded-full
                                bg-indigo-500/10
                                border
                                border-indigo-500/20
                                text-indigo-400
                                text-sm
                                mb-6
                            "
                        >
                            🚀 Next Generation Hackathon Platform
                        </p>

                        <h1
                            className="
                                text-5xl
                                md:text-6xl
                                font-extrabold
                                leading-tight
                            "
                        >
                            Build.
                            Collaborate.
                            <span className="text-indigo-500"> Compete.</span>
                        </h1>

                        <p
                            className="
                                mt-6
                                text-lg
                                text-slate-400
                                leading-relaxed
                                max-w-xl
                            "
                        >
                            The complete platform for organizing, managing,
                            mentoring, and judging world-class hackathons.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-10">
                            <Button onClick={() => navigate("/hackathons")}>
                                Explore Hackathons
                            </Button>

                            <Button variant="secondary" onClick={() => navigate("/host-hackathon")}>
                                Host a Hackathon
                            </Button>

                        </div>

                        {/* Stats */}
                        <div className="flex gap-10 mt-14">

                            <div>
                                <h3 className="text-3xl font-bold">
                                    500+
                                </h3>

                                <p className="text-slate-400">
                                    Hackathons
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold">
                                    10K+
                                </h3>

                                <p className="text-slate-400">
                                    Developers
                                </p>
                            </div>

                            <div>
                                <h3 className="text-3xl font-bold">
                                    2K+
                                </h3>

                                <p className="text-slate-400">
                                    Projects
                                </p>
                            </div>

                        </div>

                    </div>

                    <div className="relative">

                        {/* Floating Glow */}
                        <div
                            className="
            absolute
            -top-10
            -right-10
            w-72
            h-72
            bg-indigo-500/30
            blur-[120px]
            rounded-full
        "
                        />

                        {/* Dashboard Mockup */}
                        <div
                            className="
            relative
            glass-card
            rounded-[32px]
            p-6
            shadow-2xl
            overflow-hidden
        "
                        >

                            {/* Top */}
                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <p className="text-slate-400 text-sm">
                                        Active Hackathon
                                    </p>

                                    <h3 className="text-2xl font-bold mt-1">
                                        AI Innovation Challenge
                                    </h3>
                                </div>

                                <div
                                    className="
                    px-4
                    py-2
                    rounded-full
                    bg-emerald-500/10
                    border
                    border-emerald-500/20
                    text-emerald-400
                    text-sm
                "
                                >
                                    Live
                                </div>

                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">

                                <div className="glass-card rounded-2xl p-5">

                                    <p className="text-slate-400 text-sm">
                                        Participants
                                    </p>

                                    <h4 className="text-3xl font-bold mt-2">
                                        1,240
                                    </h4>

                                </div>

                                <div className="glass-card rounded-2xl p-5">

                                    <p className="text-slate-400 text-sm">
                                        Teams
                                    </p>

                                    <h4 className="text-3xl font-bold mt-2">
                                        312
                                    </h4>

                                </div>

                            </div>

                            {/* Activity Feed */}
                            <div className="glass-card rounded-2xl p-5 mt-5">

                                <div className="flex items-center justify-between mb-5">

                                    <h4 className="font-semibold">
                                        Recent Activity
                                    </h4>

                                    <span className="text-indigo-400 text-sm">
                                        Live Updates
                                    </span>

                                </div>

                                <div className="space-y-4">

                                    {
                                        [1, 2, 3].map((item) => (
                                            <div
                                                key={item}
                                                className="
                                flex
                                items-center
                                justify-between
                            "
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className="
                                        w-10
                                        h-10
                                        rounded-full
                                        bg-indigo-500/20
                                    "
                                                    />

                                                    <div>

                                                        <p className="font-medium">
                                                            Team Quantum
                                                        </p>

                                                        <p className="text-sm text-slate-400">
                                                            Submitted project
                                                        </p>

                                                    </div>

                                                </div>

                                                <span className="text-sm text-slate-500">
                                                    2m ago
                                                </span>

                                            </div>
                                        ))
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </Container>

        </section>
    );
}