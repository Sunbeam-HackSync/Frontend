// src/features/workspace/pages/ParticipantTeamPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaShieldAlt, FaUserPlus, FaUsers, FaEdit } from "react-icons/fa";

import {
    getMyHackathonDetails,
    createTeam,
    addMember,
    updateTeam,
} from "../../participant/services/participantService";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const createTeamSchema = z.object({
    teamName: z.string().min(2, "Team name must be at least 2 characters."),
    skillsNeeded: z.string().optional(),
    lookingForMembers: z.boolean(),
});

const addMemberSchema = z.object({
    email: z.string().email("Enter a valid email address."),
});

const updateTeamSchema = z.object({
    skillsNeeded: z.string().optional(),
    isLookingForMembers: z.boolean(),
});

// ─── Shared input style ───────────────────────────────────────────────────────
const inputClass = "w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

function FieldError({ message }) {
    return message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;
}

// ─── Create Team Form ─────────────────────────────────────────────────────────
function CreateTeamPanel({ hackathonId, onCreated }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(createTeamSchema),
        defaultValues: { lookingForMembers: true },
    });

    async function onSubmit(data) {
        try {
            const team = await createTeam({ hackathonId: parseInt(hackathonId), ...data });
            toast.success("Team created successfully!");
            onCreated(team);
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-white mb-1">Create Your Team</h2>
            <p className="text-sm text-slate-400 mb-6">
                You'll become the team leader. Add members after creating the team.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Team Name *</label>
                    <input className={inputClass} placeholder="e.g. Neural Ninjas" {...register("teamName")} />
                    <FieldError message={errors.teamName?.message} />
                </div>

                <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-300">Skills Needed</label>
                    <input className={inputClass} placeholder="e.g. React, ML, UI/UX" {...register("skillsNeeded")} />
                    <p className="mt-1 text-xs text-slate-500">Skills you're looking for in teammates</p>
                    <FieldError message={errors.skillsNeeded?.message} />
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                    <input type="checkbox" className="h-4 w-4 accent-indigo-500" {...register("lookingForMembers")} />
                    <span className="text-sm font-medium text-slate-200">Open for new members</span>
                </label>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                >
                    {isSubmitting ? "Creating..." : "Create Team"}
                </button>
            </form>
        </div>
    );
}

