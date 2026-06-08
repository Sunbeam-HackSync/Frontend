// /src/features/hackathons/pages/OrganizerAnnouncementsPage.jsx

import { useState } from "react";

import { useWorkspaceData } from "../utils";

import { createAnnouncement } from "../../../services/demoStore";

import PageHeader from "../components/PageHeader";

import Panel from "../components/Panel";


import Button from "../../../components/ui/Button";

import { FaBullhorn } from "react-icons/fa";

import { formatDateTime } from "../../../utils/formatters"; 

export function OrganizerAnnouncementsPage() {
  const { hackathon, announcements, commit, user } = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  function submitAnnouncement(event) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return;

    commit((draft) =>
      createAnnouncement(draft, hackathon.id, user.id, title.trim(), message.trim()),
    );
    setTitle("");
    setMessage("");
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Communication Hub"
        description="Publish in-app announcements that participants, judges, and mentors can read immediately."
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Panel title="Broadcast Announcement">
          <form onSubmit={submitAnnouncement} className="space-y-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Announcement title"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Message for all attendees"
              className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-sky-400"
            />
            <Button className="w-full">Publish</Button>
          </form>
        </Panel>

        <Panel title="Announcement History">
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <FaBullhorn className="text-sky-300" />
                  <h3 className="font-bold text-white">{announcement.title}</h3>
                </div>
                <p className="text-sm text-slate-400">{announcement.message}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDateTime(announcement.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}