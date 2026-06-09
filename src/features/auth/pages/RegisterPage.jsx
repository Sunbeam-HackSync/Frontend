// src/features/auth/pages/RegisterPage.jsx

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, Link } from "react-router";

import {
    registerSchema
} from "../utils/authValidation";

import {
    registerUser
} from "../services/authService";

import Button from "../../../components/ui/Button";

import AuthCard from "../components/AuthCard";

import AuthInput from "../components/AuthInput";

import AuthSideContent from "../components/AuthSideContent";

export default function RegisterPage() {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm({
        resolver: zodResolver(registerSchema)
    });

    async function onSubmit(data) {

        try {

            await registerUser(data);

            navigate("/login");
        }

        catch (error) {

            setError("root", {
                message: error.message
            });
        }
    }

    return (
        <>
            <div
                className="
                    flex
                    items-center
                    justify-center
                    p-6
                    md:p-10
                "
            >

                <AuthCard
                    title="Create Account"
                    subtitle="Join HackSync and start building amazing projects."
                >

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                    >

                        <AuthInput
                            label="Full Name"
                            placeholder="Enter your full name"
                            error={errors.fullName?.message}
                            {...register("fullName")}
                        />

                        <AuthInput
                            label="Email Address"
                            type="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="Create password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <AuthInput
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />

                        {
                            errors.root && (
                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-red-500/20
                                        bg-red-500/10
                                        px-4
                                        py-3
                                        text-sm
                                        text-red-400
                                    "
                                >
                                    {errors.root.message}
                                </div>
                            )
                        }

                        <Button className="w-full">
                            Create Account
                        </Button>

                    </form>

                    <p
                        className="
                            mt-8
                            text-center
                            text-slate-400
                        "
                    >

                        Already have an account?

                        <Link
                            to="/login"
                            className="
                                ml-2
                                text-indigo-400
                            "
                        >
                            Login
                        </Link>

                    </p>

                </AuthCard>

            </div>

            <AuthSideContent />


        </>
    );
}