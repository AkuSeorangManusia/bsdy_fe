"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { chatsApi } from "@/lib/api";
import Link from "next/link";
import { use, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, Sparkles, Bot, User, Loader2, Info } from "lucide-react";

function ChatViewContent({ chatId }) {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        Promise.all([chatsApi.get(chatId), chatsApi.messages(chatId, 100)])
            .then(([chatRes, msgRes]) => {
                setChat(chatRes.data);
                setMessages(msgRes.data || []);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, sending]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        const text = input.trim();
        setInput("");
        setSending(true);

        // Optimistically add user message
        const tempUserMsg = {
            id: `temp-${Date.now()}`,
            role: "user",
            content: text,
            created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const res = await chatsApi.sendMessage(chatId, text);
            // Replace temp message and add assistant response
            setMessages((prev) => [
                ...prev.filter((m) => m.id !== tempUserMsg.id),
                res.data.user_message,
                res.data.assistant_message,
            ]);
        } catch (err) {
            setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) {
        return (
            <div className="h-[calc(100vh-80px)] flex justify-center items-center bg-[#faf9f8]">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979]" 
                />
            </div>
        );
    }

    if (error && !chat) {
        return (
            <div className="h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-[#faf9f8] px-4">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm max-w-md w-full text-center border border-red-100">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Info size={32} />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-800 mb-2">Failed to load chat</h2>
                    <p className="text-slate-500 mb-6">{error}</p>
                    <Link
                        href="/chat"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Chats
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#faf9f8] min-h-[calc(100vh-80px)] relative overflow-hidden flex flex-col">
            {/* Soft Background Mesh */}
            <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] bg-gradient-to-bl from-[#FEEAC9]/40 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FDACAC]/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col h-[calc(100vh-80px)] relative z-10 px-0 sm:px-4 py-0 sm:py-6">
                
                {/* Chat Header */}
                <header className="bg-white/80 backdrop-blur-xl sm:rounded-t-[2.5rem] p-4 sm:p-6 border-b sm:border border-slate-100 shadow-sm flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-4 text-slate-800">
                        <Link 
                            href="/chat"
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-[#FD7979] hover:border-[#FDACAC] transition-all"
                        >
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDACAC] to-[#FD7979] text-white flex items-center justify-center shadow-md">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h1 className="font-extrabold text-lg leading-tight line-clamp-1">
                                    {chat?.title || "Therapeutic Companion"}
                                </h1>
                                <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                                    AI Active
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-white/40 sm:border-x sm:border-slate-100 px-4 py-8 custom-scrollbar">
                    <div className="space-y-6">
                        {messages.length === 0 && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                                <div className="w-20 h-20 bg-white shadow-lg mx-auto rounded-3xl flex items-center justify-center border border-[#FEEAC9] text-[#FD7979] mb-5">
                                    <Sparkles size={36} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Hello! I'm here for you.</h2>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    I can listen to your thoughts, analyze your mood data, suggest coping strategies, or refer to your journal notes. How are you feeling today?
                                </p>
                            </motion.div>
                        )}

                        <AnimatePresence initial={false}>
                            {messages.map((msg, index) => {
                                const isUser = msg.role === "user";
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        key={msg.id || index}
                                        className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        {!isUser && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDACAC] to-[#FD7979] shrink-0 flex items-center justify-center shadow-sm text-white mt-auto">
                                                <Bot size={16} />
                                            </div>
                                        )}
                                        
                                        <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                                            <div
                                                className={`px-5 py-3.5 shadow-sm text-[0.95rem] leading-relaxed relative ${
                                                    isUser
                                                        ? "bg-slate-900 text-white rounded-[1.5rem] rounded-br-[0.5rem]"
                                                        : "bg-white border border-[#FDACAC]/40 text-slate-800 rounded-[1.5rem] rounded-bl-[0.5rem]"
                                                }`}
                                            >
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                                
                                                {msg.has_tool_calls && msg.tool_calls && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200/50">
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 bg-slate-100/50 px-2 py-1 rounded-md flex items-center gap-1">
                                                                🛠️ Tools: {(() => {
                                                                    try {
                                                                        const calls = typeof msg.tool_calls === "string" ? JSON.parse(msg.tool_calls) : msg.tool_calls;
                                                                        return Array.isArray(calls) ? calls.map((c) => c.name || c.tool || "tool").join(", ") : "tools";
                                                                    } catch {
                                                                        return "tools";
                                                                    }
                                                                })()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <span className={`text-[0.65rem] font-bold mt-1.5 px-1 ${isUser ? "text-slate-400" : "text-slate-400"}`}>
                                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Just now"}
                                            </span>
                                        </div>

                                        {isUser && (
                                            <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 flex items-center justify-center text-slate-500 mt-auto">
                                                <User size={16} />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                            
                            {sending && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDACAC] to-[#FD7979] shrink-0 flex items-center justify-center shadow-sm text-white mt-auto">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-white border border-[#FDACAC]/40 px-5 py-4 rounded-[1.5rem] rounded-bl-[0.5rem] shadow-sm flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-[#FD7979] rounded-full block" />
                                            <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-[#FD7979] rounded-full block" />
                                            <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-[#FD7979] rounded-full block" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-white/80 backdrop-blur-xl sm:rounded-b-[2.5rem] p-3 sm:p-5 border-t sm:border border-slate-100 shadow-[0_-10px_40px_-20px_rgba(253,121,121,0.15)] shrink-0 z-20">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-3">
                                <p className="bg-red-50 px-4 py-2 rounded-xl text-center text-xs font-bold text-red-600 border border-red-100">
                                    Action failed: {error}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-end gap-3 relative max-w-3xl mx-auto">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            rows={1}
                            style={{ minHeight: "56px", maxHeight: "150px" }}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 pl-5 pr-16 rounded-[2rem] resize-none focus:outline-none focus:ring-4 focus:ring-[#FDACAC]/30 focus:border-[#FD7979] transition-all hover:bg-white placeholder:text-slate-400 font-medium custom-scrollbar"
                        />
                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || sending}
                            className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center bg-[#FD7979] hover:bg-[#FDACAC] text-white rounded-full transition-all disabled:opacity-50 disabled:hover:bg-[#FD7979] hover:scale-105 active:scale-95 shadow-md shadow-[#FD7979]/30"
                        >
                            {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="ml-1" />}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">
                            AI interactions may omit sensitive contexts.
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(253, 172, 172, 0.4);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(253, 121, 121, 0.6);
                }
            `}</style>
        </div>
    );
}

export default function ChatViewPage({ params }) {
    const { id } = use(params);
    return (
        <ProtectedRoute>
            <ChatViewContent chatId={id} />
        </ProtectedRoute>
    );
}
