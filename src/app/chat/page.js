'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { chatsApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ChatListContent() {
    const router = useRouter();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

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
            alert(err.message);
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Delete this chat?')) return;
        try {
            await chatsApi.delete(id);
            setChats((prev) => prev.filter((c) => c.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">AI Chat</h1>
            </div>

            {/* New chat buttons */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
                <button
                    onClick={() => handleCreate('companion')}
                    disabled={creating}
                    className="rounded-2xl border border-[#FFCDC9] bg-white p-6 text-left transition hover:shadow-md disabled:opacity-50"
                >
                    <div className="mb-2 text-3xl">💬</div>
                    <h3 className="font-semibold text-gray-900">
                        Companion Chat
                    </h3>
                    <p className="text-sm text-gray-600">
                        Empathetic AI companion for conversation and emotional
                        support
                    </p>
                </button>
                <button
                    onClick={() => handleCreate('agentic')}
                    disabled={creating}
                    className="rounded-2xl border border-[#FFCDC9] bg-white p-6 text-left transition hover:shadow-md disabled:opacity-50"
                >
                    <div className="mb-2 text-3xl">🤖</div>
                    <h3 className="font-semibold text-gray-900">
                        Agentic Chat
                    </h3>
                    <p className="text-sm text-gray-600">
                        AI with tools — can access mood data, generate reports,
                        manage notes
                    </p>
                </button>
            </div>

            {/* Chat list */}
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Your Chats
            </h2>
            <div className="space-y-3">
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <Link
                            key={chat.id}
                            href={`/chat/${chat.id}`}
                            className="flex items-center justify-between rounded-2xl border border-[#FFCDC9] bg-white p-4 transition hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">
                                    {chat.chat_type === 'agentic' ? '🤖' : '💬'}
                                </span>
                                <div>
                                    <h3 className="font-medium text-gray-900">
                                        {chat.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {chat.chat_type} • {chat.message_count}{' '}
                                        messages
                                        {!chat.is_active && ' • closed'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-400">
                                    {new Date(
                                        chat.updated_at,
                                    ).toLocaleDateString()}
                                </span>
                                <button
                                    onClick={(e) => handleDelete(chat.id, e)}
                                    className="text-xs text-red-400 hover:text-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="py-10 text-center text-gray-500">
                        No chats yet. Start a new conversation above!
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ChatPage() {
    return (
        <ProtectedRoute>
            <ChatListContent />
        </ProtectedRoute>
    );
}
