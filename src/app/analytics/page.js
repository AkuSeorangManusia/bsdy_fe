'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { analyticsApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function AnalyticsContent() {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('weekly');
    const [message, setMessage] = useState('');

    useEffect(() => {
        analyticsApi
            .list(20)
            .then((data) => setAnalytics(data.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleGenerate = async () => {
        setGenerating(true);
        setMessage('');
        try {
            const res = await analyticsApi.generate(selectedPeriod);
            setAnalytics((prev) => [res.data, ...prev]);
            setMessage('Analytics generated successfully!');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setGenerating(false);
        }
    };

    const trendColor = (trend) => {
        if (trend === 'improving') return 'text-green-600';
        if (trend === 'declining') return 'text-red-600';
        return 'text-yellow-600';
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
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Analytics</h1>

            {/* Generate */}
            <div className="mb-8 rounded-2xl border border-[#FFCDC9] bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Generate New Analytics
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                    >
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
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

            {/* List */}
            <div className="space-y-4">
                {analytics.length > 0 ? (
                    analytics.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-2xl border border-[#FFCDC9] bg-white p-6"
                        >
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <span className="rounded-full bg-[#FEEAC9] px-3 py-1 text-xs font-medium text-gray-700">
                                        {item.period_type}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        {item.period_start} → {item.period_end}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`text-sm font-semibold ${trendColor(item.overall_mood_trend)}`}
                                    >
                                        {item.overall_mood_trend}
                                    </span>
                                    {item.avg_mood_score && (
                                        <span className="text-sm text-gray-600">
                                            Avg: {item.avg_mood_score}/10
                                        </span>
                                    )}
                                </div>
                            </div>
                            {item.summary && (
                                <div className="mb-3">
                                    <h3 className="mb-1 text-sm font-medium text-gray-700">
                                        Summary
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {item.summary}
                                    </p>
                                </div>
                            )}
                            {item.insights && (
                                <div className="mb-3">
                                    <h3 className="mb-1 text-sm font-medium text-gray-700">
                                        Insights
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {item.insights}
                                    </p>
                                </div>
                            )}
                            {item.recommendations && (
                                <div>
                                    <h3 className="mb-1 text-sm font-medium text-gray-700">
                                        Recommendations
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {item.recommendations}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="py-10 text-center text-gray-500">
                        No analytics yet. Generate your first one above!
                    </p>
                )}
            </div>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <ProtectedRoute>
            <AnalyticsContent />
        </ProtectedRoute>
    );
}
