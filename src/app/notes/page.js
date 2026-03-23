"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import PopupModal from "@/components/PopupModal";
import { notesApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit2, Trash2, Pin, Tag, Save, RefreshCw, Type, AlignLeft, Calendar, ArrowLeft } from "lucide-react";

function NotesContent() {
    const router = useRouter();
    const [notes, setNotes] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState("");
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    
    // Deletion Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const [form, setForm] = useState({
        title: "",
        content: "",
        label: "coping",
        is_pinned: false,
    });

    const fetchNotes = async () => {
        try {
            const data = await notesApi.list(selectedLabel || null);
            setNotes(data.data || []);
        } catch {}
    };

    const fetchLabels = async () => {
        try {
            const data = await notesApi.labels();
            setLabels(data.data || []);
        } catch {}
    };

    useEffect(() => {
        Promise.all([fetchNotes(), fetchLabels()]).finally(() =>
            setLoading(false),
        );
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [selectedLabel]);

    const resetForm = () => {
        setForm({ title: "", content: "", label: "coping", is_pinned: false });
        setEditing(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            if (editing) {
                await notesApi.update(editing, form);
                setMessage("Note updated!");
            } else {
                await notesApi.create(form);
                setMessage("Note created!");
            }
            resetForm();
            await fetchNotes();
            await fetchLabels();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (note) => {
        setForm({
            title: note.title,
            content: note.content,
            label: note.label || "coping",
            is_pinned: note.is_pinned,
        });
        setEditing(note.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;
        setDeleteModal({ isOpen: false, id: null });
        try {
            await notesApi.delete(id);
            await fetchNotes();
            await fetchLabels();
            setMessage("Note deleted");
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
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
                        <h1 className="bg-gradient-to-r from-[#FD7979] to-[#FDACAC] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                            Coping Toolkit
                        </h1>
                        <p className="mt-2 text-lg text-slate-500">
                            Build your personal note vault and coping cards.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="group flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FDACAC] to-[#FD7979] px-6 py-3 font-semibold text-white shadow-lg shadow-[#FD7979]/30 transition-all hover:shadow-[#FD7979]/50"
                    >
                        <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
                        New Note
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`mb-6 rounded-2xl p-4 text-sm font-medium shadow-sm backdrop-blur-md ${
                                message.startsWith("Error")
                                    ? "bg-red-50/80 text-red-600 border border-red-100"
                                    : "bg-[#FEEAC9]/80 text-[#d45656] border border-[#FEEAC9]"
                            }`}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-8 lg:grid-cols-12">
                    {/* Sidebar / Filters */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="sticky top-24 overflow-hidden rounded-3xl border border-white/40 bg-white/60 p-6 shadow-xl shadow-[#FDACAC]/10 backdrop-blur-xl">
                            <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FD7979]">
                                <Tag className="h-4 w-4" />
                                Labels
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedLabel("")}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                                        !selectedLabel
                                            ? "bg-[#FDACAC] text-white shadow-md shadow-[#FDACAC]/30"
                                            : "bg-white/50 text-slate-500 hover:bg-[#FEEAC9]/50 hover:text-[#FD7979]"
                                    }`}
                                >
                                    All Notes
                                </button>
                                {labels.map((label) => (
                                    <button
                                        type="button"
                                        key={label}
                                        onClick={() => setSelectedLabel(label)}
                                        className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                                            selectedLabel === label
                                                ? "bg-[#FDACAC] text-white shadow-md shadow-[#FDACAC]/30"
                                                : "bg-white/50 text-slate-500 hover:bg-[#FEEAC9]/50 hover:text-[#FD7979]"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 space-y-3 rounded-2xl bg-white/40 p-4 text-sm text-slate-500">
                                <div className="flex items-center justify-between">
                                    <span>Total Notes</span>
                                    <span className="font-bold text-[#FD7979]">{notes.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Pinned</span>
                                    <span className="font-bold text-[#FDACAC]">{notes.filter((n) => n.is_pinned).length}</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Content */}
                    <section className="space-y-6 lg:col-span-9">
                        <AnimatePresence mode="popLayout">
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    className="overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-1 shadow-2xl shadow-[#FDACAC]/20 backdrop-blur-2xl"
                                >
                                    <div className="relative rounded-[22px] bg-gradient-to-br from-white/90 to-white/50 p-6 sm:p-8">
                                        <div className="mb-6 flex items-center justify-between">
                                            <h2 className="text-2xl font-bold text-slate-800">
                                                {editing ? "Edit Note" : "Create New Note"}
                                            </h2>
                                            <button
                                                onClick={resetForm}
                                                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="group relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                    <Type className="h-5 w-5 text-[#FDACAC] transition-colors group-focus-within:text-[#FD7979]" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={form.title}
                                                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                                    placeholder="Amazing Title..."
                                                    className="w-full rounded-2xl border-2 border-transparent bg-white/50 py-4 pl-12 pr-4 text-slate-700 outline-none ring-1 ring-slate-200/50 transition-all focus:border-[#FDACAC] focus:bg-white focus:ring-[#FD7979]/20"
                                                />
                                            </div>

                                            <div className="group relative">
                                                <div className="pointer-events-none absolute top-4 left-0 flex items-center pl-4">
                                                    <AlignLeft className="h-5 w-5 text-[#FDACAC] transition-colors group-focus-within:text-[#FD7979]" />
                                                </div>
                                                <textarea
                                                    value={form.content}
                                                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                                                    placeholder="Write your thoughts here..."
                                                    rows={6}
                                                    className="custom-scrollbar w-full resize-none rounded-2xl border-2 border-transparent bg-white/50 py-4 pl-12 pr-4 text-slate-700 outline-none ring-1 ring-slate-200/50 transition-all focus:border-[#FDACAC] focus:bg-white focus:ring-[#FD7979]/20"
                                                />
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-50/50 p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative">
                                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                            <Tag className="h-4 w-4 text-slate-400" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={form.label}
                                                            onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                                                            placeholder="Label (e.g., coping)"
                                                            className="w-full min-w-[200px] rounded-xl border-none bg-white py-2 pl-9 pr-4 text-sm text-slate-700 shadow-sm outline-none ring-1 ring-slate-200 focus:ring-2 focus:ring-[#FDACAC]"
                                                        />
                                                    </div>
                                                    
                                                    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50">
                                                        <input
                                                            type="checkbox"
                                                            checked={form.is_pinned}
                                                            onChange={(e) => setForm((p) => ({ ...p, is_pinned: e.target.checked }))}
                                                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#FD7979] focus:ring-[#FDACAC]"
                                                        />
                                                        <Pin className={`h-4 w-4 ${form.is_pinned ? "text-[#FD7979] fill-[#FD7979]" : ""}`} />
                                                        Pin Note
                                                    </label>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleSave}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 rounded-xl bg-[#FDACAC] px-6 py-2.5 font-bold text-white shadow-md shadow-[#FDACAC]/30 transition-all hover:bg-[#FD7979] disabled:opacity-70"
                                                >
                                                    {saving ? (
                                                        <RefreshCw className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Save className="h-4 w-4" />
                                                    )}
                                                    {saving ? "Saving..." : editing ? "Update Note" : "Save Note"}
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <motion.div
                                layout
                                className="grid gap-6 sm:grid-cols-2"
                            >
                                <AnimatePresence mode="popLayout">
                                    {notes.length > 0 ? (
                                        notes.map((note, index) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ delay: index * 0.05 }}
                                                key={note.id}
                                                className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white/70 p-6 shadow-lg backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FDACAC]/20 ${
                                                    note.is_pinned
                                                        ? "border-[#FDACAC] border-opacity-50"
                                                        : "border-white/50"
                                                }`}
                                            >
                                                <div className="mb-4 flex items-start justify-between gap-3">
                                                    <h3 className="line-clamp-2 text-lg font-bold text-slate-800 flex items-start gap-2">
                                                        {note.is_pinned && <Pin className="h-5 w-5 shrink-0 text-[#FD7979] fill-[#FD7979]" />}
                                                        {note.title || "Untitled"}
                                                    </h3>
                                                    <span className="shrink-0 rounded-full bg-[#FEEAC9] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#d45656]">
                                                        {note.label}
                                                    </span>
                                                </div>
                                                
                                                <div className="custom-scrollbar mb-4 flex-grow overflow-y-auto pr-2">
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                                                        {note.content}
                                                    </p>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {new Date(note.updated_at).toLocaleDateString(undefined, {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                                                        <button
                                                            onClick={() => handleEdit(note)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#FDACAC]"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(note.id)}
                                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50/50 text-red-300 transition-colors hover:bg-red-100 hover:text-red-500"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
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
                                                <AlignLeft className="h-8 w-8 text-[#FD7979]" />
                                            </div>
                                            <p className="text-lg font-medium text-slate-600">No notes found.</p>
                                            <p className="text-sm text-slate-400">Click &quot;New Note&quot; to create your first coping card!</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </AnimatePresence>
                    </section>
                </div>
            </div>
            
            <PopupModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Note"
                message="Are you sure you want to delete this note? This action cannot be undone."
                type="confirm"
                confirmText="Yes, Delete"
            />
        </div>
    );
}

export default function NotesPage() {
    return (
        <ProtectedRoute>
            <NotesContent />
        </ProtectedRoute>
    );
}
