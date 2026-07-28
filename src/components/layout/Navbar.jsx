// src/components/layout/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { FaBars, FaTimes, FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";

import Container from "../common/Container";
import Button from "../ui/Button";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/redux/authSlice";
import { logoutUser } from "../../features/auth/services/authService";
import { getRoleRedirectPath } from "../../utils/navigation";

// ─── User Profile Dropdown ────────────────────────────────────────────────────
function UserProfileDropdown({ handleLogout }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
                <FaUserCircle size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 py-2 shadow-xl shadow-black/50 z-50">
                    <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white cursor-pointer"
                    >
                        <FaUser size={13} /> My Profile
                    </Link>
                    <div className="my-1 border-t border-slate-800"></div>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                        }}
                        className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-400 transition hover:bg-slate-800 hover:text-red-300 cursor-pointer"
                    >
                        <FaSignOutAlt size={13} /> Logout
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
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
        navigate(getRoleRedirectPath(platformRoles));
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
                            Sync
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

                                <UserProfileDropdown handleLogout={handleLogout} />
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
                                    <Button variant="secondary" onClick={() => { setIsOpen(false); goToDashboard(); }}>
                                        Dashboard
                                    </Button>

                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
                                    >
                                        <FaUser size={13} /> My Profile
                                    </Link>

                                    <Button onClick={() => { setIsOpen(false); handleLogout(); }}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="secondary" onClick={() => { setIsOpen(false); navigate("/login"); }}>
                                        Login
                                    </Button>

                                    <Button onClick={() => { setIsOpen(false); navigate("/register"); }}>
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

