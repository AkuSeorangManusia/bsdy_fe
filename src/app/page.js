'use client';

import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { authApi, contentApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function HeroSection() {
    const { user } = useAuth();
    const router = useRouter();

    const handleGetStarted = async () => {
        if (user) {
            router.push('/dashboard');
            return;
        }
        try {
            const data = await authApi.getGoogleUrl();
            window.location.href = data.url;
        } catch (err) {
            console.error('Failed to get Google URL:', err);
        }
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#FEEAC9] via-[#FFCDC9] to-[#FDACAC] py-24 md:py-36">
            <div className="mx-auto max-w-6xl px-4">
                <div className="flex flex-col items-center gap-12 md:flex-row">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
                            Your Mental Health,{' '}
                            <span className="text-[#FD7979]">Blessedly</span>{' '}
                            Cared For
                        </h1>
                        <p className="mb-8 max-w-lg text-lg text-gray-700">
                            Track your mood, chat with an AI companion, get
                            personalized insights, and build your coping toolkit
                            — all in one safe space.
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="rounded-full bg-[#FD7979] px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-[#FDACAC] hover:shadow-xl"
                        >
                            {user
                                ? 'Go to Dashboard'
                                : 'Get Started with Google'}
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Image
                            src="/assets/white-transparent.png"
                            alt="Blessedly"
                            width={350}
                            height={350}
                            className="drop-shadow-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function AboutSection() {
    const features = [
        {
            title: 'Mood Tracking',
            desc: 'Log your daily mood, energy, sleep, and more. See patterns emerge over time.',
            icon: '🌤️',
        },
        {
            title: 'AI Companion',
            desc: 'Chat with an empathetic AI that understands your mental health journey.',
            icon: '💬',
        },
        {
            title: 'Smart Analytics',
            desc: 'AI-generated insights and trend analysis based on your mood data.',
            icon: '📊',
        },
        {
            title: 'Coping Toolkit',
            desc: 'Build your personal collection of coping strategies and notes.',
            icon: '🧰',
        },
        {
            title: 'Health Reports',
            desc: 'Comprehensive weekly and monthly mental health reports delivered to you.',
            icon: '📋',
        },
        {
            title: 'Privacy First',
            desc: 'All your data is encrypted at rest with military-grade AES-256 encryption.',
            icon: '🔒',
        },
    ];

    return (
        <section id="about" className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
                    About <span className="text-[#FD7979]">Blessedly</span>
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
                    Blessedly is a mental health companion and tracker platform
                    designed to help you understand your emotional well-being
                    through AI-powered insights and tools.
                </p>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-2xl border border-[#FEEAC9] bg-[#FEEAC9]/20 p-6 transition hover:shadow-md"
                        >
                            <div className="mb-3 text-3xl">{f.icon}</div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-900">
                                {f.title}
                            </h3>
                            <p className="text-sm text-gray-600">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ContentSection() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        contentApi
            .list(6, 0)
            .then((data) => setArticles(data.data || []))
            .catch(() => {});
    }, []);

    return (
        <section id="content" className="bg-[#FEEAC9]/30 py-20">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
                    Articles & Resources
                </h2>
                <p className="mx-auto mb-12 max-w-2xl text-center text-gray-600">
                    Read curated articles on mental health, wellness, and
                    personal growth written by our team.
                </p>
                {articles.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <a
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                className="group overflow-hidden rounded-2xl border border-[#FFCDC9] bg-white transition hover:shadow-lg"
                            >
                                {article.cover_image_url && (
                                    <img
                                        src={article.cover_image_url}
                                        alt={article.title}
                                        className="h-40 w-full object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <h3 className="mb-2 font-semibold text-gray-900 group-hover:text-[#FD7979]">
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {article.excerpt || 'Read more...'}
                                    </p>
                                    {article.published_at && (
                                        <p className="mt-3 text-xs text-gray-400">
                                            {new Date(
                                                article.published_at,
                                            ).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No articles published yet. Check back soon!
                    </p>
                )}
            </div>
        </section>
    );
}

function ContactSection() {
    return (
        <section id="contact" className="bg-white py-20">
            <div className="mx-auto max-w-2xl px-4 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">
                    Get in Touch
                </h2>
                <p className="mb-8 text-gray-600">
                    Have questions or feedback? We&apos;d love to hear from you.
                </p>
                <div className="rounded-2xl border border-[#FFCDC9] bg-[#FEEAC9]/20 p-8">
                    <div className="mb-6 space-y-4">
                        <div>
                            <p className="font-semibold text-gray-900">Email</p>
                            <p className="text-gray-600">slaviors@gmail.com</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                Location
                            </p>
                            <p className="text-gray-600">
                                Made with ❤️ for TECHSOFT 2026
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500">
                        This project is a competition entry for TECHSOFT 2026.
                    </p>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="border-t border-[#FFCDC9] bg-[#FEEAC9]/30 py-8">
            <div className="mx-auto max-w-6xl px-4 text-center">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Blessedly — Mental Health
                    Companion & Tracker
                </p>
            </div>
        </footer>
    );
}

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <ContentSection />
            <ContactSection />
            <Footer />
        </>
    );
}
