"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { authApi, onboardingApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, Activity, Mail, Calendar, LogOut, CheckCircle, XCircle, Shield, Clock, Edit3, X, Save, ArrowLeft } from "lucide-react";

// Animation setup
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

function ProfileContent() {
    const { user, refreshUser, logout } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState("profile"); // profile | baseline
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [profileForm, setProfileForm] = useState({ name: "", birth: "" });
    const [baseline, setBaseline] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileForm({ name: user.name || "", birth: user.birth || "" });
        }
    }, [user]);

    useEffect(() => {
        if (tab === "baseline") {
            onboardingApi
                .getBaseline()
                .then((d) => setBaseline(d.data))
                .catch(() => {});
        }
    }, [tab]);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");
        try {
            await authApi.updateMe(profileForm);
            await refreshUser();
            setEditing(false);
            setMessage("Profile updated successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f8] relative overflow-hidden">
            {/* Soft Background Mesh */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-[#FDACAC]/30 to-transparent rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-bl from-[#FEEAC9]/40 to-transparent rounded-full blur-[80px] -z-10 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
                
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="group mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-5 py-2.5 text-sm font-bold text-slate-600 shadow-sm backdrop-blur-md ring-1 ring-slate-200/50 transition-all hover:bg-white hover:text-[#FD7979] hover:shadow-md hover:ring-[#FDACAC]/50"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </motion.button>

                {/* Hero Header Card */}
                <motion.div 
                    initial="hidden" animate="visible" variants={fadeUp}
                    className="relative bg-white rounded-[2.5rem] p-8 md:p-12 mb-8 border border-[#FEEAC9]/60 shadow-[0_20px_45px_-20px_rgba(253,121,121,0.15)] overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-[#FEEAC9]/30 to-transparent opacity-60 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative group">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="Avatar"
                                        className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="h-28 w-28 md:h-32 md:w-32 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FDACAC] to-[#FD7979] text-5xl font-bold text-white border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                                        {user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                                <div className="absolute -bottom-2 -right-2 bg-emerald-400 border-4 border-white p-2 rounded-full text-white">
                                    <Shield size={16} />
                                </div>
                            </div>
                            
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
                                    {user.name}
                                </h1>
                                <p className="text-lg text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                                    <Mail size={18} /> {user.email}
                                </p>
                            </div>
                        </div>

                        <button 
                            type="button" 
                            onClick={logout} 
                            className="group flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-red-100 text-red-500 font-bold hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 shadow-sm"
                        >
                            <span>Sign Out</span>
                            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Tab Navigation & Content Container */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    
                    {/* Tab Bar */}
                    <div className="flex p-2 bg-slate-50/50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
                        <button
                            onClick={() => setTab("profile")}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all text-sm sm:text-base whitespace-nowrap ${tab === "profile" ? "bg-white text-[#FD7979] shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}`}
                        >
                            <User size={20} /> Personal Profile
                        </button>
                        <button
                            onClick={() => setTab("baseline")}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all text-sm sm:text-base whitespace-nowrap ${tab === "baseline" ? "bg-white text-[#FD7979] shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"}`}
                        >
                            <Activity size={20} /> Baseline Health Record
                        </button>
                    </div>

                    <div className="p-6 md:p-10">
                        {/* Interactive Toast Message */}
                        <AnimatePresence>
                            {message && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                    className={`mb-8 p-4 rounded-xl flex items-center gap-3 font-semibold ${message.startsWith("Error") ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
                                >
                                    {message.startsWith("Error") ? <XCircle size={20} /> : <CheckCircle size={20} />}
                                    {message}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Profile Tab */}
                        {tab === "profile" && (
                            <div className="grid gap-8 lg:grid-cols-12">
                                {/* Main Form / Details Area */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-extrabold text-slate-800">Account Details</h3>
                                        {!editing && (
                                            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#FEEAC9]/50 hover:bg-[#FEEAC9] text-[#FD7979] font-bold rounded-xl transition-colors">
                                                <Edit3 size={16} /> Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-100">
                                        <AnimatePresence mode="wait">
                                            {editing ? (
                                                <motion.div 
                                                    key="edit-form"
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="space-y-5"
                                                >
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                                                        <input
                                                            type="text"
                                                            value={profileForm.name}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                                            className="w-full bg-white px-5 py-4 rounded-xl border border-slate-200 focus:border-[#FD7979] focus:ring-4 focus:ring-[#FD7979]/10 outline-none transition-all font-medium text-slate-800"
                                                            placeholder="Your true name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">Date of Birth</label>
                                                        <input
                                                            type="date"
                                                            value={profileForm.birth}
                                                            onChange={(e) => setProfileForm(p => ({ ...p, birth: e.target.value }))}
                                                            className="w-full bg-white px-5 py-4 rounded-xl border border-slate-200 focus:border-[#FD7979] focus:ring-4 focus:ring-[#FD7979]/10 outline-none transition-all font-medium text-slate-800"
                                                        />
                                                    </div>
                                                    
                                                    <div className="pt-4 flex gap-3">
                                                        <button onClick={() => setEditing(false)} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                                                            <X size={18} /> Cancel
                                                        </button>
                                                        <button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#FD7979] text-white font-bold rounded-xl shadow-lg shadow-[#FD7979]/30 hover:bg-[#FDACAC] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                                                            {saving ? "Saving..." : <><Save size={18} /> Save Changes</>}
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="view-details"
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8"
                                                >
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username</p>
                                                        <p className="text-lg font-bold text-slate-800">@{user.username || "unset"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date of Birth</p>
                                                        <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                            <Calendar size={18} className="text-[#FDACAC]" /> 
                                                            {user.birth ? new Date(user.birth).toLocaleDateString() : "Not designated"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Member Since</p>
                                                        <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                            <Clock size={18} className="text-[#FDACAC]" />
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Side Panel Status */}
                                <div className="lg:col-span-4">
                                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                                        
                                        <h4 className="text-sm font-black tracking-widest uppercase text-[#FDACAC] mb-6 flex items-center gap-2">
                                            <Shield size={16} /> Account Status
                                        </h4>
                                        
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <span className="text-slate-400 font-medium">Email Verification</span>
                                                {user.email_verified ? 
                                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">Verified</span> : 
                                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-lg border border-amber-500/20">Pending</span>
                                                }
                                            </div>
                                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                                <span className="text-slate-400 font-medium">Onboarding Mode</span>
                                                {user.onboarding_completed ? 
                                                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/20">Complete</span> : 
                                                    <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-bold rounded-lg border border-rose-500/20">Action Req</span>
                                                }
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-400 font-medium">Privilege Role</span>
                                                <span className="font-bold tracking-wider text-white capitalize">{user.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Baseline Tab */}
                        {tab === "baseline" && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-extrabold text-slate-800">Initial Health Assessment</h3>
                                    <p className="text-slate-500">Your psychological baseline captured during orientation.</p>
                                </div>

                                {baseline ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(baseline)
                                            .filter(([k]) => !["id", "user_id", "created_at", "updated_at"].includes(k))
                                            .map(([key, val], i) => (
                                                <motion.div 
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    key={key} 
                                                    className="bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#FDACAC] p-5 rounded-[1.5rem] transition-all group"
                                                >
                                                    <p className="text-xs font-black text-slate-400 group-hover:text-[#FD7979] uppercase tracking-wider mb-2 transition-colors">
                                                        {key.replace(/_/g, " ")}
                                                    </p>
                                                    <p className="text-base font-bold text-slate-800 capitalize">
                                                        {val || "—"}
                                                    </p>
                                                </motion.div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <Activity size={48} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-lg font-bold text-slate-700">No baseline data on record.</p>
                                        <p className="text-slate-500">Complete your onboarding assessment to establish a baseline.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
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
