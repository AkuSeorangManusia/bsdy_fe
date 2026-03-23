"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { chatsApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Plus, Trash2, Clock, ChevronRight, Sparkles, Bot, CalendarDays, ArrowLeft } from "lucide-react";
import PopupModal from "@/components/PopupModal";

// Animations
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

function ChatListContent() {
    const router = useRouter();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

    useEffect(() => {
        chatsApi
            .list(50)
            .then((data) => setChats(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (type) => {
        setCreating(true);
        try {
            const res = await chatsApi.create(type);
            router.push(`/chat/${res.data.id}`);
        } catch (err) {
            setErrorModal({ isOpen: true, message: err.message });
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        setDeleteModal({ isOpen: true, id });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        try {
            await chatsApi.delete(deleteModal.id);
            setChats((prev) => prev.filter((c) => c.id !== deleteModal.id));
        } catch (err) {
            setErrorModal({ isOpen: true, message: err.message });
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#faf9f8]">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979]" 
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Soft Background Mesh */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-bl from-[#FDACAC]/30 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-[#FEEAC9]/40 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
                
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
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-3">AI Companion</h1>
                        <p className="text-lg text-slate-500 font-medium max-w-xl">Your personal space for reflection, emotional support, and guided planning.</p>
                    </div>
                </motion.div>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    
                    {/* Left Sidebar CTA */}
                    <motion.section initial="hidden" animate="visible" variants={fadeUp} className="lg:col-span-4 w-full">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/15 sticky top-24">
                            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-gradient-to-bl from-[#FDACAC]/40 to-transparent rounded-full blur-2xl pointer-events-none" />
                            
                            <div className="mb-8 relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10 backdrop-blur-md">
                                    <Sparkles size={28} className="text-[#FEEAC9]" />
                                </div>
                                <h2 className="text-2xl font-extrabold text-white mb-3">Start a Session</h2>
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    Need someone to talk to? Our AI companion is here to help you unpack your thoughts and track your emotional progress.
                                </p>
                            </div>
                            
                            <button
                                type="button"
                                onClick={() => handleCreate("agentic")}
                                disabled={creating}
                                className="w-full py-4 bg-gradient-to-r from-[#FD7979] to-[#FDACAC] hover:from-[#FDACAC] hover:to-[#FD7979] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-[#FD7979]/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2 relative z-10"
                            >
                                {creating ? (
                                    <span className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> Creating...</span>
                                ) : (
                                    <><Plus size={20} /> New Conversation</>
                                )}
                            </button>
                        </div>
                    </motion.section>

                    {/* Chat List */}
                    <motion.section 
                        variants={staggerContainer}
                        initial="hidden" animate="visible"
                        className="lg:col-span-8 w-full space-y-6"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                <HistoryIcon /> Recent Conversations
                            </h2>
                            <span className="text-xs font-bold bg-[#FEEAC9] text-[#FD7979] px-3 py-1 rounded-full">{chats.length} threads</span>
                        </div>

                        <AnimatePresence>
                            {chats.length > 0 ? (
                                chats.map((chat) => (
                                    <motion.div key={chat.id} variants={fadeUp} layout exit={{ opacity: 0, scale: 0.9 }}>
                                        <Link
                                            href={`/chat/${chat.id}`}
                                            className="block bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md hover:border-[#FDACAC]/50 transition-all group overflow-hidden relative"
                                        >
                                            <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent group-hover:from-[#FEEAC9]/20 transition-colors pointer-events-none" />
                                            
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#FD7979] group-hover:scale-110 group-hover:bg-[#FDACAC]/20 transition-all shrink-0">
                                                        <Bot size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-extrabold text-lg text-slate-800 mb-1 group-hover:text-[#FD7979] transition-colors line-clamp-1">{chat.title}</h3>
                                                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                                                            <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md text-slate-500">
                                                                <MessageCircle size={12} /> {chat.message_count} messages
                                                            </span>
                                                            {!chat.is_active && <span className="bg-slate-100 px-2 py-1 rounded-md text-slate-500">Closed</span>}
                                                            <span className="hidden sm:flex items-center gap-1">
                                                                <CalendarDays size={12} /> {new Date(chat.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 pl-4">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDelete(chat.id, e)}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                        title="Delete chat"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-300 group-hover:bg-[#FD7979] group-hover:text-white transition-colors">
                                                        <ChevronRight size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div variants={fadeUp} className="bg-white rounded-[2.5rem] py-20 px-6 text-center border border-dashed border-slate-200">
                                    <Bot size={56} className="mx-auto text-slate-200 mb-5" />
                                    <h3 className="text-2xl font-extrabold text-slate-700 mb-2">No Active Chats</h3>
                                    <p className="text-slate-500 max-w-md mx-auto">You haven't started any conversations yet. Click the "New Conversation" button to begin your journey.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>
                </div>
            </div>

            <PopupModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Delete Chat"
                message="Are you sure you want to delete this chat? This action cannot be undone."
                type="confirm"
                confirmText="Yes, Delete"
            />
            
            <PopupModal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: "" })}
                title="Error"
                message={errorModal.message}
                type="alert"
            />
        </div>
    );
}

// Small helper component
function HistoryIcon() {
    return <Clock size={20} className="text-[#FDACAC]" />;
}

export default function ChatPage() {
    return (
        <ProtectedRoute>
            <ChatListContent />
        </ProtectedRoute>
    );
}
