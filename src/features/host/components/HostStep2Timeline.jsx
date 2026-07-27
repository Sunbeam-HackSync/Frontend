// src/features/hackathons/components/HostStep2Timeline.jsx

import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";

// Convert a Date or ISO string to "YYYY-MM-DDTHH:mm" (input[datetime-local] format)
function toDateTimeLocal(value) {
    if (!value) return "";
    try {
        return new Date(value).toISOString().slice(0, 16);
    } catch {
        return "";
    }
}

// Convert datetime-local value to LocalDateTime string the backend expects
// e.g. "2026-08-02T09:00" → "2026-08-02T09:00:00"
function toLocalDateTime(value) {
    if (!value) return "";
    return value.length === 16 ? `${value}:00` : value;
}

export default function HostStep2Timeline() {
    const dispatch = useDispatch();
    const { formData, errors } = useSelector((state) => state.host);

    function handleDateChange(field, value) {
        dispatch(updateFormData({ [field]: toLocalDateTime(value) }));
    }

    const fields = [
        {
            key: "registrationStart",
            label: "Registration Opens",
            hint: "When participants can start signing up",
        },
        {
            key: "registrationEnd",
            label: "Registration Closes",
            hint: "Deadline for participants to register",
        },
        {
            key: "hackathonStart",
            label: "Hackathon Starts",
            hint: "Coding / building phase begins",
        },
        {
            key: "hackathonEnd",
            label: "Hackathon Ends",
            hint: "Submission deadline",
        },
    ];

    return (
        <div className="space-y-6">
            <p className="text-slate-400 text-sm">
                Set the key dates for your hackathon. All times are in your local timezone.
            </p>

            {/* Team size */}
            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                        Min Team Size <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.minTeamSize}
                        onChange={(e) => dispatch(updateFormData({ minTeamSize: parseInt(e.target.value) || 1 }))}
                        min={1}
                        max={20}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold mb-2 text-white">
                        Max Team Size <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        value={formData.maxTeamSize}
                        onChange={(e) => dispatch(updateFormData({ maxTeamSize: parseInt(e.target.value) || 1 }))}
                        min={1}
                        max={20}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500"
                    />
                </div>
            </div>

            {/* Dates */}
            <div className="grid gap-6 md:grid-cols-2">
                {fields.map(({ key, label, hint }) => (
                    <div key={key}>
                        <label className="block text-sm font-semibold mb-2 text-white">
                            {label} <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            value={toDateTimeLocal(formData[key])}
                            onChange={(e) => handleDateChange(key, e.target.value)}
                            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 [color-scheme:dark]"
                        />
                        <p className="mt-1 text-xs text-slate-500">{hint}</p>
                        {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
