"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { contentApi } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    Image as ImageIcon,
    FileText,
    Settings,
    Calendar,
    UploadCloud,
    CheckCircle2,
    AlertCircle,
    LayoutTemplate
} from "lucide-react";

// Animation Variants
const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

function AdminContentEditor() {
    const { id } = useParams();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [body, setBody] = useState("");
    const [status, setStatus] = useState("draft");

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await contentApi.get(id);
                const a = data.data;
                setArticle(a);
                setTitle(a.title || "");
                setExcerpt(a.excerpt || "");
                setBody(a.body || "");
                setStatus(a.status || "draft");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");
        try {
            const data = await contentApi.update(id, {
                title,
                excerpt,
                body,
                status,
            });
            setArticle(data.data);
            setSuccess("Article saved successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            const data = await contentApi.uploadCover(id, file);
            setArticle(data.data);
            setSuccess("Cover image uploaded!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[100px] opacity-40 -z-10 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#FDACAC]/30 to-transparent rounded-full blur-[80px] opacity-40 -z-10 -translate-x-1/2" />
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979] shadow-[0_0_15px_rgba(253,121,121,0.2)] mb-4" />
                <p className="text-[#FD7979] text-sm font-bold tracking-widest uppercase animate-pulse">Loading Editor...</p>
            </div>
        );
    }

    if (!article && error) {
        return (
            <div className="min-h-screen bg-[#faf9f8] flex flex-col items-center justify-center p-6">
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Article</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => router.push("/admin/content")}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} /> Back to Content List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden pb-20">
            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[100px] opacity-50 -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="fixed top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#FDACAC]/30 to-transparent rounded-full blur-[100px] opacity-50 -z-10 -translate-x-1/2 pointer-events-none" />

            {/* Static Header */}
            <div className="relative z-10 w-full mb-8 pt-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => router.push("/admin/content")}
                            className="p-2.5 rounded-full bg-white text-slate-500 shadow-sm border border-slate-100 hover:text-[#FD7979] hover:border-[#FDACAC]/50 hover:shadow-md transition-all group"
                        >
                            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-0.5" />
                        </button>
                        <div>
                            <span className="text-xs font-bold text-[#FD7979] uppercase tracking-wider block">Content Editor</span>
                            <span className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-[200px] md:max-w-md">{title || "Untitled"}</span>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#FD7979] to-[#FDACAC] text-white rounded-xl font-bold shadow-lg shadow-[#FD7979]/20 hover:shadow-xl hover:from-[#fc6868] hover:to-[#fc9999] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="group-hover:scale-110 transition-transform" />
                                Publish Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <motion.div
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
                variants={containerVariant}
                initial="hidden"
                animate="visible"
            >
                {/* Notifications */}
                <AnimatePresence>
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`mb-6 p-4 rounded-2xl backdrop-blur-md border flex items-center gap-3 shadow-lg z-20 ${
                                error 
                                    ? "bg-red-50/90 border-red-200 text-red-800" 
                                    : "bg-emerald-50/90 border-emerald-200 text-emerald-800"
                            }`}
                        >
                            {error ? <AlertCircle size={20} className="text-red-500" /> : <CheckCircle2 size={20} className="text-emerald-500" />}
                            <p className="font-bold text-sm tracking-wide">{error || success}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Editor Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div variants={itemVariant} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-[#FDACAC]/5">
                            {/* Title Input */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent border-none text-4xl sm:text-5xl font-black text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-0 p-0"
                                    placeholder="Story Title..."
                                />
                            </div>

                            {/* Excerpt */}
                            <div className="mb-8">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3">
                                    <LayoutTemplate size={16} className="text-[#FDACAC]" /> Excerpt / Summary
                                </label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={2}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl p-4 text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#FEEAC9] focus:border-[#FDACAC] transition-all resize-none shadow-inner"
                                    placeholder="Write a captivating summary for article cards..."
                                />
                            </div>

                            {/* Body Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-3 border-b border-slate-100 pb-2">
                                    <FileText size={16} className="text-[#FDACAC]" /> Document Body (Markdown)
                                </label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={25}
                                    className="w-full bg-white border border-slate-200/60 rounded-2xl p-6 text-slate-700 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#FEEAC9] focus:border-[#FDACAC] transition-all shadow-inner custom-scrollbar"
                                    placeholder="## Begin your story here...&#10;&#10;Use **markdown** to format your text."
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        {/* Cover Image Uploader */}
                        <motion.div variants={itemVariant} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl shadow-[#FDACAC]/5">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                                <ImageIcon size={16} className="text-[#FD7979]" /> Featured Image
                            </h3>
                            
                            <div className="group relative rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-[#FDACAC] transition-colors aspect-video flex flex-col items-center justify-center cursor-pointer mb-3" onClick={() => !uploading && fileInputRef.current?.click()}>
                                {article?.cover_image_url ? (
                                    <>
                                        <img
                                            src={article.cover_image_url}
                                            alt="Cover Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                                                <UploadCloud size={18} /> Change Image
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 p-6 text-center group-hover:text-[#FD7979] transition-colors">
                                        <UploadCloud size={32} className="mb-2" />
                                        <span className="text-sm font-bold">Click to upload</span>
                                        <span className="text-xs mt-1 text-slate-400 font-medium">JPEG, PNG, WEBP max 10MB</span>
                                    </div>
                                )}
                                
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979] mb-2" />
                                        <span className="text-xs font-bold text-[#FD7979]">Uploading...</span>
                                    </div>
                                )}
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                        </motion.div>

                        {/* Visibility Settings */}
                        <motion.div variants={itemVariant} className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-xl shadow-[#FDACAC]/5">
                            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">
                                <Settings size={16} className="text-[#FD7979]" /> Document Settings
                            </h3>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Publish Status</label>
                                <div className="relative">
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className={`w-full appearance-none bg-slate-50 border-2 rounded-xl py-3 px-4 pr-10 font-bold outline-none transition-all cursor-pointer ${
                                            status === 'published' ? 'border-emerald-200 text-emerald-700 bg-emerald-50/50' :
                                            status === 'draft' ? 'border-[#FEEAC9] text-[#FD7979] bg-[#FEEAC9]/30' :
                                            'border-slate-200 text-slate-600 bg-slate-50'
                                        }`}
                                    >
                                        <option value="draft">Draft (Hidden)</option>
                                        <option value="published">Published (Live)</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                    {/* Custom Dropdown Arrow */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata */}
                            {article && (
                                <div className="mt-6 bg-slate-50/80 rounded-2xl p-4 text-xs font-medium text-slate-500 border border-slate-100 space-y-3">
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Permalink Slug</span>
                                        <div className="font-mono bg-white px-2 py-1.5 rounded-lg border border-slate-100 break-all text-slate-600">/{article.slug}</div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100">
                                        <Calendar size={14} className="text-[#FDACAC]" />
                                        <span>Created: {new Date(article.created_at).toLocaleDateString()}</span>
                                    </div>
                                    {article.published_at && (
                                        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100 text-emerald-700">
                                            <CheckCircle2 size={14} />
                                            <span>Published: {new Date(article.published_at).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function AdminContentEditorWrapper() {
    return (
        <ProtectedRoute requireAdmin>
            <AdminContentEditor />
        </ProtectedRoute>
    );
}
