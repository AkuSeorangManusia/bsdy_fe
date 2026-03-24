"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import PopupModal from "@/components/PopupModal";
import { contentApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Plus,
    FileText,
    Edit3,
    Eye,
    Trash2,
    Search,
    Calendar,
    ArrowLeft,
    Clock,
    AlertCircle,
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

function AdminContentPage() {
    const router = useRouter();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, title: "" });

    const fetchArticles = useCallback(async () => {
        try {
            const data = await contentApi.list(100, 0);
            setArticles(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleCreate = async () => {
        setCreating(true);
        try {
            const data = await contentApi.create({
                title: "Untitled Article",
                body: "Start writing here...",
                excerpt: "",
                status: "draft",
            });
            window.location.href = `/admin/content/${data.data.id}`;
        } catch (err) {
            setError(err.message);
            setCreating(false);
        }
    };

    const handleDelete = async (id, title) => {
        setDeleteModal({ isOpen: true, id, title });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;
        setDeleteModal({ isOpen: false, id: null, title: "" });
        try {
            await contentApi.delete(id);
            setArticles((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
            case "draft":
                return "bg-[#FEEAC9]/80 text-[#FD7979] border-[#FDACAC]/50";
            case "archived":
                return "bg-slate-100/80 text-slate-600 border-slate-200";
            default:
                return "bg-slate-100/80 text-slate-600 border-slate-200";
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[100px] opacity-40 -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FDACAC]/30 to-transparent rounded-full blur-[80px] opacity-40 -z-10 -translate-x-1/2 pointer-events-none" />

            <motion.div
                className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10"
                variants={containerVariant}
                initial="hidden"
                animate="visible"
            >
                {/* Back Navigation */}
                <motion.button
                    variants={itemVariant}
                    onClick={() => router.push('/dashboard')}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Back
                </motion.button>

                {/* Header */}
                <motion.header variants={itemVariant} className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#FEEAC9] text-[#FD7979] text-xs font-black uppercase tracking-wider rounded-full shadow-sm mb-3">
                                <FileText size={12} /> Content Manager
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                                Manage{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">
                                    Articles
                                </span>
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg">
                                Create, edit, and publish content for your
                                platform.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            disabled={creating}
                            className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:bg-[#FD7979] transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            {creating
                                ? <>
                                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                      Creating...
                                  </>
                                : <>
                                      <Plus
                                          size={20}
                                          className="group-hover:rotate-90 transition-transform duration-300"
                                      />
                                      New Article
                                  </>}
                        </button>
                    </div>
                </motion.header>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mb-8 p-4 rounded-2xl bg-red-50/80 backdrop-blur-md border border-red-100 flex items-start gap-3"
                        >
                            <AlertCircle
                                className="text-red-500 shrink-0 mt-0.5"
                                size={20}
                            />
                            <div>
                                <h3 className="font-bold text-red-800 text-sm">
                                    Error Loading Content
                                </h3>
                                <p className="text-red-600 text-sm mt-1">
                                    {error}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {loading
                    ? <div className="flex flex-col items-center justify-center py-20 text-[#FD7979]">
                          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979] shadow-[0_0_15px_rgba(253,121,121,0.2)] mb-4" />
                          <p className="text-sm font-bold tracking-widest uppercase animate-pulse">
                              Loading Articles...
                          </p>
                      </div>
                    : articles.length === 0
                      ? <motion.div
                            variants={itemVariant}
                            className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-12 text-center shadow-xl shadow-[#FDACAC]/5 max-w-2xl mx-auto"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-[#FEEAC9]/50 to-[#FDACAC]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText
                                    size={40}
                                    className="text-[#FD7979]/50"
                                />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">
                                No Articles Yet
                            </h3>
                            <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                Your knowledge base is currently empty. Start
                                drafting your first article to share insights.
                            </p>
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FD7979] to-[#FDACAC] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                <Plus size={18} /> First Article
                            </button>
                        </motion.div>
                      : <motion.div
                            variants={itemVariant}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence>
                                {articles.map((article, i) => (
                                    <motion.div
                                        key={article.id}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.95,
                                            y: 20,
                                        }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{
                                            duration: 0.3,
                                            delay: i * 0.05,
                                        }}
                                        className="group bg-white/70 backdrop-blur-md border border-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-[#FDACAC]/10 transition-all flex flex-col h-full relative overflow-hidden"
                                    >
                                        {/* Hover glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-0 pointer-events-none" />

                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4 gap-2">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${statusColor(article.status)}`}
                                                >
                                                    {article.status}
                                                </span>

                                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                article.id,
                                                                article.title,
                                                            )
                                                        }
                                                        className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-slate-800 leading-tight mb-2 line-clamp-2 title-glow">
                                                {article.title ||
                                                    "Untitled Article"}
                                            </h3>

                                            <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">
                                                {article.excerpt ||
                                                    "No excerpt provided. Open to edit the document contents."}
                                            </p>

                                            <div className="pt-4 border-t border-slate-100/60 flex items-center justify-between mt-auto">
                                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                                    <Calendar size={12} />
                                                    {new Date(
                                                        article.created_at,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </div>

                                                <div className="flex gap-2">
                                                    {article.status ===
                                                        "published" && (
                                                        <Link
                                                            href={`/blog/${article.slug}`}
                                                            target="_blank"
                                                            className="flex items-center justify-center p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-800 transition-colors"
                                                            title="Live Preview"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={`/admin/content/${article.id}`}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FEEAC9] to-[#FEEAC9]/80 text-[#FD7979] font-bold rounded-xl"
                                                    >
                                                        <Edit3 size={14} />
                                                        <span>Edit</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>}
            </motion.div>

            <PopupModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null, title: "" })}
                onConfirm={confirmDelete}
                title="Delete Article"
                message={`Are you sure you want to delete "${deleteModal.title}"? This cannot be undone.`}
                type="confirm"
                confirmText="Yes, Delete"
            />
        </div>
    );
}

export default function AdminContentWrapper() {
    return (
        <ProtectedRoute requireAdmin>
            <AdminContentPage />
        </ProtectedRoute>
    );
}
