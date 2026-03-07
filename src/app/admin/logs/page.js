'use client';

import { useEffect, useState } from 'react';
import { logsApi } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

function AdminLogsPage() {
    const [tab, setTab] = useState('auth'); // auth | activity | admin
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const perPage = 20;

    const fetchLogs = async (logTab, logPage) => {
        setLoading(true);
        try {
            let data;
            if (logTab === 'auth') {
                data = await logsApi.auth(logPage, perPage);
            } else if (logTab === 'activity') {
                data = await logsApi.activity(logPage, perPage);
            } else {
                data = await logsApi.admin(logPage, perPage);
            }
            setLogs(data.data?.data || []);
            setTotal(data.data?.total || 0);
        } catch {
            setLogs([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchLogs(tab, 1);
    }, [tab]);

    useEffect(() => {
        fetchLogs(tab, page);
    }, [page]);

    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold text-gray-900">
                Audit Logs
            </h1>

            <div className="mb-6 flex gap-2">
                {[
                    { key: 'auth', label: 'Auth Logs' },
                    { key: 'activity', label: 'Activity Logs' },
                    { key: 'admin', label: 'Admin Logs' },
                ].map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`rounded-full px-5 py-2 text-sm font-medium ${tab === t.key ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700 hover:bg-[#FEEAC9]'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FD7979] border-t-transparent" />
                </div>
            ) : logs.length === 0 ? (
                <div className="rounded-xl border border-[#FFCDC9] bg-[#FEEAC9]/30 p-8 text-center">
                    <p className="text-gray-500">No logs found.</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-[#FFCDC9]">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#FEEAC9]/50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Action
                                </th>
                                {tab !== 'auth' && (
                                    <th className="px-4 py-3 font-medium text-gray-700">
                                        Feature
                                    </th>
                                )}
                                {tab !== 'auth' && (
                                    <th className="px-4 py-3 font-medium text-gray-700">
                                        Entity
                                    </th>
                                )}
                                {tab === 'auth' && (
                                    <th className="px-4 py-3 font-medium text-gray-700">
                                        Status
                                    </th>
                                )}
                                <th className="px-4 py-3 font-medium text-gray-700">
                                    Time
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFCDC9]/50">
                            {logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-[#FEEAC9]/20"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {log.action}
                                    </td>
                                    {tab !== 'auth' && (
                                        <td className="px-4 py-3 text-gray-600">
                                            {log.feature || '—'}
                                        </td>
                                    )}
                                    {tab !== 'auth' && (
                                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                            {log.entity_type}
                                            {log.entity_id && (
                                                <span className="ml-1 text-gray-400">
                                                    {log.entity_id.slice(0, 8)}
                                                    ...
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    {tab === 'auth' && (
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${log.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                                            >
                                                {log.success
                                                    ? 'Success'
                                                    : 'Failed'}
                                            </span>
                                        </td>
                                    )}
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Page {page} of {totalPages} ({total} total)
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="rounded-lg border border-[#FFCDC9] px-3 py-1.5 text-sm text-gray-700 hover:bg-[#FEEAC9]/30 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page >= totalPages}
                            className="rounded-lg border border-[#FFCDC9] px-3 py-1.5 text-sm text-gray-700 hover:bg-[#FEEAC9]/30 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminLogsWrapper() {
    return (
        <ProtectedRoute requireAdmin>
            <AdminLogsPage />
        </ProtectedRoute>
    );
}
