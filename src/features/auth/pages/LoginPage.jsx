// src/features/auth/pages/LoginPage.jsx

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, Link } from "react-router";

import {
    loginSchema
} from "../utils/authValidation";

import {
    loginUser
} from "../services/authService";

import {
    setAuth,
    setError,
    setLoading
} from "../redux/authSlice";

import Button from "../../../components/ui/Button";

import AuthCard from "../components/AuthCard";

import AuthInput from "../components/AuthInput";

import AuthSideContent from "../components/AuthSideContent";

import { getDemoState } from "../../../services/demoStore";

export default function LoginPage() {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { loading, error } = useSelector(
        (state) => state.auth
    );

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema)
    });

    async function onSubmit(data) {

        try {

            dispatch(setLoading(true));

            dispatch(setError(null));

            const authData = await loginUser(
                data.email,
                data.password
            );

            dispatch(setAuth(authData));

            const isSuperAdmin = authData.platformRoles.includes("SUPER_ADMIN");    
            if (isSuperAdmin) {

                navigate("/admin");
            }else {

                const demoState = getDemoState();
                const membership = demoState.hackathonMembers.find(
                    (item) => item.userId === authData.user.id && item.status !== "REMOVED"
                );
                const hackathon = demoState.hackathons.find(
                    (item) => item.id === membership?.hackathonId
                );

                navigate(
                    hackathon
                        ? `/workspace/${hackathon.slug}/overview`
                        : "/hackathons"
                );
            }

        }

        catch (error) {

            dispatch(setError(error.message));
        }

        finally {

            dispatch(setLoading(false));
        }
    }

    return (
        <>

            <AuthSideContent />

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
                    title="Welcome Back"
                    subtitle="Login to continue your hackathon journey."
                >

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >

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
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        {
                            error && (
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
                                    {error}
                                </div>
                            )
                        }

                        <Button
                            className="w-full"
                            disabled={loading}
                        >
                            {
                                loading
                                    ? "Logging in..."
                                    : "Login"
                            }
                        </Button>

                    </form>

                    <p
                        className="
                            mt-8
                            text-center
                            text-slate-400
                        "
                    >

                        Don't have an account?

                        <Link
                            to="/register"
                            className="
                                ml-2
                                text-indigo-400
                            "
                        >
                            Register
                        </Link>

                    </p>

                </AuthCard>

            </div>

        </>
    );
}
