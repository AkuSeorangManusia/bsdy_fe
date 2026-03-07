'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { contentApi } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminContentPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const fetchArticles = async () => {
        try {
            const data = await contentApi.list(100, 0);
            setArticles(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handleCreate = async () => {
        setCreating(true);
        try {
            const data = await contentApi.create({
                title: 'Untitled Article',
                body: 'Start writing here...',
                excerpt: '',
                status: 'draft',
            });
            window.location.href = `/admin/content/${data.data.id}`;
        } catch (err) {
            setError(err.message);
            setCreating(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await contentApi.delete(id);
            setArticles((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    const statusColor = (status) => {
        switch (status) {
            case 'published':
                return 'bg-green-100 text-green-700';
            case 'draft':
                return 'bg-yellow-100 text-yellow-700';
            case 'archived':
                return 'bg-gray-100 text-gray-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Manage Content
                </h1>
                <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="rounded-lg bg-[#FD7979] px-4 py-2 text-sm font-medium text-white hover:bg-[#FDACAC] disabled:opacity-50"
                >
                    {creating ? 'Creating...' : '+ New Article'}
                </button>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            ) : articles.length === 0 ? (
                <div className="rounded-xl border border-[#FFCDC9] bg-[#FEEAC9]/30 p-8 text-center">
                    <p className="text-gray-500">
                        No articles yet. Create your first one!
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[#FFCDC9]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#FEEAC9]/50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Title
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Status
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Created
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFCDC9]/50">
                            {articles.map((article) => (
                                <tr
                                    key={article.id}
                                    className="hover:bg-[#FEEAC9]/20"
                                >
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {article.title}
                                            </p>
                                            {article.excerpt && (
                                                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                                                    {article.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(article.status)}`}
                                        >
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(
                                            article.created_at,
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/admin/content/${article.id}`}
                                                className="rounded bg-[#FEEAC9] px-3 py-1 text-xs font-medium text-gray-700 hover:bg-[#FFCDC9]"
                                            >
                                                Edit
                                            </Link>
                                            {article.status === 'published' && (
                                                <Link
                                                    href={`/blog/${article.slug}`}
                                                    target="_blank"
                                                    className="rounded bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                                                >
                                                    View
                                                </Link>
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        article.id,
                                                        article.title,
                                                    )
                                                }
                                                className="rounded bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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
