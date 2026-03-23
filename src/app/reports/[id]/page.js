"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { reportsApi } from "@/lib/api";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Calendar, BrainCircuit, Lightbulb, Target } from "lucide-react";

function ReportDetailContent({ reportId }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        reportsApi
            .get(reportId)
            .then((data) => setReport(data.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [reportId]);

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

    if (error) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-red-100 bg-red-50 p-8 text-center shadow-lg"
                >
                    <p className="mb-4 text-lg font-semibold text-red-600">{error}</p>
                    <Link
                        href="/reports"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-red-500 shadow-sm transition-transform hover:scale-105"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Reports
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fffafa] via-[#fff5f5] to-[#fef2f2] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href="/reports"
                        className="group inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Vault
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 shadow-2xl shadow-[#FDACAC]/10 backdrop-blur-xl"
                >
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-[#FEEAC9]/50 to-[#FDACAC]/30 blur-3xl" />

                    <div className="relative border-b border-[#FEEAC9]/50 p-8 sm:p-10">
                        <div className="mb-4 flex flex-wrap items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FDACAC] to-[#FD7979] px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-md">
                                <FileText className="h-3.5 w-3.5" />
                                {report.report_type} Report
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 shadow-sm ring-1 ring-slate-200/50">
                                <Calendar className="h-3.5 w-3.5 text-[#FDACAC]" />
                                Generated {new Date(report.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <h1 className="mb-4 text-3xl font-extrabold text-slate-800 sm:text-4xl">
                            {report.title}
                        </h1>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            Period: <span className="text-slate-700">{report.period_start}</span>
                            <span className="text-[#FDACAC]">→</span>
                            <span className="text-slate-700">{report.period_end}</span>
                        </div>
                    </div>

                    <div className="relative flex flex-col gap-8 p-8 sm:p-10 bg-white/40">
                        {report.content && (
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
                            >
                                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#2f1f1f]">
                                    <Target className="h-6 w-6 text-[#FD7979]" />
                                    Executive Summary
                                </h2>
                                <div className="prose prose-slate prose-p:leading-relaxed max-w-none text-slate-600 whitespace-pre-wrap">
                                    {report.content}
                                </div>
                            </motion.section>
                        )}

                        {report.ai_analysis && (
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-3xl border border-[#FEEAC9]/60 bg-gradient-to-br from-[#FEEAC9]/20 to-white p-6 shadow-sm sm:p-8"
                            >
                                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#d45656]">
                                    <BrainCircuit className="h-6 w-6" />
                                    AI Behavioral Analysis
                                </h2>
                                <div className="prose prose-slate prose-p:leading-relaxed max-w-none text-slate-700 whitespace-pre-wrap">
                                    {report.ai_analysis}
                                </div>
                            </motion.section>
                        )}

                        {report.recommendations && (
                            <motion.section
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-3xl border border-[#FDACAC]/30 bg-gradient-to-br from-[#FDACAC]/10 to-white p-6 shadow-sm sm:p-8"
                            >
                                <h2 className="mb-6 flex items-center gap-3 text-xl font-bold text-[#FD7979]">
                                    <Lightbulb className="h-6 w-6" />
                                    Actionable Recommendations
                                </h2>
                                <div className="prose prose-slate prose-p:leading-relaxed max-w-none text-slate-700 whitespace-pre-wrap">
                                    {report.recommendations}
                                </div>
                            </motion.section>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function ReportDetailPage({ params }) {
    const { id } = use(params);
    return (
        <ProtectedRoute>
            <ReportDetailContent reportId={id} />
        </ProtectedRoute>
    );
}
