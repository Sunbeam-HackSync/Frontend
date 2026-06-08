// src/layouts/AuthLayout.jsx 

import { Outlet } from "react-router";

import { useSelector } from "react-redux";

import { Navigate } from "react-router";


export default function AuthLayout() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div
            className="
                min-h-screen
                bg-slate-950
                text-white
                grid
                lg:grid-cols-2
            "
        >

            <Outlet />

        </div>
    );
}