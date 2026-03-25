'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { authApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, ChevronRight } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    // helper logic to close menu on mobile
    const closeMenu = () => setMenuOpen(false);

    const handleSignUp = async () => {
        try {
            const data = await authApi.getGoogleUrl();
            window.location.href = data.url;
        } catch (err) {
            console.error("Failed to get Google URL:", err);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-[#FEEAC9]/60 shadow-[0_8px_30px_rgb(253,172,172,0.08)] transition-all">
            <div className="mx-auto flex h-20 w-[min(1280px,100%-2rem)] items-center justify-between">
                {/* Logo Section */}
                <Link
                    href={'/'}
                    onClick={closeMenu}
                    className="group flex items-center transition-all duration-300"
                >
                    <div className="relative flex h-10 w-10 items-center justify-center">
                        <Image
                            src="/assets/peach-transparent.png"
                            alt="Blessedly"
                            width={36}
                            height={36}
                            className="object-contain transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-md"
                        />
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center md:flex lg:gap-2 gap-1">
                    {user ? (
                        <>
                            {/* Main App Links */}
                            {[
                                'Dashboard',
                                'Mood',
                                'Chat',
                                'Notes',
                                'Analytics',
                                'Reports',
                            ].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="relative px-4 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 rounded-full hover:text-[#FD7979] hover:bg-[#FEEAC9]/40 after:absolute after:bottom-1.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-[#FD7979] after:opacity-0 hover:after:opacity-100 after:transition-opacity content-['']"
                                >
                                    {item}
                                </Link>
                            ))}

                            {/* Admin Links */}
                            {user.role === 'admin' && (
                                <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[#FEEAC9]">
                                    <Link
                                        href="/admin/content"
                                        className="px-4 py-2 text-sm font-bold text-[#FD7979] bg-[#FDACAC]/15 transition-all rounded-full hover:bg-[#FDACAC]/30"
                                    >
                                        Content
                                    </Link>
                                    <Link
                                        href="/admin/logs"
                                        className="px-4 py-2 text-sm font-bold text-[#FD7979] bg-[#FDACAC]/15 transition-all rounded-full hover:bg-[#FDACAC]/30"
                                    >
                                        Logs
                                    </Link>
                                </div>
                            )}

                            <div className="h-8 w-[2px] bg-[#FEEAC9] mx-2 rounded-full" />

                            {/* Profile Entry */}
                            <Link
                                href="/profile"
                                className="flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:shadow-lg rounded-full ring-2 ring-transparent hover:ring-[#FDACAC]"
                            >
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="Profile"
                                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FDACAC] to-[#FD7979] text-white font-bold shadow-sm">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </Link>

                            {/* Logout Action */}
                            <button
                                onClick={logout}
                                className="group ml-2 flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-slate-800 rounded-full transition-all duration-300 hover:bg-[#FD7979] shadow-md hover:shadow-xl hover:shadow-[#FD7979]/30 active:scale-95"
                            >
                                <span>Logout</span>
                                <LogOut
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Landing Page Anchor Links */}
                            <a
                                href="#about"
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all rounded-full hover:text-[#FD7979] hover:bg-[#FEEAC9]/40"
                            >
                                About
                            </a>
                            <a
                                href="#content"
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all rounded-full hover:text-[#FD7979] hover:bg-[#FEEAC9]/40"
                            >
                                Articles
                            </a>
                            <a
                                href="#contact"
                                className="px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all rounded-full hover:text-[#FD7979] hover:bg-[#FEEAC9]/40"
                            >
                                Contact
                            </a>
                            <button
                                onClick={handleSignUp}
                                className="ml-2 px-6 py-2.5 text-sm font-bold text-white bg-[#FD7979] rounded-full transition-all duration-300 hover:bg-[#FDACAC] shadow-md hover:shadow-xl hover:shadow-[#FD7979]/30 active:scale-95"
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger Toggle */}
                <button
                    className="relative z-50 p-3 rounded-2xl bg-[#FEEAC9]/30 text-[#FD7979] md:hidden transition-all hover:bg-[#FDACAC]/30 active:scale-90"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    <AnimatePresence mode="wait">
                        {menuOpen ? (
                            <motion.div
                                key="close"
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X size={24} strokeWidth={2.5} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ opacity: 0, rotate: 90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: -90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Menu size={24} strokeWidth={2.5} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>
            </div>

            {/* Mobile Menu Interactive Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 w-full overflow-hidden bg-white/95 backdrop-blur-3xl shadow-2xl shadow-[#FD7979]/10 border-b border-[#FEEAC9]/60 md:hidden"
                    >
                        <div className="flex flex-col gap-2 p-6 mx-auto w-[min(100%,400px)] max-h-[calc(100dvh-5rem)] overflow-y-auto pb-8">
                            {user ? (
                                <>
                                    {/* User Info Mobile Header */}
                                    <div className="flex items-center gap-4 p-4 mb-2 rounded-2xl bg-[#FEEAC9]/20 border border-[#FEEAC9]/50">
                                        {user.avatar_url ? (
                                            <img
                                                src={user.avatar_url}
                                                alt="Profile"
                                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-md"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FDACAC] to-[#FD7979] text-white font-bold text-lg shadow-md">
                                                {user.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                        <div className="flex-1 overflow-hidden">
                                            <p className="font-bold text-slate-800 truncate">
                                                {user.name || 'User'}
                                            </p>
                                            <p className="text-xs text-slate-500 font-medium truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Main Links Mapping */}
                                    {[
                                        'Dashboard',
                                        'Mood',
                                        'Chat',
                                        'Notes',
                                        'Analytics',
                                        'Reports',
                                    ].map((item) => (
                                        <Link
                                            key={item}
                                            href={`/${item.toLowerCase()}`}
                                            className="group flex items-center justify-between rounded-2xl p-4 text-base font-bold text-slate-700 hover:bg-[#FDACAC]/10 hover:text-[#FD7979] transition-all active:scale-[0.98]"
                                            onClick={closeMenu}
                                        >
                                            <span>{item}</span>
                                            <ChevronRight
                                                size={18}
                                                className="text-slate-300 group-hover:text-[#FD7979] group-hover:translate-x-1 transition-all"
                                            />
                                        </Link>
                                    ))}

                                    {/* Mobile Admin Block */}
                                    {user.role === 'admin' && (
                                        <div className="mt-4 p-4 rounded-2xl bg-[#FDACAC]/10 border border-[#FDACAC]/30 flex flex-col gap-2">
                                            <p className="text-xs font-black uppercase text-[#FD7979] tracking-wider mb-1">
                                                Admin Tools
                                            </p>
                                            <Link
                                                href="/admin/content"
                                                className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-[#FD7979] bg-white/50 hover:bg-white transition-colors"
                                                onClick={closeMenu}
                                            >
                                                Content Manager
                                                <ChevronRight size={16} />
                                            </Link>
                                            <Link
                                                href="/admin/logs"
                                                className="flex items-center justify-between rounded-xl p-3 text-sm font-bold text-[#FD7979] bg-white/50 hover:bg-white transition-colors"
                                                onClick={closeMenu}
                                            >
                                                System Logs
                                                <ChevronRight size={16} />
                                            </Link>
                                        </div>
                                    )}

                                    <div className="h-px w-full bg-[#FEEAC9]/50 my-4" />

                                    <Link
                                        href="/profile"
                                        className="group flex items-center justify-between rounded-2xl p-4 text-base font-bold text-slate-700 hover:bg-[#FDACAC]/10 hover:text-[#FD7979] transition-all active:scale-[0.98]"
                                        onClick={closeMenu}
                                    >
                                        <span className="flex items-center gap-3">
                                            <User size={20} /> My Profile
                                        </span>
                                        <ChevronRight
                                            size={18}
                                            className="text-slate-300 group-hover:text-[#FD7979] transition-colors"
                                        />
                                    </Link>

                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            logout();
                                        }}
                                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FD7979] p-4 text-base font-bold text-white shadow-lg shadow-[#FD7979]/20 transition-all hover:bg-[#FDACAC] active:scale-[0.98]"
                                    >
                                        <LogOut size={20} />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <a
                                        href="#about"
                                        onClick={closeMenu}
                                        className="group flex items-center justify-between rounded-2xl p-4 text-base font-bold text-slate-700 hover:bg-[#FDACAC]/10 hover:text-[#FD7979] transition-all"
                                    >
                                        About Blessedly{' '}
                                        <ChevronRight
                                            size={18}
                                            className="text-slate-300 group-hover:text-[#FD7979] group-hover:translate-x-1 transition-all"
                                        />
                                    </a>
                                    <a
                                        href="#content"
                                        onClick={closeMenu}
                                        className="group flex items-center justify-between rounded-2xl p-4 text-base font-bold text-slate-700 hover:bg-[#FDACAC]/10 hover:text-[#FD7979] transition-all"
                                    >
                                        Articles & Resources{' '}
                                        <ChevronRight
                                            size={18}
                                            className="text-slate-300 group-hover:text-[#FD7979] group-hover:translate-x-1 transition-all"
                                        />
                                    </a>
                                    <a
                                        href="#contact"
                                        onClick={closeMenu}
                                        className="group flex items-center justify-between rounded-2xl p-4 text-base font-bold text-slate-700 hover:bg-[#FDACAC]/10 hover:text-[#FD7979] transition-all"
                                    >
                                        Contact Us{' '}
                                        <ChevronRight
                                            size={18}
                                            className="text-slate-300 group-hover:text-[#FD7979] group-hover:translate-x-1 transition-all"
                                        />
                                    </a>
                                    <button
                                        onClick={() => {
                                            closeMenu();
                                            handleSignUp();
                                        }}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FD7979] p-4 text-base font-bold text-white shadow-lg shadow-[#FD7979]/20 transition-all hover:bg-[#FDACAC] active:scale-[0.98]"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
