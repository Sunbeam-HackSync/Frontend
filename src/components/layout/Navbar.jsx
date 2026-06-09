// src/components/layout/Navbar.jsx

import { useState } from "react";

import { Link } from "react-router";

import { FaBars, FaTimes } from "react-icons/fa";

import Container from "../common/Container";

import Button from "../ui/Button";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/redux/authSlice";
import { logoutUser } from "../../features/auth/services/authService";
import { getDemoState } from "../../services/demoStore";

export default function Navbar() {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, user, platformRoles } = useSelector((state) => state.auth);

    const navLinks = [
        {
            name: "Home",
            path: "/"
        },
        {
            name: "About",
            path: "/about"
        },
        {
            name: "Explore",
            path: "/hackathons"
        }
    ];

    function goToDashboard() {
        if (platformRoles.includes("SUPER_ADMIN")) {
            navigate("/admin");
            return;
        }

        const demoState = getDemoState();
        const membership = demoState.hackathonMembers.find(
            (item) => item.userId === user?.id && item.status !== "REMOVED"
        );
        const hackathon = demoState.hackathons.find(
            (item) => item.id === membership?.hackathonId
        );

        navigate(hackathon ? `/workspace/${hackathon.slug}/overview` : "/hackathons");
    }

    function handleLogout() {
        logoutUser();
        dispatch(logout());
        navigate("/");
    }

    return (
        <header
            className="
                sticky
                top-0
                z-50
                border-b
                border-slate-800
                bg-slate-950/80
                backdrop-blur-lg
            "
        >

            <Container>

                {/* Main Navbar */}
                <nav
                    className="
                        flex
                        items-center
                        justify-between
                        h-18
                    "
                >

                    {/* Logo */}
                    <Link
                        to="/"
                        className="
                            text-3xl
                            font-bold
                            tracking-wide
                        "
                    >
                        Hack
                        <span className="text-indigo-500">
                            Forge
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div
                        className="
                            hidden
                            md:flex
                            items-center
                            gap-8
                        "
                    >

                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="
                                    text-slate-300
                                    hover:text-white
                                    transition
                                    text-xl
                                "
                            >
                                {link.name}
                            </Link>
                        ))}

                    </div>

                    {/* Desktop Actions */}
                    <div
                        className="
                            hidden
                            md:flex
                            items-center
                            gap-3
                        "
                    >

                        {isAuthenticated ? (
                            <>
                                <Button variant="secondary" onClick={goToDashboard}>
                                    Dashboard
                                </Button>

                                <Button onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="secondary" onClick={() => navigate("/login")}>
                                    Login
                                </Button>

                                <Button onClick={() => navigate("/register")}>
                                    Get Started
                                </Button>
                            </>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="
                            md:hidden
                            text-2xl
                            text-white
                        "
                        onClick={() => setIsOpen(!isOpen)}
                    >

                        {
                            isOpen
                                ? <FaTimes />
                                : <FaBars />
                        }

                    </button>

                </nav>

                {/* Mobile Menu */}
                <div
                    className={`
                        md:hidden
                        overflow-hidden
                        transition-all
                        duration-300
                        ${isOpen ? "max-h-100 py-6" : "max-h-0"}
                    `}
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-5
                            border-t
                            border-slate-800
                            pt-6
                        "
                    >

                        {/* Mobile Links */}
                        {
                            navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="
                                        text-slate-300
                                        hover:text-white
                                        transition
                                    "
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))
                        }

                        {/* Mobile Buttons */}
                        <div className="flex flex-col gap-3 pt-2">

                            {isAuthenticated ? (
                                <>
                                    <Button variant="secondary" onClick={goToDashboard}>
                                        Dashboard
                                    </Button>

                                    <Button onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={() => navigate("/login")}>
                                        Login
                                    </Button>

                                    <Button onClick={() => navigate("/register")}   >
                                        Get Started
                                    </Button>
                                </>
                            )}

                        </div>

                    </div>

                </div>

            </Container>

        </header>
    );
}
