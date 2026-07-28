// src/features/workspace/pages/HackathonWorkspacePage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHackathonRole from "../hooks/useHackathonRole";
import HackathonWorkspaceLayout from "../../../layouts/HackathonWorkspaceLayout";
import { getParticipantHackathonById } from "../services/workspaceService";
import Navbar from "../../../components/layout/Navbar";

export default function HackathonWorkspacePage() {
    const { id } = useParams();

    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const role = useHackathonRole(id);

    useEffect(() => {
        async function fetchHackathon() {
            try {
                setLoading(true);
                const data = await getParticipantHackathonById(id);
                setHackathon(data);
            } catch {
                setError("Hackathon not found or access denied.");
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchHackathon();
        }
    }, [id]);

    let content;

    if (loading) {
        content = <div className="flex-1 bg-slate-950 p-10 text-slate-400">Loading workspace...</div>;
    } else if (error || !hackathon) {
        content = (
            <div className="flex-1 bg-slate-950 p-10 text-white">
                {error || "Hackathon not found"}
            </div>
        );
    } else if (!role) {
        content = (
            <div className="flex-1 bg-slate-950 p-10 text-white flex items-center justify-center">
                <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl text-center">
                    <h1 className="text-2xl font-bold mb-3">Workspace Access Required</h1>
                    <p className="text-slate-400">
                        Register for this hackathon or use an account with an assigned role to view the workspace.
                    </p>
                </div>
            </div>
        );
    } else {
        content = (
            <HackathonWorkspaceLayout
                role={role}
                hackathon={hackathon}
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            <Navbar />
            <div className="flex-1 flex flex-col min-h-0 relative">
                {content}
            </div>
        </div>
    );
}
