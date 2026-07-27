import { useEffect, useState } from "react";
import { useParams } from "react-router";

import useHackathonRole from "../hooks/useHackathonRole";
import HackathonWorkspaceLayout from "../../../layouts/HackathonWorkspaceLayout";
import { getParticipantHackathonById } from "../services/workspaceService";

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
            } catch (err) {
                setError("Hackathon not found or access denied.");
            } finally {
                setLoading(false);
            }
        }
        if (id) {
            fetchHackathon();
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 p-10 text-slate-400">Loading workspace...</div>;
    }

    if (error || !hackathon) {
        return (
            <div className="min-h-screen bg-slate-950 p-10 text-white">
                {error || "Hackathon not found"}
            </div>
        );
    }

    if (!role) {
        return (
            <div className="min-h-screen bg-slate-950 p-10 text-white">
                <div className="max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6">
                    <h1 className="text-2xl font-bold">Workspace access required</h1>
                    <p className="mt-3 text-slate-400">
                        Register for this hackathon or use an account with an assigned role.
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
