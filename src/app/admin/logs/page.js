"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { logsApi } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ShieldAlert,
    Activity,
    Users,
    KeySquare,
    ChevronLeft,
    ChevronRight,
    Search,
    Clock,
    Filter,
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

function AdminLogsPage() {
    const router = useRouter();
    const [tab, setTab] = useState("auth"); // auth | activity | admin
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 20;

    const fetchLogs = useCallback(
        async (logTab, logPage) => {
            setLoading(true);
            try {
                let data;
                if (logTab === "auth") {
                    data = await logsApi.auth(logPage, perPage);
                } else if (logTab === "activity") {
                    data = await logsApi.activity(logPage, perPage);
                } else {
                    data = await logsApi.admin(logPage, perPage);
                }
                setLogs(data.data?.data || []);
                setTotal(data.data?.total || 0);
            } catch {
                setLogs([]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        },
        [perPage],
    );

    useEffect(() => {
        setPage(1);
        fetchLogs(tab, 1);
    }, [tab, fetchLogs]);

    useEffect(() => {
        fetchLogs(tab, page);
    }, [page, tab, fetchLogs]);

    const totalPages = Math.ceil(total / perPage);

    const getTabIcon = (key) => {
        if (key === "auth") return <KeySquare size={16} />;
        if (key === "activity") return <Activity size={16} />;
        if (key === "admin") return <ShieldAlert size={16} />;
        return <Filter size={16} />;
    };

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[100px] opacity-40 -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FDACAC]/30 to-transparent rounded-full blur-[80px] opacity-40 -z-10 -translate-x-1/2 pointer-events-none" />

            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10"
                variants={containerVariant}
                initial="hidden"
                animate="visible"
            >
                {/* Back Button */}
                <motion.button
                    variants={itemVariant}
                    onClick={() => router.back()}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Back
                </motion.button>

                {/* Header Section */}
                <motion.header variants={itemVariant} className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-block px-3 py-1 bg-white border border-[#FEEAC9] text-[#FD7979] text-xs font-black uppercase tracking-wider rounded-full shadow-sm mb-3">
                                System Monitor
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                                Audit{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">
                                    Logs
                                </span>
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                Detailed history of authentication, user
                                activities, and administrative events.
                            </p>
                        </div>
                    </div>
                </motion.header>

                {/* Tabs */}
                <motion.div variants={itemVariant} className="mb-6">
                    <div className="flex flex-wrap gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl w-fit border border-white/50 shadow-sm">
                        {[
                            { key: "auth", label: "Auth Logs" },
                            { key: "activity", label: "Activity Logs" },
                            { key: "admin", label: "Admin Logs" },
                        ].map((t) => (
                            <button
                                type="button"
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                                    tab === t.key
                                        ? "bg-gradient-to-r from-[#FD7979] to-[#FDACAC] text-white shadow-md"
                                        : "text-slate-500 hover:bg-[#FEEAC9]/30 hover:text-[#FD7979]"
                                }`}
                            >
                                {getTabIcon(t.key)}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Table Area */}
                <motion.div
                    variants={itemVariant}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-xl shadow-[#FDACAC]/10 overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gradient-to-r from-[#FEEAC9]/30 to-[#FDACAC]/10 border-b border-white">
                                    <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                        Type / Action
                                    </th>
                                    {tab !== "auth" && (
                                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                            Feature
                                        </th>
                                    )}
                                    {tab !== "auth" && (
                                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                            Entity Target
                                        </th>
                                    )}
                                    {tab === "auth" && (
                                        <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    )}
                                    <th className="px-6 py-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                        Timestamp
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/50">
                                {loading
                                    ? <tr>
                                          <td
                                              colSpan={tab === "auth" ? 3 : 4}
                                              className="h-64 text-center"
                                          >
                                              <div className="flex flex-col items-center justify-center text-[#FD7979]">
                                                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979] shadow-[0_0_15px_rgba(253,121,121,0.2)] mb-4" />
                                                  <p className="text-sm font-bold tracking-widest uppercase animate-pulse">
                                                      Syncing Logs...
                                                  </p>
                                              </div>
                                          </td>
                                      </tr>
                                    : logs.length === 0
                                      ? <tr>
                                            <td
                                                colSpan={tab === "auth" ? 3 : 4}
                                                className="h-64 text-center"
                                            >
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Search
                                                        size={40}
                                                        className="mb-4 text-[#FDACAC]/50"
                                                    />
                                                    <p className="text-lg font-bold text-slate-500">
                                                        No Logs Found
                                                    </p>
                                                    <p className="text-sm">
                                                        There are no recent
                                                        records for this
                                                        category.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                      : <AnimatePresence>
                                            {logs.map((log, i) => (
                                                <motion.tr
                                                    key={log.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: i * 0.05,
                                                    }}
                                                    className="hover:bg-[#FEEAC9]/10 transition-colors group"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-[#FEEAC9] group-hover:text-[#FD7979] transition-colors">
                                                                {getTabIcon(
                                                                    tab,
                                                                )}
                                                            </div>
                                                            <span className="font-bold text-slate-700 capitalize">
                                                                {log.action}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    {tab !== "auth" && (
                                                        <td className="px-6 py-4">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                                                                {log.feature ||
                                                                    "System"}
                                                            </span>
                                                        </td>
                                                    )}
                                                    {tab !== "auth" && (
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-700">
                                                                    {
                                                                        log.entity_type
                                                                    }
                                                                </span>
                                                                {log.entity_id && (
                                                                    <span className="text-xs font-mono text-slate-400 mt-1 bg-slate-50 py-0.5 px-1.5 rounded w-fit">
                                                                        ID:{" "}
                                                                        {log.entity_id.slice(
                                                                            0,
                                                                            8,
                                                                        )}
                                                                        ...
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    )}
                                                    {tab === "auth" && (
                                                        <td className="px-6 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                                    log.success
                                                                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                                                        : "bg-red-100 text-red-700 border border-red-200"
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`w-1.5 h-1.5 rounded-full ${log.success ? "bg-emerald-500" : "bg-red-500"}`}
                                                                />
                                                                {log.success
                                                                    ? "Success"
                                                                    : "Failed"}
                                                            </span>
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                            <Clock
                                                                size={14}
                                                                className="text-[#FDACAC]"
                                                            />
                                                            {new Date(
                                                                log.created_at,
                                                            ).toLocaleString(
                                                                "en-US",
                                                                {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                },
                                                            )}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {totalPages > 1 && !loading && (
                        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-500">
                                Showing page{" "}
                                <span className="font-bold text-slate-800">
                                    {page}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-slate-800">
                                    {totalPages}
                                </span>
                                <span className="mx-2 text-slate-300">|</span>
                                <span className="text-[#FD7979]">
                                    {total} Total Records
                                </span>
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page <= 1}
                                    className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-200 hover:text-[#FD7979] hover:border-[#FDACAC] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={page >= totalPages}
                                    className="p-2 rounded-xl bg-white text-slate-600 shadow-sm border border-slate-200 hover:text-[#FD7979] hover:border-[#FDACAC] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function AdminLogsWrapper() {
    return (
        <ProtectedRoute requireAdmin>
            <AdminLogsPage />
        </ProtectedRoute>
    );
}