// ─── Team Management Panel ────────────────────────────────────────────────────
function TeamManagementPanel({ teamDetails, userEmail, onUpdated, isCompleted }) {
    const isLeader = teamDetails?.participants?.some(p => p.email === userEmail && p.teamLeader);

    const addMemberForm = useForm({ resolver: zodResolver(addMemberSchema) });
    const updateTeamForm = useForm({
        resolver: zodResolver(updateTeamSchema),
        defaultValues: {
            skillsNeeded: teamDetails?.skillsNeeded || "",
            isLookingForMembers: teamDetails?.lookingForMembers ?? true,
        },
    });

    async function handleAddMember(data) {
        try {
            await addMember(teamDetails.teamId, data.email);
            toast.success("Member added successfully!");
            addMemberForm.reset();
            onUpdated();
        } catch (err) {
            toast.error(err.message);
        }
    }

    async function handleUpdateTeam(data) {
        try {
            await updateTeam(teamDetails.teamId, {
                isLookingForMembers: data.isLookingForMembers,
                skillsNeeded: data.skillsNeeded,
            });
            toast.success("Team settings updated!");
            onUpdated();
        } catch (err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="space-y-6">
            {/* Team header card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">Team #{teamDetails.teamId}</p>
                        <h2 className="mt-1 text-2xl font-bold text-white">{teamDetails.teamName}</h2>
                        {teamDetails.skillsNeeded && (
                            <p className="mt-1 text-sm text-slate-400">Skills: {teamDetails.skillsNeeded}</p>
                        )}
                    </div>
                    {isLeader && (
                        <span className="flex items-center gap-1.5 rounded-full bg-amber-900/40 border border-amber-700/40 px-3 py-1 text-xs font-semibold text-amber-300">
                            <FaShieldAlt size={10} /> You are Leader
                        </span>
                    )}
                </div>

                {/* Member list */}
                <h3 className="mt-6 mb-3 flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <FaUsers size={13} className="text-slate-500" />
                    Members ({teamDetails.participants?.length || 0})
                </h3>
                <div className="space-y-2">
                    {teamDetails.participants?.map((p) => (
                        <div key={p.userId} className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-900/50 text-xs font-bold text-indigo-300">
                                {(p.fullName || p.email || "?")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{p.fullName || p.email}</p>
                                <p className="truncate text-xs text-slate-400">{p.email}</p>
                            </div>
                            {p.teamLeader && (
                                <span className="flex items-center gap-1 rounded-full bg-amber-900/30 border border-amber-700/30 px-2 py-0.5 text-xs text-amber-300">
                                    <FaShieldAlt size={9} /> Leader
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Add member (leader only) */}
            {isLeader && !isCompleted && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                        <FaUserPlus size={14} className="text-indigo-400" />
                        Add Team Member
                    </h3>
                    <p className="mb-4 text-sm text-slate-400">Enter the registered email of the person to add.</p>
                    <form onSubmit={addMemberForm.handleSubmit(handleAddMember)} className="flex gap-3">
                        <input
                            type="email"
                            placeholder="member@example.com"
                            className={`${inputClass} flex-1`}
                            {...addMemberForm.register("email")}
                        />
                        <button
                            type="submit"
                            disabled={addMemberForm.formState.isSubmitting}
                            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {addMemberForm.formState.isSubmitting ? "Adding..." : "Add"}
                        </button>
                    </form>
                    <FieldError message={addMemberForm.formState.errors.email?.message} />
                </div>
            )}

            {/* Update team settings (leader only) */}
            {isLeader && !isCompleted && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-white">
                        <FaEdit size={14} className="text-indigo-400" />
                        Team Settings
                    </h3>
                    <form onSubmit={updateTeamForm.handleSubmit(handleUpdateTeam)} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-300">Skills Needed</label>
                            <input className={inputClass} placeholder="e.g. React, ML, UI/UX" {...updateTeamForm.register("skillsNeeded")} />
                        </div>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                            <input type="checkbox" className="h-4 w-4 accent-indigo-500" {...updateTeamForm.register("isLookingForMembers")} />
                            <span className="text-sm font-medium text-slate-200">Open for new members</span>
                        </label>
                        <button
                            type="submit"
                            disabled={updateTeamForm.formState.isSubmitting}
                            className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
                        >
                            {updateTeamForm.formState.isSubmitting ? "Saving..." : "Save Settings"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ParticipantTeamPage() {
    const { id } = useParams();
    const { user } = useSelector((state) => state.auth);
    const [details, setDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    async function loadDetails() {
        try {
            setIsLoading(true);
            const data = await getMyHackathonDetails(id);
            setDetails(data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { loadDetails(); }, [id]);

    const teamDetails = details?.teamDetails;
    const hackathonId = details?.hackathonDetails?.id || parseInt(id);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((k) => (
                    <div key={k} className="animate-pulse rounded-2xl border border-slate-800 bg-slate-900 h-48" />
                ))}
            </div>
        );
    }

    const hackathonStatus = details?.hackathonDetails?.hackathonStatus;
    const isCompleted = hackathonStatus === 'COMPLETED';

    return (
        <div>
            <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-widest text-indigo-400">Participant</p>
                <h1 className="mt-1 text-2xl font-bold text-white">Team Management</h1>
            </div>

            {isCompleted && (
                <div className="mb-6 rounded-xl border border-amber-800/40 bg-amber-900/10 p-4 text-amber-300 font-medium">
                    This hackathon has ended. Team management is disabled.
                </div>
            )}

            {teamDetails ? (
                <TeamManagementPanel
                    teamDetails={teamDetails}
                    userEmail={user?.email}
                    onUpdated={loadDetails}
                    isCompleted={isCompleted}
                />
            ) : isCompleted ? null : (
                <CreateTeamPanel
                    hackathonId={hackathonId}
                    onCreated={loadDetails}
                />
            )}
        </div>
    );
}