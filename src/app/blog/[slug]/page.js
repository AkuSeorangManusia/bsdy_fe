'use client';

import { contentApi } from '@/lib/api';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

export default function BlogPostPage({ params }) {
    const { slug } = use(params);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        contentApi
            .getBySlug(slug)
            .then((data) => setArticle(data.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-8">
                <p className="text-red-500">{error}</p>
                <Link
                    href="/#content"
                    className="mt-4 inline-block text-[#FD7979] hover:underline"
                >
                    ← Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <Link
                href="/#content"
                className="mb-6 inline-block text-sm text-[#FD7979] hover:underline"
            >
                ← Back to Articles
            </Link>

            {article.cover_image_url && (
                <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="mb-6 h-64 w-full rounded-2xl object-cover"
                />
            )}

            <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {article.title}
            </h1>

            {article.published_at && (
                <p className="mb-6 text-sm text-gray-500">
                    Published{' '}
                    {new Date(article.published_at).toLocaleDateString(
                        'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' },
                    )}
                </p>
            )}

            {article.excerpt && (
                <p className="mb-6 text-lg text-gray-600 italic">
                    {article.excerpt}
                </p>
            )}

            <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.body }}
            />
        </div>
    );
}
