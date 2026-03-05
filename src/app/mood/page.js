'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { moodApi } from '@/lib/api';
import { useEffect, useState } from 'react';

const APPETITES = ['poor', 'reduced', 'normal', 'increased', 'excessive'];

// to please validation
function appetiteToBackend(appetite) {
    switch (appetite) {
        case 'poor':
            return 'very_low';
        case 'reduced':
            return 'low';
        case 'normal':
            return 'normal';
        case 'increased':
            return 'high';
        case 'excessive':
            return 'very_high';
        default:
            return appetite;
    }
}

function MoodContent() {
    const [todayMood, setTodayMood] = useState(null);
    const [moodLogged, setMoodLogged] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [tab, setTab] = useState('log'); // log | history

    const [form, setForm] = useState({
        mood_score: 5,
        energy_level: 5,
        anxiety_level: 3,
        stress_level: 3,
        sleep_hours: 7,
        sleep_quality: 5,
        appetite: 'normal',
        social_interaction: false,
        exercise_done: false,
        notes: '',
        triggers: '',
        activities: '',
    });

    useEffect(() => {
        Promise.allSettled([moodApi.today(), moodApi.list()]).then(
            ([todayRes, histRes]) => {
                if (todayRes.status === 'fulfilled') {
                    setMoodLogged(todayRes.value.logged_today);
                    if (todayRes.value.data) {
                        setTodayMood(todayRes.value.data);
                        setForm({
                            mood_score: todayRes.value.data.mood_score,
                            energy_level: todayRes.value.data.energy_level,
                            anxiety_level: todayRes.value.data.anxiety_level,
                            stress_level: todayRes.value.data.stress_level,
                            sleep_hours: todayRes.value.data.sleep_hours,
                            sleep_quality: todayRes.value.data.sleep_quality,
                            appetite: todayRes.value.data.appetite || 'normal',
                            social_interaction:
                                todayRes.value.data.social_interaction || false,
                            exercise_done:
                                todayRes.value.data.exercise_done || false,
                            notes: todayRes.value.data.notes || '',
                            triggers: todayRes.value.data.triggers || '',
                            activities: todayRes.value.data.activities || '',
                        });
                    }
                }
                if (histRes.status === 'fulfilled')
                    setHistory(histRes.value.data || []);
                setLoading(false);
            },
        );
    }, []);

    const updateField = (field, value) =>
        setForm((p) => ({ ...p, [field]: value }));

    const handleSubmit = async () => {
        setSaving(true);
        setMessage('');
        try {
            const payload = {
                ...form,
                appetite: appetiteToBackend(form.appetite),
                triggers: form.triggers
                    ? JSON.stringify(
                          form.triggers.split(',').map((s) => s.trim()),
                      )
                    : '[]',
                activities: form.activities
                    ? JSON.stringify(
                          form.activities.split(',').map((s) => s.trim()),
                      )
                    : '[]',
            };
            const res = await moodApi.create(payload);
            setTodayMood(res.data);
            setMoodLogged(true);
            setMessage('Mood saved successfully!');
            // Refresh history
            const histRes = await moodApi.list();
            setHistory(histRes.data || []);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const SliderField = ({ label, value, onChange, min = 1, max = 10 }) => (
        <div className="mb-4">
            <div className="mb-1 flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
                <span className="text-sm font-bold text-[#FD7979]">
                    {value}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={label.includes('Sleep Hours') ? 0.5 : 1}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full accent-[#FD7979]"
            />
        </div>
    );

    const moodEmoji = (score) => {
        if (score >= 8) return '😊';
        if (score >= 6) return '🙂';
        if (score >= 4) return '😐';
        if (score >= 2) return '😟';
        return '😢';
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
                Mood Tracker
            </h1>

            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setTab('log')}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${tab === 'log' ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700'}`}
                >
                    {moodLogged ? 'Update Today' : 'Log Today'}
                </button>
                <button
                    onClick={() => setTab('history')}
                    className={`rounded-full px-5 py-2 text-sm font-medium transition ${tab === 'history' ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700'}`}
                >
                    History
                </button>
            </div>

            {message && (
                <p
                    className={`mb-4 rounded-lg p-3 text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                >
                    {message}
                </p>
            )}

            {tab === 'log' && (
                <div className="rounded-2xl border border-[#FFCDC9] bg-white p-6">
                    <div className="mb-6 text-center">
                        <div className="text-5xl">
                            {moodEmoji(form.mood_score)}
                        </div>
                    </div>
                    <SliderField
                        label="Mood Score"
                        value={form.mood_score}
                        onChange={(v) => updateField('mood_score', v)}
                    />
                    <SliderField
                        label="Energy Level"
                        value={form.energy_level}
                        onChange={(v) => updateField('energy_level', v)}
                    />
                    <SliderField
                        label="Anxiety Level"
                        value={form.anxiety_level}
                        onChange={(v) => updateField('anxiety_level', v)}
                    />
                    <SliderField
                        label="Stress Level"
                        value={form.stress_level}
                        onChange={(v) => updateField('stress_level', v)}
                    />
                    <SliderField
                        label="Sleep Hours"
                        value={form.sleep_hours}
                        onChange={(v) => updateField('sleep_hours', v)}
                        min={0}
                        max={14}
                    />
                    <SliderField
                        label="Sleep Quality"
                        value={form.sleep_quality}
                        onChange={(v) => updateField('sleep_quality', v)}
                    />

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Appetite
                        </label>
                        <select
                            value={form.appetite}
                            onChange={(e) =>
                                updateField('appetite', e.target.value)
                            }
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        >
                            {APPETITES.map((a) => (
                                <option key={a} value={a}>
                                    {a.charAt(0).toUpperCase() + a.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4 flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.social_interaction}
                                onChange={(e) =>
                                    updateField(
                                        'social_interaction',
                                        e.target.checked,
                                    )
                                }
                                className="accent-[#FD7979]"
                            />
                            Social Interaction
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.exercise_done}
                                onChange={(e) =>
                                    updateField(
                                        'exercise_done',
                                        e.target.checked,
                                    )
                                }
                                className="accent-[#FD7979]"
                            />
                            Exercise Done
                        </label>
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Notes
                        </label>
                        <textarea
                            value={form.notes}
                            onChange={(e) =>
                                updateField('notes', e.target.value)
                            }
                            rows={2}
                            placeholder="How are you feeling?"
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Triggers (comma separated)
                        </label>
                        <input
                            type="text"
                            value={form.triggers}
                            onChange={(e) =>
                                updateField('triggers', e.target.value)
                            }
                            placeholder="work, relationship, finances"
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Activities (comma separated)
                        </label>
                        <input
                            type="text"
                            value={form.activities}
                            onChange={(e) =>
                                updateField('activities', e.target.value)
                            }
                            placeholder="reading, walking, meditation"
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="w-full rounded-full bg-[#FD7979] py-3 text-white hover:bg-[#FDACAC] disabled:opacity-50"
                    >
                        {saving
                            ? 'Saving...'
                            : moodLogged
                              ? 'Update Mood'
                              : 'Save Mood'}
                    </button>
                </div>
            )}

            {tab === 'history' && (
                <div className="space-y-3">
                    {history.length > 0 ? (
                        history.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center gap-4 rounded-2xl border border-[#FFCDC9] bg-white p-4"
                            >
                                <div className="text-3xl">
                                    {moodEmoji(entry.mood_score)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {entry.entry_date}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Mood: {entry.mood_score}/10 • Energy:{' '}
                                        {entry.energy_level}/10 • Sleep:{' '}
                                        {entry.sleep_hours}h
                                    </p>
                                    {entry.notes && (
                                        <p className="mt-1 text-sm text-gray-500">
                                            {entry.notes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="py-10 text-center text-gray-500">
                            No mood entries yet. Start tracking today!
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function MoodPage() {
    return (
        <ProtectedRoute>
            <MoodContent />
        </ProtectedRoute>
    );
}
