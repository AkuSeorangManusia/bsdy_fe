'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { reportsApi } from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function ReportsContent() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [reportType, setReportType] = useState('weekly');
    const [sendEmail, setSendEmail] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        reportsApi
            .list(20)
            .then((data) => setReports(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const res = await reportsApi.generate({
                report_type: reportType,
                period_start: null,
                period_end: null,
                send_email: sendEmail,
            });
            setReports((prev) => [res.data, ...prev]);
            setMessage('Report generated successfully!');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setGenerating(false);
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
            <h1 className="mb-6 text-3xl font-bold text-gray-900">
                Mental Health Reports
            </h1>

            <div className="mb-8 rounded-2xl border border-[#FFCDC9] bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Generate New Report
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="accent-[#FD7979]"
                        />
                        Send via email
                    </label>
                    <button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="rounded-full bg-[#FD7979] px-6 py-2 text-white hover:bg-[#FDACAC] disabled:opacity-50"
                    >
                        {generating ? 'Generating...' : 'Generate'}
                    </button>
                </div>
                {message && (
                    <p
                        className={`mt-3 text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}
                    >
                        {message}
                    </p>
                )}
            </div>

            <div className="space-y-3">
                {reports.length > 0 ? (
                    reports.map((report) => (
                        <Link
                            key={report.id}
                            href={`/reports/${report.id}`}
                            className="block rounded-2xl border border-[#FFCDC9] bg-white p-5 transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {report.title}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {report.report_type} •{' '}
                                        {report.period_start} →{' '}
                                        {report.period_end}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${report.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                    >
                                        {report.status}
                                    </span>
                                    <p className="mt-1 text-xs text-gray-400">
                                        {new Date(
                                            report.created_at,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p className="py-10 text-center text-gray-500">
                        No reports yet. Generate your first one above!
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ReportsPage() {
    return (
        <ProtectedRoute>
            <ReportsContent />
        </ProtectedRoute>
    );
}
