"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import {
    moodApi,
    analyticsApi,
    reportsApi,
    notesApi,
    chatsApi,
} from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    MessageSquare,
    Activity,
    FileText,
    ChevronRight,
    BarChart2,
    Calendar,
    Star,
    Zap,
    Loader2,
} from "lucide-react";

// Animation Variants
const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

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
            if (moodRes.status === "fulfilled") {
                setTodayMood(moodRes.value.data);
                setMoodLogged(moodRes.value.logged_today);
            }
            if (notesRes.status === "fulfilled")
                setRecentNotes(notesRes.value.data || []);
            if (chatsRes.status === "fulfilled")
                setRecentChats(chatsRes.value.data || []);
            if (
                analyticsRes.status === "fulfilled" &&
                analyticsRes.value.data?.length > 0
            ) {
                setLatestAnalytics(analyticsRes.value.data[0]);
            }
            setLoading(false);
        });
    }, []);

    const moodEmoji = (score) => {
        if (score >= 8) return "🌟"; // Outstanding
        if (score >= 6) return "😊"; // Good
        if (score >= 4) return "😐"; // Okay
        if (score >= 2) return "🌧️"; // Low
        return "🌪️"; // Very Low
    };

    const getMoodColor = (score) => {
        if (score >= 8) return "from-emerald-400 to-emerald-500";
        if (score >= 6) return "from-[#FDACAC] to-[#FD7979]";
        if (score >= 4) return "from-[#FEEAC9] to-[#FDACAC]";
        if (score >= 2) return "from-indigo-300 to-indigo-400";
        return "from-slate-400 to-slate-500";
    };

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[100px] opacity-40 -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FDACAC]/30 to-transparent rounded-full blur-[80px] opacity-40 -z-10 -translate-x-1/2 pointer-events-none" />

            {loading
                ? <div className="flex h-screen items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-[#FD7979]" />
                  </div>
                : <motion.div
                      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10"
                      variants={containerVariant}
                      initial="hidden"
                      animate="visible"
                  >
                      {/* Header Section */}
                      <motion.header variants={itemVariant} className="mb-10">
                          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                              <div>
                                  <span className="inline-block px-3 py-1 bg-white border border-[#FEEAC9] text-[#FD7979] text-xs font-black uppercase tracking-wider rounded-full shadow-sm mb-3">
                                      {new Date().toLocaleDateString("en-US", {
                                          weekday: "long",
                                          month: "long",
                                          day: "numeric",
                                      })}
                                  </span>
                                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                                      Hello,{" "}
                                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">
                                          {user.name?.split(" ")[0]}
                                      </span>
                                      !
                                  </h1>
                                  <p className="text-slate-500 mt-2 text-lg">
                                      Here is your emotional wellness pulse.
                                  </p>
                              </div>

                              <Link
                                  href="/mood"
                                  className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:bg-[#FD7979] transition-all hover:-translate-y-1 active:scale-95 w-full md:w-auto"
                              >
                                  <Plus
                                      size={20}
                                      className="group-hover:rotate-90 transition-transform duration-300"
                                  />
                                  Log Today's Mood
                              </Link>
                          </div>
                      </motion.header>

                      {/* Stats Overview */}
                      <motion.div
                          variants={itemVariant}
                          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                      >
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-[#FDACAC]/20 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500" />
                              <div className="w-10 h-10 rounded-2xl bg-[#FDACAC]/20 text-[#FD7979] flex items-center justify-center mb-4">
                                  <Activity size={20} />
                              </div>
                              <p className="text-sm text-slate-500 font-semibold mb-1">
                                  Emotion State
                              </p>
                              <p className="text-2xl font-extrabold text-slate-800">
                                  {moodLogged && todayMood
                                      ? `${todayMood.mood_score}/10`
                                      : "---"}
                              </p>
                          </div>
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-[#FEEAC9]/30 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500" />
                              <div className="w-10 h-10 rounded-2xl bg-[#FEEAC9] text-[#FD7979] flex items-center justify-center mb-4">
                                  <Zap size={20} />
                              </div>
                              <p className="text-sm text-slate-500 font-semibold mb-1">
                                  Energy Level
                              </p>
                              <p className="text-2xl font-extrabold text-slate-800">
                                  {moodLogged && todayMood
                                      ? `${todayMood.energy_level}/10`
                                      : "---"}
                              </p>
                          </div>
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-slate-100 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500" />
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                                  <MessageSquare size={20} />
                              </div>
                              <p className="text-sm text-slate-500 font-semibold mb-1">
                                  Conversations
                              </p>
                              <p className="text-2xl font-extrabold text-slate-800">
                                  {recentChats.length}
                              </p>
                          </div>
                          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-slate-100 to-transparent rounded-full group-hover:scale-150 transition-transform duration-500" />
                              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                                  <FileText size={20} />
                              </div>
                              <p className="text-sm text-slate-500 font-semibold mb-1">
                                  Entries Logged
                              </p>
                              <p className="text-2xl font-extrabold text-slate-800">
                                  {recentNotes.length}
                              </p>
                          </div>
                      </motion.div>

                      <div className="grid lg:grid-cols-12 gap-8">
                          {/* Main Stream (Left Col) */}
                          <div className="lg:col-span-8 flex flex-col gap-8">
                              {/* Today's Highlight Box */}
                              <motion.div
                                  variants={itemVariant}
                                  className="relative bg-white rounded-[2rem] p-8 border border-[#FEEAC9]/60 shadow-[0_8px_30px_rgb(253,172,172,0.12)] overflow-hidden"
                              >
                                  {/* Decorative blob */}
                                  <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-[#FEEAC9]/40 to-transparent opacity-50 pointer-events-none" />

                                  <div className="flex items-center justify-between mb-8 relative z-10">
                                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                          <Star
                                              className="text-[#FD7979] fill-[#FD7979]"
                                              size={20}
                                          />{" "}
                                          Today's Reflection
                                      </h2>
                                  </div>

                                  {moodLogged && todayMood
                                      ? <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                            <div
                                                className={`shrink-0 w-32 h-32 rounded-[2rem] bg-gradient-to-br ${getMoodColor(todayMood.mood_score)} text-white flex items-center justify-center text-6xl shadow-xl shadow-[#FDACAC]/30 rotate-2`}
                                            >
                                                {moodEmoji(
                                                    todayMood.mood_score,
                                                )}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center text-center sm:text-left">
                                                <p className="text-sm font-bold tracking-widest text-[#FD7979] uppercase mb-2">
                                                    Current Pulse
                                                </p>
                                                <div className="flex items-baseline justify-center sm:justify-start gap-2 mb-2">
                                                    <span className="text-4xl font-extrabold text-slate-800">
                                                        {todayMood.mood_score}
                                                    </span>
                                                    <span className="text-lg text-slate-400 font-medium">
                                                        / 10 Score
                                                    </span>
                                                </div>
                                                {todayMood.note && (
                                                    <p className="text-slate-600 italic bg-white p-3 rounded-2xl border border-slate-100 line-clamp-2">
                                                        "{todayMood.note}"
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex sm:flex-col justify-center gap-2 shrink-0 w-full sm:w-auto">
                                                <Link
                                                    href="/mood"
                                                    className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 bg-white border-2 border-slate-100 hover:border-[#FD7979] text-slate-700 hover:text-[#FD7979] rounded-2xl font-bold transition-colors"
                                                >
                                                    Update
                                                </Link>
                                            </div>
                                        </div>
                                      : <div className="relative z-10 bg-slate-50 border-2 border-dashed border-[#FDACAC] rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl mb-4 shadow-sm relative">
                                                🤔
                                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FD7979] rounded-full animate-ping" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-2">
                                                How are you feeling?
                                            </h3>
                                            <p className="text-slate-500 mb-6 max-w-sm">
                                                Checking in with yourself is the
                                                first step. Take a moment to log
                                                your pulse.
                                            </p>
                                            <Link
                                                href="/mood"
                                                className="px-8 py-3.5 bg-gradient-to-r from-[#FD7979] to-[#FDACAC] text-white rounded-full font-bold shadow-lg shadow-[#FD7979]/30 hover:shadow-xl hover:scale-105 transition-all"
                                            >
                                                Check-in Now
                                            </Link>
                                        </div>}
                              </motion.div>

                              {/* Recent Conversations */}
                              <motion.div
                                  variants={itemVariant}
                                  className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm"
                              >
                                  <div className="flex items-center justify-between mb-6">
                                      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                          <MessageSquare
                                              className="text-[#FDACAC]"
                                              size={20}
                                          />{" "}
                                          Active Sessions
                                      </h2>
                                      <Link
                                          href="/chat"
                                          className="text-sm font-bold text-[#FD7979] hover:underline flex items-center"
                                      >
                                          View Library{" "}
                                          <ChevronRight size={16} />
                                      </Link>
                                  </div>

                                  {recentChats.length > 0
                                      ? <div className="grid gap-3">
                                            {recentChats.map((chat, i) => (
                                                <Link
                                                    key={chat.id}
                                                    href={`/chat/${chat.id}`}
                                                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-[#FEEAC9]/30 border border-transparent hover:border-[#FEEAC9] transition-all"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 shrink-0 group-hover:scale-110 transition-transform">
                                                            {i % 2 === 0
                                                                ? "🤖"
                                                                : "💬"}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 group-hover:text-[#FD7979] transition-colors">
                                                                {chat.title ||
                                                                    "Untiled Session"}
                                                            </h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 group-hover:bg-white transition-colors">
                                                                    {
                                                                        chat.chat_type
                                                                    }
                                                                </span>
                                                                <span className="text-xs text-slate-400">
                                                                    •{" "}
                                                                    {
                                                                        chat.message_count
                                                                    }{" "}
                                                                    messages
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex sm:block items-center justify-between sm:w-auto w-full border-t sm:border-0 border-slate-100 mt-2 sm:mt-0 pt-2 sm:pt-0">
                                                        <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                            <Calendar
                                                                size={12}
                                                            />
                                                            {new Date(
                                                                chat.updated_at,
                                                            ).toLocaleDateString(
                                                                undefined,
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                },
                                                            )}
                                                        </span>
                                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#FD7979] sm:mt-2 opacity-0 group-hover:opacity-100 transition-opacity ml-auto shadow-sm">
                                                            <ChevronRight
                                                                size={16}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                      : <div className="text-center py-10 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center text-slate-300 mb-3 shadow-sm">
                                                <MessageSquare size={24} />
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-700 mb-1">
                                                Silence is okay too.
                                            </h4>
                                            <p className="text-slate-500 text-sm mb-4">
                                                You have no ongoing chats right
                                                now.
                                            </p>
                                            <Link
                                                href="/chat"
                                                className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full font-bold text-slate-700 hover:border-[#FD7979] hover:text-[#FD7979] shadow-sm transition-all"
                                            >
                                                Start a conversation
                                            </Link>
                                        </div>}
                              </motion.div>
                          </div>

                          {/* Sidebar (Right Col) */}
                          <aside className="lg:col-span-4 flex flex-col gap-8">
                              {/* Action Pad */}
                              <motion.div
                                  variants={itemVariant}
                                  className="bg-slate-900 rounded-[2xl] p-1 rounded-3xl shadow-xl shadow-slate-900/10 relative overflow-hidden"
                              >
                                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FD7979] opacity-20 rounded-full blur-2xl pointer-events-none" />
                                  <div className="bg-slate-900 rounded-[22px] p-6 relative z-10 border border-slate-800">
                                      <h2 className="text-white font-bold mb-4 flex items-center gap-2">
                                          Quick Launch
                                      </h2>
                                      <div className="grid grid-cols-2 gap-3">
                                          <Link
                                              href="/chat"
                                              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-[#FD7979] text-slate-300 hover:text-white border border-slate-700 hover:border-transparent transition-all group"
                                          >
                                              <MessageSquare
                                                  size={24}
                                                  className="group-hover:-translate-y-1 transition-transform"
                                              />
                                              <span className="text-sm font-semibold">
                                                  New Chat
                                              </span>
                                          </Link>
                                          <Link
                                              href="/notes"
                                              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-[#FDACAC] text-slate-300 hover:text-slate-900 border border-slate-700 hover:border-transparent transition-all group"
                                          >
                                              <FileText
                                                  size={24}
                                                  className="group-hover:-translate-y-1 transition-transform"
                                              />
                                              <span className="text-sm font-semibold">
                                                  Jot Note
                                              </span>
                                          </Link>
                                          <Link
                                              href="/analytics"
                                              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-[#FEEAC9] text-slate-300 hover:text-slate-900 border border-slate-700 hover:border-transparent transition-all group"
                                          >
                                              <BarChart2
                                                  size={24}
                                                  className="group-hover:-translate-y-1 transition-transform"
                                              />
                                              <span className="text-sm font-semibold">
                                                  Analytics
                                              </span>
                                          </Link>
                                          <Link
                                              href="/reports"
                                              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl bg-slate-800 hover:bg-white text-slate-300 hover:text-slate-900 border border-slate-700 hover:border-transparent transition-all group"
                                          >
                                              <Activity
                                                  size={24}
                                                  className="group-hover:-translate-y-1 transition-transform"
                                              />
                                              <span className="text-sm font-semibold">
                                                  Reports
                                              </span>
                                          </Link>
                                      </div>
                                  </div>
                              </motion.div>

                              {/* Analytics Snippet */}
                              <motion.div
                                  variants={itemVariant}
                                  className="bg-white rounded-3xl p-6 border border-[#FEEAC9] shadow-[0_4px_20px_rgb(254,234,201,0.4)]"
                              >
                                  <div className="flex items-center gap-3 mb-4">
                                      <div className="w-10 h-10 rounded-full bg-[#FEEAC9]/50 flex items-center justify-center text-[#FD7979]">
                                          <BarChart2 size={20} />
                                      </div>
                                      <h2 className="text-lg font-bold text-slate-800">
                                          Weekly Insight
                                      </h2>
                                  </div>

                                  {latestAnalytics
                                      ? <div>
                                            <p className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold mb-4">
                                                {latestAnalytics.period_start} —{" "}
                                                {latestAnalytics.period_end}
                                            </p>
                                            <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium line-clamp-4">
                                                    "{latestAnalytics.summary}"
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-slate-600">
                                                    Trend Direction:{" "}
                                                    <span className="text-[#FD7979] uppercase ml-1 px-2 py-1 bg-[#FDACAC]/20 rounded-md">
                                                        {
                                                            latestAnalytics.overall_mood_trend
                                                        }
                                                    </span>
                                                </p>
                                                <Link
                                                    href="/analytics"
                                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-[#FD7979] text-slate-500 hover:text-white flex items-center justify-center transition-colors"
                                                >
                                                    <ChevronRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                      : <div className="text-center py-6">
                                            <p className="text-sm text-slate-500 max-w-[200px] mx-auto">
                                                Not enough data to generate
                                                insights yet. Keep logging!
                                            </p>
                                        </div>}
                              </motion.div>

                              {/* Recent Notes */}
                              <motion.div
                                  variants={itemVariant}
                                  className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative"
                              >
                                  <div className="flex items-center justify-between mb-5">
                                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                          <FileText
                                              className="text-slate-400"
                                              size={20}
                                          />{" "}
                                          Diary
                                      </h2>
                                      <Link
                                          href="/notes"
                                          className="text-xs font-bold text-slate-400 hover:text-[#FD7979] uppercase tracking-wider"
                                      >
                                          All View
                                      </Link>
                                  </div>

                                  {recentNotes.length > 0
                                      ? <div className="flex flex-col gap-3">
                                            {recentNotes.map((note) => (
                                                <div
                                                    key={note.id}
                                                    className="group p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#FDACAC] hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                                >
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FDACAC] scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                                                    <h4 className="font-bold text-slate-800 text-sm mb-1 truncate pr-4">
                                                        {note.title}
                                                    </h4>
                                                    <p className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 w-fit rounded-md uppercase tracking-wider">
                                                        {note.label}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                      : <p className="text-sm text-slate-400 text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                            Your diary is empty.
                                        </p>}
                              </motion.div>
                          </aside>
                      </div>
                  </motion.div>}
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
