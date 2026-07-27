// src/features/hackathons/pages/HostHackathonPage.jsx

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import Button from "../../../components/ui/Button";
import HostStep1BasicInfo from "../components/HostStep1BasicInfo";
import HostStep2Timeline from "../components/HostStep2Timeline";
import HostStep3Review from "../components/HostStep3Review";

import { setStep, setErrors, setSubmitting, resetForm } from "../redux/hostSlice";
import { createHackathon } from "../services/hostService";

const STEPS = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Timeline" },
    { number: 3, label: "Review" },
];

function validateStep(step, formData) {
    const errors = {};

    if (step === 1) {
        if (!formData.title.trim()) errors.title = "Title is required.";
        if (!formData.tagline.trim()) errors.tagline = "Tagline is required.";
        if (!formData.description.trim()) errors.description = "Description is required.";
    }

    if (step === 2) {
        if (!formData.registrationStart) errors.registrationStart = "Registration start is required.";
        if (!formData.registrationEnd) errors.registrationEnd = "Registration end is required.";
        if (!formData.hackathonStart) errors.hackathonStart = "Hackathon start is required.";
        if (!formData.hackathonEnd) errors.hackathonEnd = "Hackathon end is required.";

        if (formData.registrationStart && formData.registrationEnd &&
            formData.registrationStart >= formData.registrationEnd) {
            errors.registrationEnd = "Registration end must be after start.";
        }
        if (formData.hackathonStart && formData.hackathonEnd &&
            formData.hackathonStart >= formData.hackathonEnd) {
            errors.hackathonEnd = "Hackathon end must be after start.";
        }
        if (formData.minTeamSize > formData.maxTeamSize) {
            errors.maxTeamSize = "Max team size must be ≥ min team size.";
        }
    }

    return errors;
}

export default function HostHackathonPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { step, totalSteps, formData, isSubmitting } = useSelector((s) => s.host);

    function handleNext() {
        const errors = validateStep(step, formData);
        if (Object.keys(errors).length > 0) {
            dispatch(setErrors(errors));
            window.scrollTo(0, 0);
            return;
        }
        dispatch(setErrors({}));
        dispatch(setStep(step + 1));
        window.scrollTo(0, 0);
    }

    function handlePrevious() {
        if (step > 1) {
            dispatch(setErrors({}));
            dispatch(setStep(step - 1));
            window.scrollTo(0, 0);
        }
    }

    async function handleSubmit() {
        try {
            dispatch(setSubmitting(true));

            // Payload exactly matches HackathonRequestDTO
            const payload = {
                title: formData.title.trim(),
                tagline: formData.tagline.trim(),
                description: formData.description.trim(),
                bannerImageUrl: formData.bannerImageUrl || null,
                profileImageUrl: formData.profileImageUrl || null,
                minTeamSize: formData.minTeamSize,
                maxTeamSize: formData.maxTeamSize,
                registrationStart: formData.registrationStart,
                registrationEnd: formData.registrationEnd,
                hackathonStart: formData.hackathonStart,
                hackathonEnd: formData.hackathonEnd,
            };

            const hackathon = await createHackathon(payload);
            toast.success("Hackathon created! Pending admin approval.");
            dispatch(resetForm());
            navigate(`/host-dashboard`);
        } catch (error) {
            toast.error(error.message || "Failed to create hackathon.");
            window.scrollTo(0, 0);
        } finally {
            dispatch(setSubmitting(false));
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 text-white">
            <div className="mx-auto max-w-3xl px-5">

                {/* Header */}
                <div className="mb-10">
                    <p className="text-indigo-400 text-sm font-semibold uppercase tracking-wider mb-2">Host</p>
                    <h1 className="text-4xl font-bold">Create a Hackathon</h1>
                    <p className="mt-3 text-slate-400">
                        Fill in the details below to submit your hackathon for platform review.
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-10 flex items-center gap-0">
                    {STEPS.map((s, index) => (
                        <div key={s.number} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center">
                                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${step > s.number ? "bg-indigo-600 text-white" : step === s.number ? "bg-indigo-600 text-white ring-4 ring-indigo-600/30" : "bg-slate-800 text-slate-500"}`}>
                                    {step > s.number ? "✓" : s.number}
                                </div>
                                <p className={`mt-2 text-xs font-medium ${step === s.number ? "text-indigo-400" : "text-slate-500"}`}>
                                    {s.label}
                                </p>
                            </div>
                            {index < STEPS.length - 1 && (
                                <div className={`h-0.5 flex-1 mx-2 mb-5 transition-all ${step > s.number ? "bg-indigo-600" : "bg-slate-800"}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">
                    {step === 1 && <HostStep1BasicInfo />}
                    {step === 2 && <HostStep2Timeline />}
                    {step === 3 && <HostStep3Review onSubmit={handleSubmit} />}

                    {/* Navigation */}
                    {step < 3 && (
                        <div className="mt-8 flex items-center justify-between">
                            <Button
                                onClick={handlePrevious}
                                disabled={step === 1}
                                variant="outline"
                            >
                                ← Back
                            </Button>
                            <span className="text-sm text-slate-500">Step {step} of {totalSteps}</span>
                            <Button onClick={handleNext}>
                                Next →
                            </Button>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="mt-4 flex justify-start">
                            <Button onClick={handlePrevious} variant="outline">
                                ← Back
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
