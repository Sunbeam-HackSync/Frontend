// src/features/auth/components/AuthSideContent.jsx
import { Link } from "react-router";
export default function AuthSideContent() {
    return (
        <div
            className="
                hidden
                lg:flex
                relative
                overflow-hidden
                flex-col
                justify-between
                p-16
                border-r
                border-slate-800
                bg-linear-to-br
                from-slate-950
                via-indigo-950/40
                to-slate-950
            "
        >

            {/* Glow */}
            <div
                className="
                    absolute
                    top-0
                    left-1/2
                    -translate-x-1/2
                    w-125
                    h-125
                    bg-indigo-500/20
                    blur-[140px]
                    rounded-full
                "
            />

            {/* Top */}
            <div className="relative z-10">

                <h1 className="text-4xl font-bold tracking-wide">
                    <Link to="/">
                        Hack
                        <span className="text-indigo-500">
                            Forge
                        </span>
                    </Link>
                </h1>

            </div>

            {/* Center */}
            <div className="relative z-10 max-w-xl">

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
                        mb-8
                    "
                >
                    🚀 Next Generation Hackathon Platform
                </p>

                <h2
                    className="
                        text-5xl
                        font-bold
                        leading-tight
                    "
                >
                    Build The Future Through
                    <span className="gradient-text">
                        {" "}Innovation
                    </span>
                </h2>

                <p
                    className="
                        mt-8
                        text-lg
                        text-slate-400
                        leading-relaxed
                    "
                >
                    Organize, participate, mentor,
                    and judge world-class hackathons
                    using one unified platform.
                </p>

            </div>

            {/* Bottom Stats */}
            <div
                className="
                    relative
                    z-10
                    grid
                    grid-cols-3
                    gap-6
                "
            >

                <div className="glass-card rounded-2xl p-5">

                    <h3 className="text-3xl font-bold">
                        500+
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Hackathons
                    </p>

                </div>

                <div className="glass-card rounded-2xl p-5">

                    <h3 className="text-3xl font-bold">
                        10K+
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Developers
                    </p>

                </div>

                <div className="glass-card rounded-2xl p-5">

                    <h3 className="text-3xl font-bold">
                        2K+
                    </h3>

                    <p className="text-slate-400 mt-2">
                        Projects
                    </p>

                </div>

            </div>

        </div>
    );
}