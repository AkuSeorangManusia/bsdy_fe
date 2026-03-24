'use client';

import { contentApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marked } from 'marked';
import { use, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage({ params }) {
    const { slug } = use(params);
    const router = useRouter();
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
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </motion.button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back
            </motion.button>

            {article.cover_image_url && (
                <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="mb-6 h-64 w-full rounded-2xl object-cover"
                />
            )}

            <h1 className="mb-4 text-5xl font-bold text-gray-900">
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

            <div className="my-10 h-px bg-gray-300" />

            <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                    __html: marked.parse(article.body || ''),
                }}
            />
        </div>
    );
}
