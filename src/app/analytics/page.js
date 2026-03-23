"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRouter } from "next/navigation";
import { analyticsApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    BrainCircuit, Calendar, TrendingUp, TrendingDown, Minus,
    Lightbulb, Target, Sparkles, RefreshCw, BarChart2, ArrowLeft
} from "lucide-react";

function AnalyticsContent() {
    const router = useRouter();
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("weekly");
    const [message, setMessage] = useState("");

    useEffect(() => {
        analyticsApi
            .list(20)
            .then((data) => setAnalytics(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage("");
        try {
            const res = await analyticsApi.generate(selectedPeriod);
            setAnalytics((prev) => [res.data, ...prev]);
            setMessage("Analytics generated successfully!");
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const trendColor = (trend) => {
        if (trend === "improving") return "text-emerald-600 bg-emerald-50 ring-emerald-200/50";
        if (trend === "declining") return "text-rose-600 bg-rose-50 ring-rose-200/50";
        return "text-amber-600 bg-amber-50 ring-amber-200/50";
    };

    const TrendIcon = ({ trend, className }) => {
        if (trend === "improving") return <TrendingUp className={className} />;
        if (trend === "declining") return <TrendingDown className={className} />;
        return <Minus className={className} />;
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-10 w-10 rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979]"
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fffafa] via-[#fff5f5] to-[#fef2f2] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </motion.button>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
                >
                    <div>
                        <h1 className="flex items-center gap-3 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC] sm:text-5xl">
                            <BrainCircuit className="h-10 w-10 text-[#FD7979]" />
                            Analytics
                        </h1>
                        <p className="mt-2 text-lg text-slate-500">
                            Review trends and auto-generated AI insight snapshots.
                        </p>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Sidebar / Generator */}
                    <aside className="lg:col-span-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="sticky top-24 overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-[#FDACAC]/10 backdrop-blur-xl"
                        >
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-[#FEEAC9]/50 p-2.5 text-[#FD7979]">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Generate Report</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FDACAC] transition-colors group-focus-within:text-[#FD7979]" />
                                    <select
                                        value={selectedPeriod}
                                        onChange={(e) => setSelectedPeriod(e.target.value)}
                                        className="w-full appearance-none rounded-2xl border-2 border-transparent bg-white/70 py-3.5 pl-12 pr-10 text-slate-700 outline-none ring-1 ring-slate-200/50 transition-all focus:border-[#FDACAC] focus:bg-white focus:ring-[#FD7979]/20 shadow-sm"
                                    >
                                        <option value="weekly">Weekly Overview</option>
                                        <option value="monthly">Monthly Deep Dive</option>
                                        <option value="quarterly">Quarterly Review</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FDACAC] to-[#FD7979] px-6 py-4 font-bold text-white shadow-lg shadow-[#FD7979]/30 transition-all hover:shadow-[#FD7979]/50 disabled:opacity-70 disabled:shadow-none"
                                >
                                    {generating ? (
                                        <>
                                            <RefreshCw className="h-5 w-5 animate-spin" />
                                            Analyzing Data...
                                        </>
                                    ) : (
                                        <>
                                            <BarChart2 className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            Generate Insights
                                        </>
                                    )}
                                </motion.button>
                            </div>
                            
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        className={`overflow-hidden rounded-2xl text-sm font-medium ${
                                            message.startsWith("Error")
                                                ? "bg-red-50 text-red-600 border border-red-100"
                                                : "bg-[#FEEAC9]/80 text-[#d45656] border border-[#FEEAC9]"
                                        }`}
                                    >
                                        <div className="p-4">{message}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </aside>

                    {/* Main Content Feed */}
                    <section className="space-y-6 lg:col-span-8">
                        <AnimatePresence mode="popLayout">
                            {analytics.length > 0 ? (
                                analytics.map((item, index) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={item.id}
                                        className="group relative overflow-hidden rounded-3xl border border-white/60 bg-white/70 p-1 shadow-lg shadow-[#FDACAC]/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FDACAC]/20"
                                    >
                                        <div className="absolute top-0 right-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-[#FEEAC9]/40 to-[#FDACAC]/20 blur-3xl transition-transform duration-500 group-hover:scale-150" />
                                        
                                        <div className="relative rounded-[22px] border border-white/50 bg-white/40 p-6 sm:p-8">
                                            {/* Date Banner & Score */}
                                            <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#FEEAC9]/50 pb-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-[#FDACAC] to-[#FD7979] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                                            {item.period_type}
                                                        </span>
                                                        {item.avg_mood_score && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm ring-1 ring-slate-200/50">
                                                                Avg Mood: <span className="text-[#FD7979]">{item.avg_mood_score}/10</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                                        <Calendar className="h-4 w-4 text-[#FDACAC]" />
                                                        {new Date(item.period_start).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                                                        <span className="text-slate-300">→</span>
                                                        {new Date(item.period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                </div>
                                                
                                                <div className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-bold shadow-sm ring-1 ${trendColor(item.overall_mood_trend)}`}>
                                                    <TrendIcon trend={item.overall_mood_trend} className="h-4 w-4" />
                                                    <span className="capitalize">{item.overall_mood_trend}</span>
                                                </div>
                                            </div>

                                            {/* Report Sections */}
                                            <div className="grid gap-6 sm:grid-cols-1">
                                                {item.summary && (
                                                    <div className="rounded-2xl bg-white/60 p-5 shadow-sm ring-1 ring-slate-100">
                                                        <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#FD7979]">
                                                            <Target className="h-4 w-4" />
                                                            Summary Outline
                                                        </h3>
                                                        <p className="text-sm leading-relaxed text-slate-600">{item.summary}</p>
                                                    </div>
                                                )}
                                                
                                                <div className="grid gap-6 sm:grid-cols-2">
                                                    {item.insights && (
                                                        <div className="rounded-2xl bg-gradient-to-br from-[#FEEAC9]/30 to-white/60 p-5 shadow-sm ring-1 ring-[#FEEAC9]/50">
                                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#d45656]">
                                                                <Lightbulb className="h-4 w-4" />
                                                                Key Insights
                                                            </h3>
                                                            <p className="text-sm leading-relaxed text-slate-600">{item.insights}</p>
                                                        </div>
                                                    )}
                                                    {item.recommendations && (
                                                        <div className="rounded-2xl bg-gradient-to-br from-[#FDACAC]/15 to-white/60 p-5 shadow-sm ring-1 ring-[#FDACAC]/30">
                                                            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold text-[#FD7979]">
                                                                <BrainCircuit className="h-4 w-4" />
                                                                Recommendations
                                                            </h3>
                                                            <p className="text-sm leading-relaxed text-slate-600">{item.recommendations}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#FDACAC]/30 bg-white/30 py-16 text-center shadow-inner backdrop-blur-sm"
                                >
                                    <div className="mb-4 rounded-full bg-[#FEEAC9]/50 p-4">
                                        <BarChart2 className="h-8 w-8 text-[#FD7979]" />
                                    </div>
                                    <p className="text-lg font-medium text-slate-600">No analytics data yet.</p>
                                    <p className="text-sm text-slate-400">Select a period and click Generate Insights!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <AnalyticsContent />
        </ProtectedRoute>
    );
}
