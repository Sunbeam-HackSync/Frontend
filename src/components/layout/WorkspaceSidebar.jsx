// src/components/layout/WorkspaceSidebar.jsx

import { NavLink } from "react-router";

export default function WorkspaceSidebar({
    role,
    hackathon
}) {

    const roleLinks = {

        ORGANIZER: [
            {
                name: "Overview",
                path: "overview"
            },
            {
                name: "Participants",
                path: "participants"
            },
            {
                name: "Submissions",
                path: "submissions"
            },
            {
                name: "Announcements",
                path: "announcements"
            }
        ],

        PARTICIPANT: [
            {
                name: "Overview",
                path: "overview"
            },
            {
                name: "My Team",
                path: "team"
            },
            {
                name: "Submission",
                path: "submission"
            },
            {
                name: "Help",
                path: "help"
            }
        ],

        JUDGE: [
            {
                name: "Assigned Projects",
                path: "assigned-projects"
            },
            {
                name: "Evaluation",
                path: "evaluation"
            }
        ],

        MENTOR: [
            {
                name: "Help Queue",
                path: "help-queue"
            }
        ]
    };

    const links = roleLinks[role] || [];

    return (
        <aside
            className="
                w-72
                border-r
                border-slate-800
                bg-slate-900/40
                p-6
            "
        >

            <div className="mb-10">

                <h2 className="text-2xl font-bold">

                    {hackathon.title}

                </h2>

                <p className="text-slate-400 mt-2">

                    {role}

                </p>

            </div>

            <nav className="space-y-3">

                {
                    links.map((link) => (

                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) => `
                                block
                                rounded-lg
                                px-4
                                py-3
                                ${isActive
                                    ? "bg-sky-500/10 text-sky-200 border border-sky-500/20"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"}
                                transition
                            `}
                        >

                            {link.name}

                        </NavLink>
                    ))
                }

            </nav>

        </aside>
    );
}
