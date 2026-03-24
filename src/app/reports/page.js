'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { reportsApi } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Calendar,
    Mail,
    FileOutput,
    RefreshCw,
    ChevronRight,
    CheckCircle2,
    Clock,
    ArrowLeft,
} from 'lucide-react';

function ReportsContent() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [reportType, setReportType] = useState('weekly');
    const [sendEmail, setSendEmail] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        reportsApi
            .list(20)
            .then((data) => setReports(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const res = await reportsApi.generate({
                report_type: reportType,
                period_start: null,
                period_end: null,
                send_email: sendEmail,
            });
            setReports((prev) => [res.data, ...prev]);
            setMessage('Report generated successfully!');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: 'linear',
                    }}
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
                    onClick={() => router.push('/dashboard  ')}
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
                            <FileText className="h-10 w-10 text-[#FD7979]" />
                            Mental Health Reports
                        </h1>
                        <p className="mt-2 text-lg text-slate-500">
                            Generate periodic summaries and track longitudinal
                            progress.
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
                                    <FileOutput className="h-5 w-5" />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Generate Report
                                </h2>
                            </div>

                            <div className="space-y-5">
                                <div className="relative group">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FDACAC] transition-colors group-focus-within:text-[#FD7979]" />
                                    <select
                                        value={reportType}
                                        onChange={(e) =>
                                            setReportType(e.target.value)
                                        }
                                        className="w-full appearance-none rounded-2xl border-2 border-transparent bg-white/70 py-3.5 pl-12 pr-10 text-slate-700 outline-none ring-1 ring-slate-200/50 transition-all focus:border-[#FDACAC] focus:bg-white focus:ring-[#FD7979]/20 shadow-sm"
                                    >
                                        <option value="weekly">
                                            Weekly Report
                                        </option>
                                        <option value="monthly">
                                            Monthly Report
                                        </option>
                                        <option value="quarterly">
                                            Quarterly Report
                                        </option>
                                        <option value="yearly">
                                            Yearly Report
                                        </option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                                        <svg
                                            className="h-4 w-4 text-slate-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl bg-white/50 p-4 ring-1 ring-slate-200/50">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEEAC9]/40 text-[#FD7979]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <label className="flex flex-1 cursor-pointer items-center justify-between gap-2 text-sm font-medium text-slate-700">
                                        <span>Send via email</span>
                                        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-within:ring-2 focus-within:ring-[#FDACAC] focus-within:ring-offset-2">
                                            <input
                                                type="checkbox"
                                                checked={sendEmail}
                                                onChange={(e) =>
                                                    setSendEmail(
                                                        e.target.checked,
                                                    )
                                                }
                                                className="peer sr-only"
                                            />
                                            <div
                                                className={`h-6 w-11 rounded-full transition-colors ${sendEmail ? 'bg-[#FD7979]' : 'bg-slate-300'}`}
                                            ></div>
                                            <span
                                                className={`absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition-transform ${sendEmail ? 'translate-x-5' : 'translate-x-0'}`}
                                            />
                                        </div>
                                    </label>
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
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileOutput className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                                            Generate Document
                                        </>
                                    )}
                                </motion.button>
                            </div>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            height: 0,
                                            marginTop: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            height: 'auto',
                                            marginTop: 16,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            height: 0,
                                            marginTop: 0,
                                        }}
                                        className={`overflow-hidden rounded-2xl text-sm font-medium ${
                                            message.startsWith('Error')
                                                ? 'bg-red-50 text-red-600 border border-red-100'
                                                : 'bg-[#FEEAC9]/80 text-[#d45656] border border-[#FEEAC9]'
                                        }`}
                                    >
                                        <div className="p-4">{message}</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </aside>

                    {/* Main Content Feed */}
                    <section className="lg:col-span-8">
                        <motion.div className="space-y-4">
                            <AnimatePresence mode="popLayout">
                                {reports.length > 0 ? (
                                    reports.map((report, index) => (
                                        <motion.div
                                            layout
                                            initial={{
                                                opacity: 0,
                                                y: 20,
                                                scale: 0.98,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={report.id}
                                        >
                                            <Link
                                                href={`/reports/${report.id}`}
                                                className="group flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-[#FDACAC] hover:shadow-xl hover:shadow-[#FDACAC]/20 sm:flex-row sm:items-center"
                                            >
                                                <div className="flex flex-1 items-center gap-5">
                                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEEAC9]/50 to-[#FDACAC]/20 text-[#FD7979] shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3">
                                                        <FileText className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="mb-1 text-lg font-bold text-slate-800 transition-colors group-hover:text-[#FD7979]">
                                                            {report.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                                                            <span className="rounded-full bg-[#FEEAC9]/60 px-2.5 py-0.5 uppercase tracking-wider text-[#d45656]">
                                                                {
                                                                    report.report_type
                                                                }
                                                            </span>
                                                            <span className="hidden sm:inline">
                                                                •
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {
                                                                    report.period_start
                                                                }{' '}
                                                                →{' '}
                                                                {
                                                                    report.period_end
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex w-full items-center justify-between sm:w-auto sm:flex-col sm:items-end sm:gap-2">
                                                    <div
                                                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ring-1 ${
                                                            report.status ===
                                                            'completed'
                                                                ? 'bg-emerald-50 text-emerald-600 ring-emerald-200/50'
                                                                : 'bg-amber-50 text-amber-600 ring-amber-200/50'
                                                        }`}
                                                    >
                                                        {report.status ===
                                                        'completed' ? (
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <Clock className="h-3.5 w-3.5" />
                                                        )}
                                                        <span className="capitalize">
                                                            {report.status}
                                                        </span>
                                                    </div>
                                                    <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                                                        {new Date(
                                                            report.created_at,
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            },
                                                        )}
                                                        <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-[#FD7979]" />
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#FDACAC]/30 bg-white/30 py-16 text-center shadow-inner backdrop-blur-sm"
                                    >
                                        <div className="mb-4 rounded-full bg-[#FEEAC9]/50 p-4">
                                            <FileOutput className="h-8 w-8 text-[#FD7979]" />
                                        </div>
                                        <p className="text-lg font-medium text-slate-600">
                                            No reports generated.
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Select a period and click Generate
                                            Document!
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    return (
        <ProtectedRoute>
            <ReportsContent />
        </ProtectedRoute>
    );
}
