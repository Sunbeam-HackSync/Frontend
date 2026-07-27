// src/features/auth/pages/LoginPage.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

import { loginSchema } from "../utils/authValidation";
import { getRoleRedirectPath } from "../../../utils/navigation";
import { loginUser, fetchUserProfile, parsePlatformRoles } from "../services/authService";
import { setAuth, setLoading } from "../redux/authSlice";

import Button from "../../../components/ui/Button";
import AuthCard from "../components/AuthCard";
import AuthInput from "../components/AuthInput";
import AuthSideContent from "../components/AuthSideContent";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading } = useSelector((state) => state.auth);

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

            // loginUser saves the JWT to cookies and returns { token, expiresIn }
            const authData = await loginUser(data.email, data.password);

            // Fetch the user profile to get username and roles
            const profile = await fetchUserProfile(); // { username, roles }

            const platformRoles = parsePlatformRoles(profile);

            dispatch(setAuth({
                user: { email: data.email, username: profile.username },
                platformRoles,
                token: authData.token,
            }));

            toast.success("Welcome back!");

            navigate(getRoleRedirectPath(platformRoles));

        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <>
            <AuthSideContent />
            <div className="flex items-center justify-center p-6 md:p-10">
                <AuthCard
                    title="Welcome Back"
                    subtitle="Login to continue your hackathon journey."
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="on">
                        <AuthInput
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        <AuthInput
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        <Button className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-slate-400">
                        Don't have an account?
                        <Link to="/register" className="ml-2 text-indigo-400 hover:text-indigo-300">
                            Register
                        </Link>
                    </p>
                </AuthCard>
            </div>
        </>
    );
}
