'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-[#FFCDC9] bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                <Link
                    href={user ? '/dashboard' : '/'}
                    className="flex items-center gap-2"
                >
                    <Image
                        src="/assets/peach-transparent.png"
                        alt="Blessedly"
                        width={36}
                        height={36}
                    />
                    <span className="text-xl font-bold text-[#FD7979]">
                        blessedly
                    </span>
                </Link>

                {/* desktop nav */}
                <div className="hidden items-center gap-6 md:flex">
                    {user ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/mood"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Mood
                            </Link>
                            <Link
                                href="/chat"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Chat
                            </Link>
                            <Link
                                href="/notes"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Notes
                            </Link>
                            <Link
                                href="/analytics"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Analytics
                            </Link>
                            <Link
                                href="/reports"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Reports
                            </Link>
                            <Link
                                href="/profile"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt=""
                                        className="h-8 w-8 rounded-full"
                                        referrerPolicy='no-referrer'
                                    />
                                ) : (
                                    user.name?.charAt(0) || 'U'
                                )}
                            </Link>
                            <button
                                onClick={logout}
                                className="rounded-full bg-[#FD7979] px-4 py-1.5 text-sm text-white hover:bg-[#FDACAC]"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <a
                                href="#about"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                About
                            </a>
                            <a
                                href="#content"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Articles
                            </a>
                            <a
                                href="#contact"
                                className="text-sm text-gray-700 hover:text-[#FD7979]"
                            >
                                Contact
                            </a>
                        </>
                    )}
                </div>

                {/* mobile hamburger */}
                <button
                    className="md:hidden"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <svg
                        className="h-6 w-6 text-[#FD7979]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>

            {/* mobile menu */}
            {menuOpen && (
                <div className="border-t border-[#FFCDC9] bg-white px-4 py-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/mood"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Mood
                                </Link>
                                <Link
                                    href="/chat"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Chat
                                </Link>
                                <Link
                                    href="/notes"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Notes
                                </Link>
                                <Link
                                    href="/analytics"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Analytics
                                </Link>
                                <Link
                                    href="/reports"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Reports
                                </Link>
                                <Link
                                    href="/profile"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-fit rounded-full bg-[#FD7979] px-4 py-1.5 text-sm text-white"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <a
                                    href="#about"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    About
                                </a>
                                <a
                                    href="#content"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Articles
                                </a>
                                <a
                                    href="#contact"
                                    className="text-sm text-gray-700"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Contact
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
