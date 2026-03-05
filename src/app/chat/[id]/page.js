'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { chatsApi } from '@/lib/api';
import Link from 'next/link';
import { use, useEffect, useRef, useState } from 'react';

function ChatViewContent({ chatId }) {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
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
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        const text = input.trim();
        setInput('');
        setSending(true);

        // Optimistically add user message
        const tempUserMsg = {
            id: `temp-${Date.now()}`,
            role: 'user',
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
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    if (error && !chat) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <p className="text-red-500">{error}</p>
                <Link
                    href="/chat"
                    className="mt-4 inline-block text-[#FD7979] hover:underline"
                >
                    ← Back to Chats
                </Link>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] flex-col">
            {/* Header */}
            <div className="border-b border-[#FFCDC9] bg-white px-4 py-3">
                <div className="mx-auto flex max-w-4xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/chat"
                            className="text-[#FD7979] hover:text-[#FDACAC]"
                        >
                            ←
                        </Link>
                        <div>
                            <h1 className="font-semibold text-gray-900">
                                {chat?.title || 'Chat'}
                            </h1>
                            <p className="text-xs text-gray-500">
                                {chat?.chat_type === 'agentic'
                                    ? '🤖 Agentic'
                                    : '💬 Companion'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[#FEEAC9]/10 px-4 py-4">
                <div className="mx-auto max-w-4xl space-y-4">
                    {messages.length === 0 && (
                        <p className="py-10 text-center text-gray-500">
                            {chat?.chat_type === 'agentic'
                                ? 'Ask me to check your mood, generate reports, manage notes, or suggest coping strategies!'
                                : "Hi! I'm here to listen and support you. How are you feeling today?"}
                        </p>
                    )}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                    msg.role === 'user'
                                        ? 'bg-[#FD7979] text-white'
                                        : 'border border-[#FFCDC9] bg-white text-gray-800'
                                }`}
                            >
                                <p className="whitespace-pre-wrap text-sm">
                                    {msg.content}
                                </p>
                                {msg.has_tool_calls && msg.tool_calls && (
                                    <div className="mt-2 border-t border-white/20 pt-2">
                                        <p className="text-xs opacity-75">
                                            🔧 Tools used:{' '}
                                            {(() => {
                                                try {
                                                    const calls =
                                                        typeof msg.tool_calls ===
                                                        'string'
                                                            ? JSON.parse(
                                                                  msg.tool_calls,
                                                              )
                                                            : msg.tool_calls;
                                                    return Array.isArray(calls)
                                                        ? calls
                                                              .map(
                                                                  (c) =>
                                                                      c.name ||
                                                                      c.tool ||
                                                                      'tool',
                                                              )
                                                              .join(', ')
                                                        : 'tools';
                                                } catch {
                                                    return 'tools';
                                                }
                                            })()}
                                        </p>
                                    </div>
                                )}
                                <p
                                    className={`mt-1 text-xs ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}
                                >
                                    {new Date(
                                        msg.created_at,
                                    ).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                    {sending && (
                        <div className="flex justify-start">
                            <div className="rounded-2xl border border-[#FFCDC9] bg-white px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#FD7979]" />
                                    <span
                                        className="h-2 w-2 animate-bounce rounded-full bg-[#FD7979]"
                                        style={{ animationDelay: '0.1s' }}
                                    />
                                    <span
                                        className="h-2 w-2 animate-bounce rounded-full bg-[#FD7979]"
                                        style={{ animationDelay: '0.2s' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            {error && (
                <p className="bg-red-50 px-4 py-2 text-center text-sm text-red-600">
                    {error}
                </p>
            )}
            <div className="border-t border-[#FFCDC9] bg-white px-4 py-3">
                <div className="mx-auto flex max-w-4xl gap-3">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={1}
                        className="flex-1 resize-none rounded-xl border border-[#FFCDC9] px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || sending}
                        className="rounded-xl bg-[#FD7979] px-5 py-2.5 text-white hover:bg-[#FDACAC] disabled:opacity-50"
                    >
                        Send
                    </button>
                </div>
            </div>
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
