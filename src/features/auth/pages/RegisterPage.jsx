// src/features/auth/pages/RegisterPage.jsx

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { toast } from "react-toastify";

import { registerSchema, PLATFORM_ROLES } from "../utils/authValidation";
import { registerUser } from "../services/authService";
import Button from "../../../components/ui/Button";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthSideContent from "../components/AuthSideContent";
import OtpVerificationForm from "../components/OtpVerificationForm";

export default function RegisterPage() {
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const {
        register: registerForm,
        handleSubmit: handleRegisterSubmit,
        formState: { errors: registerErrors },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: "PARTICIPANT" },
    });

    async function onRegisterSubmit(data) {
        try {
            setIsLoading(true);
            await registerUser(data); // passes email, password, role
            setRegisteredEmail(data.email);
            setIsOtpStep(true);
            toast.success("Registration successful. Please check your email for OTP.");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="flex items-center justify-center p-6 md:p-10">
                {!isOtpStep ? (
                    <AuthCard
                        title="Create Account"
                        subtitle="Join HackSync and start building amazing things."
                    >
                        <form
                            onSubmit={handleRegisterSubmit(onRegisterSubmit)}
                            className="space-y-5"
                        >
                            <AuthInput
                                label="Email Address"
                                type="email"
                                autoComplete="email"
                                placeholder="Enter your email"
                                error={registerErrors.email?.message}
                                {...registerForm("email")}
                            />

                            <AuthInput
                                label="Password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Create a strong password (min. 6 chars)"
                                error={registerErrors.password?.message}
                                {...registerForm("password")}
                            />

                            <AuthInput
                                label="Confirm Password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Re-enter your password"
                                error={registerErrors.confirmPassword?.message}
                                {...registerForm("confirmPassword")}
                            />

                            {/* Role Selector */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">
                                    I am joining as a...
                                </label>
                                <div className="grid grid-cols-1 gap-2">
                                    {PLATFORM_ROLES.map((roleOption) => (
                                        <label
                                            key={roleOption.value}
                                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 bg-slate-800/40 p-3 transition-all hover:border-indigo-500/50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-500/10"
                                        >
                                            <input
                                                type="radio"
                                                value={roleOption.value}
                                                {...registerForm("role")}
                                                className="mt-0.5 accent-indigo-500"
                                            />
                                            <span className="text-sm leading-snug text-slate-300">
                                                {roleOption.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {registerErrors.role && (
                                    <p className="text-xs text-red-400">{registerErrors.role.message}</p>
                                )}
                            </div>

                            <Button className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <p className="mt-8 text-center text-slate-400">
                            Already have an account?
                            <Link to="/login" className="ml-2 text-indigo-400 hover:text-indigo-300">
                                Login
                            </Link>
                        </p>
                    </AuthCard>
                ) : (
                    <OtpVerificationForm
                        email={registeredEmail}
                        onBack={() => setIsOtpStep(false)}
                    />
                )}
            </div>

            <AuthSideContent />
        </>
    );
}