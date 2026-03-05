'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { notesApi } from '@/lib/api';
import { useEffect, useState } from 'react';

function NotesContent() {
    const [notes, setNotes] = useState([]);
    const [labels, setLabels] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [form, setForm] = useState({
        title: '',
        content: '',
        label: 'coping',
        is_pinned: false,
    });

    const fetchNotes = async () => {
        try {
            const data = await notesApi.list(selectedLabel || null);
            setNotes(data.data || []);
        } catch {}
    };

    const fetchLabels = async () => {
        try {
            const data = await notesApi.labels();
            setLabels(data.data || []);
        } catch {}
    };

    useEffect(() => {
        Promise.all([fetchNotes(), fetchLabels()]).finally(() =>
            setLoading(false),
        );
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [selectedLabel]);

    const resetForm = () => {
        setForm({ title: '', content: '', label: 'coping', is_pinned: false });
        setEditing(null);
        setShowForm(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            if (editing) {
                await notesApi.update(editing, form);
                setMessage('Note updated!');
            } else {
                await notesApi.create(form);
                setMessage('Note created!');
            }
            resetForm();
            await fetchNotes();
            await fetchLabels();
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (note) => {
        setForm({
            title: note.title,
            content: note.content,
            label: note.label || 'coping',
            is_pinned: note.is_pinned,
        });
        setEditing(note.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this note?')) return;
        try {
            await notesApi.delete(id);
            await fetchNotes();
            await fetchLabels();
            setMessage('Note deleted');
        } catch (err) {
            setMessage(`Error: ${err.message}`);
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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900">
                    Coping Toolkit
                </h1>
                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="rounded-full bg-[#FD7979] px-5 py-2 text-sm text-white hover:bg-[#FDACAC]"
                >
                    + New Note
                </button>
            </div>

            {message && (
                <p
                    className={`mb-4 rounded-lg p-3 text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                >
                    {message}
                </p>
            )}

            {/* Label filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedLabel('')}
                    className={`rounded-full px-4 py-1.5 text-sm ${!selectedLabel ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700'}`}
                >
                    All
                </button>
                {labels.map((label) => (
                    <button
                        key={label}
                        onClick={() => setSelectedLabel(label)}
                        className={`rounded-full px-4 py-1.5 text-sm ${selectedLabel === label ? 'bg-[#FD7979] text-white' : 'bg-[#FEEAC9]/50 text-gray-700'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-6 rounded-2xl border border-[#FFCDC9] bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                        {editing ? 'Edit Note' : 'New Note'}
                    </h2>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    title: e.target.value,
                                }))
                            }
                            placeholder="Title"
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                    </div>
                    <div className="mb-3">
                        <textarea
                            value={form.content}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    content: e.target.value,
                                }))
                            }
                            placeholder="Content..."
                            rows={4}
                            className="w-full rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                    </div>
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            value={form.label}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    label: e.target.value,
                                }))
                            }
                            placeholder="Label"
                            className="rounded-lg border border-[#FFCDC9] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FD7979]"
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.is_pinned}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        is_pinned: e.target.checked,
                                    }))
                                }
                                className="accent-[#FD7979]"
                            />
                            Pinned
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={resetForm}
                            className="rounded-full border border-[#FFCDC9] px-5 py-2 text-sm text-gray-700 hover:bg-[#FEEAC9]/20"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="rounded-full bg-[#FD7979] px-5 py-2 text-sm text-white hover:bg-[#FDACAC] disabled:opacity-50"
                        >
                            {saving
                                ? 'Saving...'
                                : editing
                                  ? 'Update'
                                  : 'Create'}
                        </button>
                    </div>
                </div>
            )}

            {/* Notes list */}
            <div className="grid gap-4 sm:grid-cols-2">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <div
                            key={note.id}
                            className={`rounded-2xl border bg-white p-5 ${note.is_pinned ? 'border-[#FD7979]' : 'border-[#FFCDC9]'}`}
                        >
                            <div className="mb-2 flex items-start justify-between">
                                <h3 className="font-semibold text-gray-900">
                                    {note.is_pinned && '📌 '}
                                    {note.title}
                                </h3>
                                <span className="rounded-full bg-[#FEEAC9] px-2 py-0.5 text-xs text-gray-600">
                                    {note.label}
                                </span>
                            </div>
                            <p className="mb-3 text-sm text-gray-600 whitespace-pre-wrap">
                                {note.content}
                            </p>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">
                                    {new Date(
                                        note.updated_at,
                                    ).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="text-xs text-[#FD7979] hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="text-xs text-red-400 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-full py-10 text-center text-gray-500">
                        No notes yet. Create your first coping note!
                    </p>
                )}
            </div>
        </div>
    );
}

export default function NotesPage() {
    return (
        <ProtectedRoute>
            <NotesContent />
        </ProtectedRoute>
    );
}
