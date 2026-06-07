// src/pages/workspace/HackathonWorkspacePage.jsx
import { useParams } from "react-router";

import {
    hackathons
} from "../../mock/hackathons";

import useHackathonRole
from "../../hooks/useHackathonRole";

import HackathonWorkspaceLayout
from "../../layouts/HackathonWorkspaceLayout";

export default function HackathonWorkspacePage() {

    const { slug } = useParams();

    const hackathon =
        hackathons.find(
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

    return (
        <HackathonWorkspaceLayout
            role={role}
            hackathon={hackathon}
        />
    );
}