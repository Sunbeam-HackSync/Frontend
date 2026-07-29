// src/layouts/AuthLayout.jsx 

import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import Navbar from "../components/layout/Navbar";

export default function AuthLayout() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
            <Navbar />
            <div className="flex-1 grid lg:grid-cols-2">
                <Outlet />
            </div>
        </div>
    );
}