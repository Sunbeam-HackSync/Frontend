// src/features/auth/components/OtpVerificationForm.jsx

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { otpSchema } from "../utils/authValidation";
import { getRoleRedirectPath } from "../../../utils/navigation";
import { verifyOtp, resendOtp, fetchUserProfile, parsePlatformRoles } from "../services/authService";
import { setAuth } from "../redux/authSlice";
import Button from "../../../components/ui/Button";
import AuthCard from "./AuthCard";
import AuthInput from "./AuthInput";

export default function OtpVerificationForm({ email, onBack }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120);

    // Countdown timer — isolated here so the parent RegisterPage does not re-render every second
    useEffect(() => {
        if (timeLeft <= 0) return;
        const id = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(id);
    }, [timeLeft]);

    const formatTime = (s) =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otpCode: "" },
    });

    async function onOtpSubmit(data) {
        try {
            setIsLoading(true);
            // Verifies OTP, saves JWT to cookie, returns { token, expiresIn }
            const authData = await verifyOtp(email, data.otpCode);

            // Fetch profile to populate Redux with roles and username
            const profile = await fetchUserProfile();
            const platformRoles = parsePlatformRoles(profile);

            dispatch(setAuth({
                user: { email, username: profile.username },
                platformRoles,
                token: authData.token,
            }));

            toast.success("Email verified! Welcome to HackSync 🎉");

            navigate(getRoleRedirectPath(platformRoles));

        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendOtp() {
        try {
            setIsLoading(true);
            await resendOtp(email);
            setTimeLeft(120);
            toast.success("OTP resent to your email.");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard
            title="Check Your Email 📬"
            subtitle={`We sent a 6-digit OTP to ${email}. Enter it below to activate your account.`}
        >
            <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-5">
                <AuthInput
                    label="OTP Code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    error={errors.otpCode?.message}
                    {...register("otpCode")}
                />

                <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Verify & Activate"}
                </Button>
            </form>

            <div className="mt-5 flex flex-col items-center gap-3">
                {timeLeft > 0 ? (
                    <p className="text-sm text-slate-400">
                        Resend OTP in <span className="font-semibold text-white">{formatTime(timeLeft)}</span>
                    </p>
                ) : (
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                        className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                    >
                        Resend OTP
                    </button>
                )}

                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                    >
                        ← Back to registration
                    </button>
                )}
            </div>
        </AuthCard>
    );
}
