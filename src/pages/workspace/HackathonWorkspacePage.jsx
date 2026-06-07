// src/pages/workspace/HackathonWorkspacePage.jsx
import { useParams } from "react-router";

import useHackathonRole
from "../../hooks/useHackathonRole";

import HackathonWorkspaceLayout
from "../../layouts/HackathonWorkspaceLayout";

import useDemoData from "../../hooks/useDemoData";

export default function HackathonWorkspacePage() {

    const { slug } = useParams();

    const { state } = useDemoData();

    const hackathon =
        state.hackathons.find(
            (item) => item.slug === slug
        );

    const role = useHackathonRole(
        hackathon?.id
    );

    if (!hackathon) {

        return (
            <div className="p-10 text-white">
                Hackathon not found
            </div>
        );
    }

    if (!role) {

        return (
            <div
                className="
                    min-h-screen
                    bg-slate-950
                    p-10
                    text-white
                "
            >
                <div className="max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <h1 className="text-2xl font-bold">Workspace access required</h1>
                    <p className="mt-3 text-slate-400">
                        Register for this hackathon or use a demo account with an assigned role.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <HackathonWorkspaceLayout
            role={role}
            hackathon={hackathon}
        />
    );
}
