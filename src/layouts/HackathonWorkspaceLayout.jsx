// src/layouts/HackathonWorkspaceLayout.jsx

import { Outlet } from "react-router";

import WorkspaceSidebar from "../components/layout/WorkspaceSidebar";

export default function HackathonWorkspaceLayout({
    role,
    hackathon
}) {

    return (
        <div
            className="
                min-h-screen
                bg-slate-950
                text-white
                flex
            "
        >

            <WorkspaceSidebar
                role={role}
                hackathon={hackathon}
            />

            <main className="flex-1 p-8">

                <Outlet />

            </main>

        </div>
    );
}