"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { moodApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Battery, Brain, Calendar, Coffee, Dumbbell, LayoutList, PenLine, Users, Target, ShieldAlert, Sparkles, Moon, Sun, ArrowLeft } from "lucide-react";

const APPETITES = ["poor", "reduced", "normal", "increased", "excessive"];

// to please validation
function appetiteToBackend(appetite) {
    switch (appetite) {
        case "poor":
            return "very_low";
        case "reduced":
            return "low";
        case "normal":
            return "normal";
        case "increased":
            return "high";
        case "excessive":
            return "very_high";
        default:
            return appetite;
    }
}

// Animation setup
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

function MoodContent() {
    const router = useRouter();
    const [todayMood, setTodayMood] = useState(null);
    const [moodLogged, setMoodLogged] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [tab, setTab] = useState("log"); // log | history

    const [form, setForm] = useState({
        mood_score: 5,
        energy_level: 5,
        anxiety_level: 3,
        stress_level: 3,
        sleep_hours: 7,
        sleep_quality: 5,
        appetite: "normal",
        social_interaction: false,
        exercise_done: false,
        notes: "",
        triggers: "",
        activities: "",
    });

    useEffect(() => {
        Promise.allSettled([moodApi.today(), moodApi.list()]).then(
            ([todayRes, histRes]) => {
                if (todayRes.status === "fulfilled") {
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
                            appetite: todayRes.value.data.appetite || "normal",
                            social_interaction:
                                todayRes.value.data.social_interaction || false,
                            exercise_done:
                                todayRes.value.data.exercise_done || false,
                            notes: todayRes.value.data.notes || "",
                            triggers: todayRes.value.data.triggers || "",
                            activities: todayRes.value.data.activities || "",
                        });
                    }
                }
                if (histRes.status === "fulfilled")
                    setHistory(histRes.value.data || []);
                setLoading(false);
            },
        );
    }, []);

    const updateField = (field, value) =>
        setForm((p) => ({ ...p, [field]: value }));

    const handleSubmit = async () => {
        setSaving(true);
        setMessage("");
        try {
            const payload = {
                ...form,
                appetite: appetiteToBackend(form.appetite),
                triggers: form.triggers
                    ? JSON.stringify(
                          form.triggers.split(",").map((s) => s.trim()),
                      )
                    : "[]",
                activities: form.activities
                    ? JSON.stringify(
                          form.activities.split(",").map((s) => s.trim()),
                      )
                    : "[]",
            };
            const res = await moodApi.create(payload);
            setTodayMood(res.data);
            setMoodLogged(true);
            setMessage("Mood saved successfully! Redirecting to dashboard...");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
            
            // Refresh history
            const histRes = await moodApi.list();
            setHistory(histRes.data || []);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const SliderField = ({ label, icon: Icon, value, onChange, min = 1, max = 10, step = 1, colorClass = "text-[#FD7979]" }) => (
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl transition-all hover:bg-white hover:border-[#FDACAC]/50 hover:shadow-md hover:shadow-[#FDACAC]/10 group">
            <div className="mb-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    {Icon && <Icon size={16} className={colorClass} />}
                    {label}
                </label>
                <div className={`text-sm font-black px-3 py-1 rounded-lg ${value > max/2 ? "bg-[#FDACAC]/20 text-[#FD7979]" : "bg-slate-200 text-slate-600"}`}>
                    {value}{label.includes("Sleep Hours") ? "h" : ""}
                </div>
            </div>
            <div className="relative pt-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 outline-none accent-[#FD7979]"
                    style={{
                        background: `linear-gradient(to right, #FDACAC ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%)`
                    }}
                />
            </div>
        </div>
    );

    const moodEmoji = (score) => {
        if (score >= 8) return "🤩";
        if (score >= 6) return "😊";
        if (score >= 4) return "😐";
        if (score >= 2) return "😟";
        return "😞";
    };

    const moodColor = (score) => {
        if (score >= 8) return "from-[#FEEAC9] to-[#FDACAC]";
        if (score >= 6) return "from-[#FDACAC] to-[#FD7979]";
        if (score >= 4) return "from-slate-200 to-slate-400";
        if (score >= 2) return "from-indigo-200 to-indigo-400";
        return "from-slate-600 to-slate-800";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-[#faf9f8]">
                <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-12 w-12 rounded-full border-4 border-[#FEEAC9] border-t-[#FD7979]" 
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Soft Background Mesh */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#FDACAC]/20 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-[#FEEAC9]/30 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
                
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </motion.button>

                {/* Header */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-2">Mood Tracker</h1>
                        <p className="text-lg text-slate-500 font-medium">Map your mind, trace your feelings.</p>
                    </div>
                    
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setTab("log")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${tab === "log" ? "bg-[#FDACAC]/20 text-[#FD7979] shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        >
                            <PenLine size={18} /> {moodLogged ? "Update Today" : "Log Today"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setTab("history")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${tab === "history" ? "bg-[#FDACAC]/20 text-[#FD7979] shadow-sm" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"}`}
                        >
                            <LayoutList size={18} /> History
                        </button>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 font-bold border shadow-sm ${message.startsWith("Error") ? "bg-red-50 text-red-500 border-red-100" : "bg-[#FEEAC9]/50 text-emerald-600 border-emerald-100"}`}
                        >
                            <Sparkles size={20} /> {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid gap-8 lg:grid-cols-12 items-start">
                    <motion.section 
                        initial="hidden" animate="visible" variants={fadeUp}
                        className="lg:col-span-8 w-full"
                    >
                        {tab === "log" && (
                            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-[0_20px_45px_-20px_rgba(253,121,121,0.1)]">
                                
                                {/* Big Mood Presentation */}
                                <div className="mb-10 text-center">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">How are you feeling?</h3>
                                    <motion.div 
                                        key={form.mood_score}
                                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                        className={`inline-flex items-center justify-center w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${moodColor(form.mood_score)} text-6xl md:text-7xl shadow-xl shadow-slate-200 border-8 border-white mx-auto`}
                                    >
                                        {moodEmoji(form.mood_score)}
                                    </motion.div>
                                </div>

                                <div className="space-y-8">
                                    {/* Sliders Grid */}
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <SliderField label="Overall Mood" icon={Activity} value={form.mood_score} onChange={(v) => updateField("mood_score", v)} />
                                        <SliderField label="Energy Level" icon={Battery} value={form.energy_level} onChange={(v) => updateField("energy_level", v)} />
                                        <SliderField label="Anxiety Level" icon={Brain} value={form.anxiety_level} onChange={(v) => updateField("anxiety_level", v)} colorClass="text-indigo-400" />
                                        <SliderField label="Stress Level" icon={Activity} value={form.stress_level} onChange={(v) => updateField("stress_level", v)} colorClass="text-rose-400" />
                                        <SliderField label="Sleep Hours" icon={Moon} value={form.sleep_hours} onChange={(v) => updateField("sleep_hours", v)} min={0} max={14} step={0.5} colorClass="text-blue-400" />
                                        <SliderField label="Sleep Quality" icon={Sun} value={form.sleep_quality} onChange={(v) => updateField("sleep_quality", v)} colorClass="text-amber-400" />
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* Selects and Toggles */}
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                                <Coffee size={16} className="text-[#FD7979]" /> Appetite Level
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={form.appetite}
                                                    onChange={(e) => updateField("appetite", e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-bold px-4 py-3.5 rounded-xl appearance-none focus:outline-none focus:ring-4 focus:ring-[#FDACAC]/30 focus:border-[#FD7979] hover:bg-white hover:border-[#FDACAC]/50 transition-all capitalize"
                                                >
                                                    {APPETITES.map((a) => (
                                                        <option key={a} value={a}>
                                                            {a.charAt(0).toUpperCase() + a.slice(1)} Appetite
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-end gap-3">
                                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.social_interaction ? "bg-[#FEEAC9]/40 border-[#FDACAC] text-slate-800" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white"}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.social_interaction}
                                                    onChange={(e) => updateField("social_interaction", e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-[#FD7979] focus:ring-[#FDACAC]"
                                                />
                                                <Users size={18} className={form.social_interaction ? "text-[#FD7979]" : "text-slate-400"} />
                                                <span className="font-bold text-sm">Had Social Interaction</span>
                                            </label>
                                            
                                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.exercise_done ? "bg-[#FEEAC9]/40 border-[#FDACAC] text-slate-800" : "bg-slate-50 border-slate-100 text-slate-500 hover:bg-white"}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={form.exercise_done}
                                                    onChange={(e) => updateField("exercise_done", e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-[#FD7979] focus:ring-[#FDACAC]"
                                                />
                                                <Dumbbell size={18} className={form.exercise_done ? "text-[#FD7979]" : "text-slate-400"} />
                                                <span className="font-bold text-sm">Completed Exercise</span>
                                            </label>
                                        </div>
                                    </div>

                                    <hr className="border-slate-100" />

                                    {/* Text Inputs */}
                                    <div className="space-y-5">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                                <PenLine size={16} className="text-[#FD7979]" /> Personal Notes
                                            </label>
                                            <textarea
                                                value={form.notes}
                                                onChange={(e) => updateField("notes", e.target.value)}
                                                rows={3}
                                                placeholder="Express how you're feeling today..."
                                                className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-2xl resize-none focus:outline-none focus:ring-4 focus:ring-[#FDACAC]/30 focus:border-[#FD7979] transition-all hover:bg-white placeholder:text-slate-400 font-medium"
                                            />
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                                    <ShieldAlert size={16} className="text-rose-400" /> Triggers <span className="text-xs font-normal text-slate-400">(comma separated)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.triggers}
                                                    onChange={(e) => updateField("triggers", e.target.value)}
                                                    placeholder="work, traffic, noise"
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FDACAC]/30 focus:border-[#FD7979] transition-all hover:bg-white placeholder:text-slate-400 font-medium"
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-2">
                                                    <Target size={16} className="text-emerald-400" /> Activities <span className="text-xs font-normal text-slate-400">(comma separated)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={form.activities}
                                                    onChange={(e) => updateField("activities", e.target.value)}
                                                    placeholder="reading, walk, therapy"
                                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 px-5 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#FDACAC]/30 focus:border-[#FD7979] transition-all hover:bg-white placeholder:text-slate-400 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={handleSubmit} 
                                        disabled={saving} 
                                        className="w-full py-4 bg-gradient-to-r from-[#FD7979] to-[#FDACAC] hover:from-[#FDACAC] hover:to-[#FD7979] text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-[#FD7979]/30 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {saving ? "Saving Record..." : moodLogged ? "Update Today's Record" : "Save Today's Record"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {tab === "history" && (
                            <motion.div 
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {history.length > 0 ? (
                                    history.map((entry) => (
                                        <motion.div 
                                            key={entry.id} 
                                            variants={fadeUp}
                                            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-[#FDACAC]/50 transition-all flex flex-col sm:flex-row sm:items-center gap-5 group"
                                        >
                                            <div className={`w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br ${moodColor(entry.mood_score)} flex items-center justify-center text-3xl shadow-sm`}>
                                                {moodEmoji(entry.mood_score)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-extrabold text-lg text-slate-800 truncate">
                                                        {new Date(entry.entry_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </h4>
                                                    <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-500 rounded-full">Score: {entry.mood_score}/10</span>
                                                </div>
                                                
                                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-slate-500 mb-2">
                                                    <span className="flex items-center gap-1"><Battery size={14}/> Energy: {entry.energy_level}/10</span>
                                                    <span className="flex items-center gap-1"><Brain size={14}/> Anxiety: {entry.anxiety_level}/10</span>
                                                    <span className="flex items-center gap-1"><Moon size={14}/> Sleep: {entry.sleep_hours}h</span>
                                                </div>

                                                {entry.notes && (
                                                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl italic mt-2 border border-slate-100">"{entry.notes}"</p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="bg-white rounded-[2.5rem] py-20 px-6 text-center border border-dashed border-slate-200">
                                        <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
                                        <h3 className="text-xl font-extrabold text-slate-700 mb-2">No Records Yet</h3>
                                        <p className="text-slate-500">Your mood journey begins here. Start tracking today to unlock insights.</p>
                                        <button onClick={() => setTab("log")} className="mt-6 px-6 py-2 bg-[#FEEAC9] text-[#FD7979] font-bold rounded-xl hover:bg-[#FDACAC] hover:text-white transition-colors">
                                            Log First Mood
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </motion.section>

                    <motion.aside 
                        initial="hidden" animate="visible" variants={fadeUp}
                        className="lg:col-span-4 w-full"
                    >
                        <div className="bg-slate-900 rounded-[2rem] p-6 lg:p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/15 sticky top-24">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-[#FDACAC]/30 to-transparent rounded-full blur-2xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#FD7979]/20 to-transparent rounded-full blur-xl pointer-events-none" />
                            
                            <h4 className="text-sm font-black tracking-widest uppercase text-[#FDACAC] mb-6 flex items-center gap-2">
                                <Activity size={16} /> Live Snapshot
                            </h4>
                            
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center mb-6 backdrop-blur-sm">
                                <motion.div key={form.mood_score} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-5xl mb-2">
                                    {moodEmoji(form.mood_score)}
                                </motion.div>
                                <p className="text-sm text-slate-300 font-medium mb-1">Current Mood Rating</p>
                                <p className="text-4xl font-black text-white">{form.mood_score}<span className="text-lg text-slate-400">/10</span></p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2"><Battery size={16} className="text-[#FEEAC9]" /> Energy</span>
                                    <span className="font-extrabold">{form.energy_level}/10</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2"><Brain size={16} className="text-[#FDACAC]" /> Anxiety</span>
                                    <span className="font-extrabold">{form.anxiety_level}/10</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2"><Activity size={16} className="text-[#FD7979]" /> Stress</span>
                                    <span className="font-extrabold">{form.stress_level}/10</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <span className="text-slate-300 text-sm font-medium flex items-center gap-2"><Moon size={16} className="text-indigo-300" /> Sleep Info</span>
                                    <span className="font-extrabold">{form.sleep_hours}h</span>
                                </div>
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
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
