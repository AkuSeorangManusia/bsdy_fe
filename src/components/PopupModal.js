"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, X } from "lucide-react";

export default function PopupModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = "confirm", // "confirm" | "alert"
    confirmText = "Yes, Delete",
    cancelText = "Cancel"
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-center sm:text-left">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white p-6 sm:p-8 overflow-hidden z-10"
                    >
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-[#FEEAC9] to-transparent rounded-full blur-[80px] opacity-60 -z-10 translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${type === 'alert' ? 'bg-red-100 text-red-500' : 'bg-[#FEEAC9]/50 text-[#FD7979]'}`}>
                                {type === "alert" ? <AlertCircle size={24} /> : <AlertTriangle size={24} />}
                            </div>
                            
                            <div className="flex-1 mt-2 sm:mt-0">
                                <h3 className="text-xl font-extrabold text-slate-800 mb-2">{title}</h3>
                                <p className="text-sm text-slate-500">{message}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            {type === "confirm" && (
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 w-full sm:w-auto ${
                                    type === 'alert' 
                                        ? 'bg-red-500 hover:bg-red-600 hover:shadow-red-500/20' 
                                        : 'bg-gradient-to-r from-[#FD7979] to-[#FDACAC] hover:shadow-[#FD7979]/20'
                                }`}
                            >
                                {type === "alert" ? "OK" : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}