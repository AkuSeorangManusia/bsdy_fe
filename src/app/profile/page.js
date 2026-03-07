'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { authApi, onboardingApi } from '@/lib/api';
import { useState, useEffect } from 'react';

function ProfileContent() {
    const { user, refreshUser, logout } = useAuth();
    const [tab, setTab] = useState('profile'); // profile | baseline
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [profileForm, setProfileForm] = useState({ name: '', birth: '' });
    const [baseline, setBaseline] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileForm({ name: user.name || '', birth: user.birth || '' });
        }
    }, [user]);

    useEffect(() => {
        if (tab === 'baseline') {
            onboardingApi
                .getBaseline()
                .then((d) => setBaseline(d.data))
                .catch(() => {});
        }
    }, [tab]);

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await authApi.updateMe(profileForm);
            await refreshUser();
            setEditing(false);
            setMessage('Profile updated!');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">Profile</h1>

            <div className="mb-6 flex gap-2">
                {['profile', 'baseline'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`rounded-full px-5 py-2 text-sm font-medium capitalize ${tab === t ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {message && (
                <p
                    className={`mb-4 rounded-lg p-3 text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                >
                    {message}
                </p>
            )}

            {tab === 'profile' && (
                <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                    <div className="mb-6 flex items-center gap-4">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt=""
                                className="h-16 w-16 rounded-full"
                                referrerPolicy="no-referrer"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FD7979] text-2xl text-white">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                {user.name}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                            <p className="text-xs text-gray-400">
                                Role: {user.role} • Joined:{' '}
                                {new Date(user.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {editing ? (
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <input
                                    type="date"
                                    value={profileForm.birth}
                                    onChange={(e) =>
                                        setProfileForm((p) => ({
                                            ...p,
                                            birth: e.target.value,
                                        }))
                                    }
                                    className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setEditing(false)}
                                    className="rounded-full border border-[#FFCDC9] px-5 py-2 text-sm text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="rounded-full bg-[#FD7979] px-5 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-700">
                                <strong>Username:</strong> {user.username}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Email:</strong> {user.email}{' '}
                                {user.email_verified ? '✅' : '❌'}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Birth:</strong>{' '}
                                {user.birth || 'Not set'}
                            </p>
                            <p className="text-sm text-gray-700">
                                <strong>Onboarding:</strong>{' '}
                                {user.onboarding_completed
                                    ? 'Completed'
                                    : 'Pending'}
                            </p>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setEditing(true)}
                                    className="rounded-full bg-[#FD7979] px-5 py-2 text-sm text-white hover:bg-[#FDACAC]"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className="rounded-full border border-red-300 px-5 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {tab === 'baseline' && (
                <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        Baseline Assessment
                    </h2>
                    {baseline ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(baseline)
                                .filter(
                                    ([k]) =>
                                        ![
                                            'id',
                                            'user_id',
                                            'created_at',
                                            'updated_at',
                                        ].includes(k),
                                )
                                .map(([key, val]) => (
                                    <div
                                        key={key}
                                        className="rounded-lg bg-[#FEEAC9]/30 px-3 py-2"
                                    >
                                        <p className="text-xs font-medium text-gray-500">
                                            {key.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {val || '—'}
                                        </p>
                                    </div>
                                ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No baseline data available.
                        </p>
                    )}
                </div>
            )}


        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}
