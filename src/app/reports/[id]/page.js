'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { reportsApi } from '@/lib/api';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

function ReportDetailContent({ reportId }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        reportsApi
            .get(reportId)
            .then((data) => setReport(data.data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [reportId]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-8">
                <p className="text-red-500">{error}</p>
                <Link
                    href="/reports"
                    className="mt-4 inline-block text-[#FD7979] hover:underline"
                >
                    ← Back to Reports
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <Link
                href="/reports"
                className="mb-4 inline-block text-sm text-[#FD7979] hover:underline"
            >
                ← Back to Reports
            </Link>

            <div className="rounded-2xl border border-[#FFCDC9] bg-white p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {report.title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {report.report_type} • {report.period_start} →{' '}
                        {report.period_end} • Generated{' '}
                        {new Date(report.created_at).toLocaleDateString()}
                    </p>
                </div>

                {report.content && (
                    <div className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900">
                            Report
                        </h2>
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                            {report.content}
                        </div>
                    </div>
                )}

                {report.ai_analysis && (
                    <div className="mb-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900">
                            AI Analysis
                        </h2>
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                            {report.ai_analysis}
                        </div>
                    </div>
                )}

                {report.recommendations && (
                    <div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-900">
                            Recommendations
                        </h2>
                        <div className="whitespace-pre-wrap text-sm text-gray-700">
                            {report.recommendations}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ReportDetailPage({ params }) {
    const { id } = use(params);
    return (
        <ProtectedRoute>
            <ReportDetailContent reportId={id} />
        </ProtectedRoute>
    );
}
