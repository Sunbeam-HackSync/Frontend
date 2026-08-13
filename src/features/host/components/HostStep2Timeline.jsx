// src/features/hackathons/components/HostStep2Timeline.jsx

import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../redux/hostSlice";

// Convert datetime-local input value (YYYY-MM-DDTHH:mm) to LocalDateTime string
// e.g. "2026-08-02T09:00" → "2026-08-02T09:00:00"
function toLocalDateTime(value) {
    if (!value) return "";
    return value.length === 16 ? `${value}:00` : value;
}

// Returns current local datetime as "YYYY-MM-DDTHH:mm" without UTC conversion
function getNowLocal() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function HostStep2Timeline() {
    const dispatch = useDispatch();
    const { formData, errors } = useSelector((state) => state.host);

    // Compute once per render — current local datetime as min for Registration Opens
    const nowMin = getNowLocal();

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
        {
            key: "resultDeclarationDate",
            label: "Result Declaration Date",
            hint: "When the winners will be announced",
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
                    {errors.maxTeamSize && <p className="mt-1 text-xs text-red-400">{errors.maxTeamSize}</p>}
                </div>
            </div>

            {/* Dates */}
            <div className="grid gap-6 md:grid-cols-2">
                {fields.map(({ key, label, hint }) => {
                    // Compute min datetime for each field to enforce ordering in the browser picker.
                    // We store values as "YYYY-MM-DDTHH:mm:ss" so slice to 16 chars for the input min.
                    let minValue = "";
                    if (key === "registrationStart")
                        minValue = nowMin; // Cannot be in the past
                    if (key === "registrationEnd" && formData.registrationStart)
                        minValue = formData.registrationStart.slice(0, 16);
                    if (key === "hackathonStart" && formData.registrationEnd)
                        minValue = formData.registrationEnd.slice(0, 16);
                    if (key === "hackathonEnd" && formData.hackathonStart)
                        minValue = formData.hackathonStart.slice(0, 16);
                    if (key === "resultDeclarationDate" && formData.hackathonEnd)
                        minValue = formData.hackathonEnd.slice(0, 16);

                    // The stored value is "YYYY-MM-DDTHH:mm:ss" — slice to 16 so the
                    // datetime-local input shows the correct local time WITHOUT UTC conversion.
                    const inputValue = formData[key] ? formData[key].slice(0, 16) : "";

                    return (
                        <div key={key}>
                            <label className="block text-sm font-semibold mb-2 text-white">
                                {label} <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="datetime-local"
                                value={inputValue}
                                min={minValue || undefined}
                                onChange={(e) => handleDateChange(key, e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-indigo-500 [color-scheme:dark]"
                            />
                            <p className="mt-1 text-xs text-slate-500">{hint}</p>
                            {errors[key] && <p className="mt-1 text-xs text-red-400">{errors[key]}</p>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
