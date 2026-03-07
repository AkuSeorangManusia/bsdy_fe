'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentApi } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminContentEditor() {
    const { id } = useParams();
    const router = useRouter();
    const fileInputRef = useRef(null);

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('draft');

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await contentApi.get(id);
                const a = data.data;
                setArticle(a);
                setTitle(a.title || '');
                setExcerpt(a.excerpt || '');
                setBody(a.body || '');
                setStatus(a.status || 'draft');
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
        setError('');
        setSuccess('');
        try {
            const data = await contentApi.update(id, {
                title,
                excerpt,
                body,
                status,
            });
            setArticle(data.data);
            setSuccess('Article saved successfully!');
            setTimeout(() => setSuccess(''), 3000);
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
        setError('');
        try {
            const data = await contentApi.uploadCover(id, file);
            setArticle(data.data);
            setSuccess('Cover image uploaded!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    if (!article && error) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                    {error}
                </div>
                <button
                    onClick={() => router.push('/admin/content')}
                    className="mt-4 text-sm text-[#FD7979] hover:underline"
                >
                    &larr; Back to content list
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => router.push('/admin/content')}
                    className="text-sm text-gray-500 hover:text-[#FD7979]"
                >
                    &larr; Back to content list
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-[#FD7979] px-4 py-2 text-sm font-medium text-white hover:bg-[#FDACAC] disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}
            {success && (
                <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                {/* Cover Image */}
                <div className="rounded-xl border border-[#FFCDC9] p-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Cover Image
                    </label>
                    {article?.cover_image_url && (
                        <img
                            src={article.cover_image_url}
                            alt="Cover"
                            className="mb-3 h-48 w-full rounded-lg object-cover"
                        />
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleCoverUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="rounded-lg border border-[#FFCDC9] px-4 py-2 text-sm text-gray-700 hover:bg-[#FEEAC9]/30 disabled:opacity-50"
                    >
                        {uploading
                            ? 'Uploading...'
                            : article?.cover_image_url
                              ? 'Replace Image'
                              : 'Upload Image'}
                    </button>
                    <p className="mt-1 text-xs text-gray-400">
                        JPEG, PNG, WebP, or GIF. Max 10 MB.
                    </p>
                </div>

                {/* Title */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        placeholder="Article title"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-[#FFCDC9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Excerpt */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Excerpt
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        placeholder="Short summary shown in article cards"
                    />
                </div>

                {/* Body */}
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                        Body (Markdown)
                    </label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={20}
                        className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        placeholder="## Introduction\n\nWrite your article content here using **Markdown**..."
                    />
                </div>

                {/* Meta info */}
                {article && (
                    <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
                        <p>
                            Slug:{' '}
                            <span className="font-mono">{article.slug}</span>
                        </p>
                        <p>
                            Created:{' '}
                            {new Date(article.created_at).toLocaleString()}
                        </p>
                        {article.published_at && (
                            <p>
                                Published:{' '}
                                {new Date(
                                    article.published_at,
                                ).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>
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
