'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import {
    moodApi,
    analyticsApi,
    reportsApi,
    notesApi,
    chatsApi,
} from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function DashboardContent() {
    const { user } = useAuth();
    const [todayMood, setTodayMood] = useState(null);
    const [moodLogged, setMoodLogged] = useState(false);
    const [recentNotes, setRecentNotes] = useState([]);
    const [recentChats, setRecentChats] = useState([]);
    const [latestAnalytics, setLatestAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.allSettled([
            moodApi.today(),
            notesApi.list(null, 5),
            chatsApi.list(5),
            analyticsApi.list(1),
        ]).then(([moodRes, notesRes, chatsRes, analyticsRes]) => {
            if (moodRes.status === 'fulfilled') {
                setTodayMood(moodRes.value.data);
                setMoodLogged(moodRes.value.logged_today);
            }
            if (notesRes.status === 'fulfilled')
                setRecentNotes(notesRes.value.data || []);
            if (chatsRes.status === 'fulfilled')
                setRecentChats(chatsRes.value.data || []);
            if (
                analyticsRes.status === 'fulfilled' &&
                analyticsRes.value.data?.length > 0
            ) {
                setLatestAnalytics(analyticsRes.value.data[0]);
            }
            setLoading(false);
        });
    }, []);

    const moodEmoji = (score) => {
        if (score >= 8) return '😊';
        if (score >= 6) return '🙂';
        if (score >= 4) return '😐';
        if (score >= 2) return '😟';
        return '😢';
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.name?.split(' ')[0]}! 👋
                </h1>
                <p className="text-gray-600">
                    Here&apos;s your mental health overview
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Today's Mood */}
                    <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Today&apos;s Mood
                        </h2>
                        {moodLogged && todayMood ? (
                            <div>
                                <div className="mb-2 text-4xl">
                                    {moodEmoji(todayMood.mood_score)}
                                </div>
                                <p className="text-2xl font-bold text-[#FD7979]">
                                    {todayMood.mood_score}/10
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    Energy: {todayMood.energy_level}/10
                                </p>
                                <Link
                                    href="/mood"
                                    className="mt-3 inline-block text-sm text-[#FD7979] hover:underline"
                                >
                                    Update →
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-3 text-gray-500">
                                    You haven&apos;t logged your mood today
                                </p>
                                <Link
                                    href="/mood"
                                    className="rounded-full bg-[#FD7979] px-4 py-2 text-sm text-white hover:bg-[#FDACAC]"
                                >
                                    Log Mood
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Quick Actions
                        </h2>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/chat"
                                className="rounded-lg bg-[#FEEAC9]/50 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEEAC9]"
                            >
                                💬 Chat with AI
                            </Link>
                            <Link
                                href="/notes"
                                className="rounded-lg bg-[#FEEAC9]/50 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEEAC9]"
                            >
                                📝 Add a Note
                            </Link>
                            <Link
                                href="/analytics"
                                className="rounded-lg bg-[#FEEAC9]/50 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEEAC9]"
                            >
                                📊 View Analytics
                            </Link>
                            <Link
                                href="/reports"
                                className="rounded-lg bg-[#FEEAC9]/50 px-4 py-2.5 text-sm text-gray-700 hover:bg-[#FEEAC9]"
                            >
                                📋 View Reports
                            </Link>
                        </div>
                    </div>

                    {/* Latest Analytics */}
                    <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Latest Insights
                        </h2>
                        {latestAnalytics ? (
                            <div>
                                <p className="mb-1 text-sm text-gray-500">
                                    {latestAnalytics.period_type} •{' '}
                                    {latestAnalytics.period_start} –{' '}
                                    {latestAnalytics.period_end}
                                </p>
                                <p className="mb-2 text-sm text-gray-700 line-clamp-3">
                                    {latestAnalytics.summary}
                                </p>
                                <p className="text-sm">
                                    Trend:{' '}
                                    <span className="font-semibold text-[#FD7979]">
                                        {latestAnalytics.overall_mood_trend}
                                    </span>
                                </p>
                                <Link
                                    href="/analytics"
                                    className="mt-3 inline-block text-sm text-[#FD7979] hover:underline"
                                >
                                    See all →
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-3 text-gray-500">
                                    No analytics generated yet
                                </p>
                                <Link
                                    href="/analytics"
                                    className="text-sm text-[#FD7979] hover:underline"
                                >
                                    Generate →
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Recent Notes */}
                    <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Recent Notes
                        </h2>
                        {recentNotes.length > 0 ? (
                            <div className="space-y-2">
                                {recentNotes.map((note) => (
                                    <div
                                        key={note.id}
                                        className="rounded-lg bg-[#FEEAC9]/30 px-3 py-2"
                                    >
                                        <p className="text-sm font-medium text-gray-900">
                                            {note.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {note.label}
                                        </p>
                                    </div>
                                ))}
                                <Link
                                    href="/notes"
                                    className="inline-block text-sm text-[#FD7979] hover:underline"
                                >
                                    View all →
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No notes yet.{' '}
                                <Link
                                    href="/notes"
                                    className="text-[#FD7979] hover:underline"
                                >
                                    Create one
                                </Link>
                            </p>
                        )}
                    </div>

                    {/* Recent Chats */}
                    <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6 md:col-span-2">
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Recent Chats
                        </h2>
                        {recentChats.length > 0 ? (
                            <div className="space-y-2">
                                {recentChats.map((chat) => (
                                    <Link
                                        key={chat.id}
                                        href={`/chat/${chat.id}`}
                                        className="flex items-center justify-between rounded-lg bg-[#FEEAC9]/30 px-4 py-3 hover:bg-[#FEEAC9]/50"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {chat.title}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {chat.chat_type} •{' '}
                                                {chat.message_count} messages
                                            </p>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {new Date(
                                                chat.updated_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </Link>
                                ))}
                                <Link
                                    href="/chat"
                                    className="inline-block text-sm text-[#FD7979] hover:underline"
                                >
                                    All chats →
                                </Link>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No chats yet.{' '}
                                <Link
                                    href="/chat"
                                    className="text-[#FD7979] hover:underline"
                                >
                                    Start one
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
