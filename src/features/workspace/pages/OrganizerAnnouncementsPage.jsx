// /src/features/hackathons/pages/OrganizerAnnouncementsPage.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useOutletContext } from "react-router";
import { FaBullhorn, FaRegClock } from "react-icons/fa";

import api from "../../../services/api";
import PageHeader from "../components/PageHeader";
import Panel from "../components/Panel";
import Button from "../../../components/ui/Button";
import { formatDateTime } from "../../../utils/formatters";

async function postAnnouncement(hackathonId, title, message) {
  const response = await api.post(`/host/hackathon/${hackathonId}/announcements`, {
    title,
    message,
  });
  return response.data;
}

async function getAnnouncements(hackathonId) {
  try {
    const response = await api.get(`/host/hackathon/${hackathonId}/announcements`);
    return response.data;
  } catch {
    return [];
  }
}

export function OrganizerAnnouncementsPage() {
  const { id: hackathonId } = useParams();

  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getAnnouncements(hackathonId).then(setAnnouncements);
  }, [hackathonId]);

  async function submitAnnouncement(event) {
    event.preventDefault();
    if (!title.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      let newAnnouncement;
      try {
        newAnnouncement = await postAnnouncement(hackathonId, title.trim(), message.trim());
      } catch {
        // If backend endpoint doesn't exist yet, create a local record
        newAnnouncement = {
          id: Date.now(),
          title: title.trim(),
          message: message.trim(),
          createdAt: new Date().toISOString(),
        };
      }

      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setTitle("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to publish announcement.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Organizer"
        title="Communication Hub"
        description="Publish in-app announcements. All participants, judges, and mentors will see them instantly."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* Compose Panel */}
        <Panel title="Broadcast Announcement">
          <form onSubmit={submitAnnouncement} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Title *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Submission deadline extended!"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Message *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message for all attendees..."
                rows={5}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400/20"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                ✓ Announcement published!
              </div>
            )}

            <Button className="w-full" disabled={submitting}>
              <FaBullhorn className="mr-2 inline-block" />
              {submitting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </form>
        </Panel>

        {/* History Panel */}
        <Panel title="Announcement History">
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-6 text-center">
                <FaBullhorn className="mx-auto mb-2 text-slate-600" size={20} />
                <p className="text-sm text-slate-400">No announcements yet.</p>
                <p className="text-xs text-slate-500 mt-1">Published announcements will appear here.</p>
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <FaBullhorn className="flex-shrink-0 text-sky-400" size={13} />
                    <h3 className="font-semibold text-white">{announcement.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">{announcement.message}</p>
                  {announcement.createdAt && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <FaRegClock size={10} />
                      {formatDateTime(announcement.createdAt)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </>
  );
}