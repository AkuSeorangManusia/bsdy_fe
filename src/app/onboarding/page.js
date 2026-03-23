"use client";

import { useAuth } from "@/context/AuthContext";
import { onboardingApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STRESS_LEVELS = ["low", "moderate", "high", "severe"];
const ANXIETY_LEVELS = ["low", "moderate", "high", "severe"];
const DEPRESSION_LEVELS = ["low", "moderate", "high", "severe"];
const SLEEP_QUALITY = ["poor", "fair", "moderate", "good", "excellent"];
const SOCIAL_SUPPORT = ["none", "weak", "moderate", "strong"];
const COPING_STYLES = [
    "problem_focused",
    "emotion_focused",
    "avoidant",
    "social_support",
    "mixed",
];
const THERAPY_STATUSES = ["none", "past", "active", "considering"];
const PERSONALITY_OPTIONS = [
    "empathetic",
    "introverted",
    "extroverted",
    "analytical",
    "creative",
    "anxious",
    "optimistic",
    "perfectionist",
    "resilient",
    "sensitive",
];

export default function OnboardingPage() {
    const { user, refreshUser } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        birth: "",
        family_background: "",
        stress_level: "moderate",
        anxiety_level: "low",
        depression_level: "low",
        sleep_quality: "moderate",
        social_support: "moderate",
        coping_style: "problem_focused",
        personality_traits: [],
        mental_health_history: "",
        current_medications: "",
        therapy_status: "none",
        additional_notes: "",
    });

    if (!user) return null;
    if (user.onboarding_completed) {
        router.push("/dashboard");
        return null;
    }

    const updateField = (field, value) =>
        setForm((p) => ({ ...p, [field]: value }));

    const toggleTrait = (trait) => {
        setForm((p) => ({
            ...p,
            personality_traits: p.personality_traits.includes(trait)
                ? p.personality_traits.filter((t) => t !== trait)
                : [...p.personality_traits, trait],
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            await onboardingApi.submitBaseline({
                ...form,
                personality_traits: JSON.stringify(form.personality_traits),
                current_medications: form.current_medications || null,
                additional_notes: form.additional_notes || null,
            });
            await refreshUser();
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const SelectField = ({ label, value, options, onChange }) => (
        <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="select-modern"
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>
                        {opt
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                ))}
            </select>
        </div>
    );

    return (
        <div className="app-section py-8">
            <div className="grid gap-5 lg:grid-cols-12">
                <aside className="glass-card-strong lg:col-span-4 p-6">
                    <h1 className="text-2xl font-bold text-[#2f1f1f]">Welcome, {user.name}!</h1>
                    <p className="mt-2 text-sm text-soft">We&apos;ll use this baseline to personalize your experience.</p>
                    <div className="mt-5 space-y-2 text-sm text-soft">
                        <p>1. Personal profile and current state</p>
                        <p>2. Habits and personality context</p>
                        <p>3. History, therapy, and extra notes</p>
                    </div>
                </aside>

                <section className="glass-card-strong lg:col-span-8 p-8">
                    <p className="mb-3 text-sm text-soft">Step {step} of 3</p>

                <div className="mb-6 flex gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 flex-1 rounded-full ${s <= step ? "bg-[#FD7979]" : "bg-[#FEEAC9]"}`}
                        />
                    ))}
                </div>

                {error && (
                    <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {step === 1 && (
                    <div>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={form.birth}
                                onChange={(e) =>
                                    updateField("birth", e.target.value)
                                }
                                className="input-modern"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                                Family Background
                            </label>
                            <textarea
                                value={form.family_background}
                                onChange={(e) =>
                                    updateField(
                                        "family_background",
                                        e.target.value,
                                    )
                                }
                                placeholder="Any relevant family history..."
                                rows={3}
                                className="textarea-modern"
                            />
                        </div>
                        <SelectField
                            label="Stress Level"
                            value={form.stress_level}
                            options={STRESS_LEVELS}
                            onChange={(v) => updateField("stress_level", v)}
                        />
                        <SelectField
                            label="Anxiety Level"
                            value={form.anxiety_level}
                            options={ANXIETY_LEVELS}
                            onChange={(v) => updateField("anxiety_level", v)}
                        />
                        <SelectField
                            label="Depression Level"
                            value={form.depression_level}
                            options={DEPRESSION_LEVELS}
                            onChange={(v) => updateField("depression_level", v)}
                        />
                        <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn-primary mt-4 w-full py-2.5"
                        >
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <SelectField
                            label="Sleep Quality"
                            value={form.sleep_quality}
                            options={SLEEP_QUALITY}
                            onChange={(v) => updateField("sleep_quality", v)}
                        />
                        <SelectField
                            label="Social Support"
                            value={form.social_support}
                            options={SOCIAL_SUPPORT}
                            onChange={(v) => updateField("social_support", v)}
                        />
                        <SelectField
                            label="Coping Style"
                            value={form.coping_style}
                            options={COPING_STYLES}
                            onChange={(v) => updateField("coping_style", v)}
                        />
                        <div className="mb-4">
                            <label className="mb-2 block text-sm font-medium text-[#5b4545]">
                                Personality Traits
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {PERSONALITY_OPTIONS.map((trait) => (
                                    <button
                                        type="button"
                                        key={trait}
                                        onClick={() => toggleTrait(trait)}
                                        className={`rounded-full px-3 py-1 text-sm transition ${
                                            form.personality_traits.includes(
                                                trait,
                                            )
                                                ? "tab-pill tab-pill-active"
                                                : "tab-pill hover:bg-[#FFCDC9]"
                                        }`}
                                    >
                                        {trait}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn-secondary flex-1 py-2.5"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="btn-primary flex-1 py-2.5"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                                Mental Health History
                            </label>
                            <textarea
                                value={form.mental_health_history}
                                onChange={(e) =>
                                    updateField(
                                        "mental_health_history",
                                        e.target.value,
                                    )
                                }
                                placeholder="Any prior diagnoses or treatments..."
                                rows={3}
                                className="textarea-modern"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                                Current Medications
                            </label>
                            <input
                                type="text"
                                value={form.current_medications}
                                onChange={(e) =>
                                    updateField(
                                        "current_medications",
                                        e.target.value,
                                    )
                                }
                                placeholder="None, or list medications..."
                                className="input-modern"
                            />
                        </div>
                        <SelectField
                            label="Therapy Status"
                            value={form.therapy_status}
                            options={THERAPY_STATUSES}
                            onChange={(v) => updateField("therapy_status", v)}
                        />
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-[#5b4545]">
                                Additional Notes
                            </label>
                            <textarea
                                value={form.additional_notes}
                                onChange={(e) =>
                                    updateField(
                                        "additional_notes",
                                        e.target.value,
                                    )
                                }
                                placeholder="Anything else you'd like to share..."
                                rows={3}
                                className="textarea-modern"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="btn-secondary flex-1 py-2.5"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary flex-1 py-2.5"
                            >
                                {loading ? "Submitting..." : "Complete Setup"}
                            </button>
                        </div>
                    </div>
                )}
                </section>
            </div>
        </div>
    );
}
