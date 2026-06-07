// src/layouts/AuthLayout.jsx 

import { Outlet } from "react-router";


export default function AuthLayout() {
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