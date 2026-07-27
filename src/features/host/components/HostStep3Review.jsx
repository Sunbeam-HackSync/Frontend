// src/features/hackathons/components/HostStep3Review.jsx

import { useSelector } from "react-redux";
import Button from "../../../components/ui/Button";

function ReviewRow({ label, value }) {
    return (
        <div className="flex gap-3">
            <span className="min-w-36 text-sm text-slate-400">{label}</span>
            <span className="text-sm text-white font-medium">{value || <span className="text-slate-600 italic">Not set</span>}</span>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "Not set";
    try {
        return new Date(value).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit",
        });
    } catch {
        return value;
    }
}

export default function HostStep3Review({ onSubmit }) {
    const { formData, isSubmitting } = useSelector((state) => state.host);

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-xl font-bold text-white mb-1">Review & Submit</h3>
                <p className="text-slate-400 text-sm">
                    Please review all details before submitting. Your hackathon will go to Admin for approval.
                </p>
            </div>

            {/* Basic Info */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-3">
                <h4 className="font-semibold text-indigo-400 mb-4">Basic Information</h4>
                <ReviewRow label="Title" value={formData.title} />
                <ReviewRow label="Tagline" value={formData.tagline} />
                <div className="flex gap-3">
                    <span className="min-w-36 text-sm text-slate-400">Description</span>
                    <p className="text-sm text-white line-clamp-3">{formData.description || <span className="text-slate-600 italic">Not set</span>}</p>
                </div>
                {formData.bannerImageUrl && (
                    <div className="flex gap-3 items-center">
                        <span className="min-w-36 text-sm text-slate-400">Banner</span>
                        <img src={formData.bannerImageUrl} alt="Banner preview" className="h-20 rounded-lg object-cover" />
                    </div>
                )}
                {formData.profileImageUrl && (
                    <div className="flex gap-3 items-center">
                        <span className="min-w-36 text-sm text-slate-400">Profile</span>
                        <img src={formData.profileImageUrl} alt="Profile preview" className="h-14 w-14 rounded-full object-cover border-2 border-slate-700" />
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-6 space-y-3">
                <h4 className="font-semibold text-emerald-400 mb-4">Timeline & Team Size</h4>
                <ReviewRow label="Min Team" value={`${formData.minTeamSize} members`} />
                <ReviewRow label="Max Team" value={`${formData.maxTeamSize} members`} />
                <ReviewRow label="Reg. Opens" value={formatDate(formData.registrationStart)} />
                <ReviewRow label="Reg. Closes" value={formatDate(formData.registrationEnd)} />
                <ReviewRow label="Hackathon Starts" value={formatDate(formData.hackathonStart)} />
                <ReviewRow label="Hackathon Ends" value={formatDate(formData.hackathonEnd)} />
            </div>

            {/* Submission info box */}
            <div className="rounded-xl border border-indigo-800/50 bg-indigo-950/30 p-5">
                <p className="text-sm font-semibold text-indigo-300 mb-2">⏳ What happens after submission?</p>
                <p className="text-sm text-slate-400">
                    Your hackathon will be created with <strong className="text-white">DRAFT</strong> status and sent for admin review.
                    Once approved, it will appear on the platform. You can manage judges, mentors, and participants from your host dashboard.
                </p>
            </div>

            <Button
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full"
            >
                {isSubmitting ? "Creating Hackathon..." : "Submit for Review →"}
            </Button>

            <p className="text-xs text-center text-slate-500">
                By submitting, you agree to HackSync's Terms of Service and Community Guidelines.
            </p>
        </div>
    );
}
