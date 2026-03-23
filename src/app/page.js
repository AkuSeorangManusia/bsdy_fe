"use client";

import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { authApi, contentApi } from "@/lib/api";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Activity, Brain, MessageSquare, LineChart, Shield, Mail, ChevronRight, Calendar, Smartphone, Sparkles } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function HeroSection() {
    const { user } = useAuth();
    const router = useRouter();

    const handleGetStarted = async () => {
        if (user) {
            router.push("/dashboard");
            return;
        }
        try {
            const data = await authApi.getGoogleUrl();
            window.location.href = data.url;
        } catch (err) {
            console.error("Failed to get Google URL:", err);
        }
    };

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#FEEAC9]/30">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-[#FDACAC]/40 to-[#FD7979]/20 blur-[100px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-tl from-[#FD7979]/30 to-[#FEEAC9]/50 blur-[100px] -z-10" />

            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div 
                        className="flex-1 text-center lg:text-left"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDACAC]/20 text-[#FD7979] font-medium text-sm mb-6 border border-[#FDACAC]/30 shadow-sm">
                            <Sparkles size={16} />
                            <span>Your Mental Health Companion</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold text-slate-800 leading-[1.1] mb-6 tracking-tight">
                            Mental Health, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">
                                Blessedly
                            </span>{" "}
                            Cared For
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-lg lg:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Track your mood, chat with an empathetic AI companion, explore personalized insights, and build your bespoke coping toolkit — all within a safe, beautiful space.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <button
                                onClick={handleGetStarted}
                                className="group relative px-8 py-4 bg-[#FD7979] text-white font-semibold rounded-full overflow-hidden transition-all shadow-[0_8px_30px_rgb(253,121,121,0.3)] hover:shadow-[0_8px_30px_rgb(253,121,121,0.5)] active:scale-95 flex items-center gap-3"
                            >
                                <span className="relative z-10">{user ? "Go to Dashboard" : "Get Started Now"}</span>
                                <ChevronRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
                                <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-[#FDACAC]/20"></div>
                            </button>
                            {!user && (
                                <button className="px-8 py-4 text-slate-600 font-semibold rounded-full border-2 border-slate-200 hover:border-[#FDACAC] hover:text-[#FD7979] transition-colors">
                                    Learn More
                                </button>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="flex-1 w-full max-w-lg lg:max-w-none relative"
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="relative aspect-square md:aspect-auto md:h-[600px] w-full flex items-center justify-center">
                            <Image
                                src="/assets/blessedly.png"
                                alt="Blessedly Companion"
                                width={500}
                                height={500}
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                            
                            {/* Floating UI Elements */}
                            <motion.div 
                                className="absolute bottom-4 right-4 md:bottom-auto md:top-10 md:right-10 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white z-20"
                                animate={{ y: [-10, 10, -10] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            >
                                <div className="p-2 bg-[#FDACAC]/20 text-[#FD7979] rounded-full"><Heart size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Daily Mood</p>
                                    <p className="text-sm font-bold text-slate-700">Excellent 🌟</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                className="absolute bottom-24 left-4 md:bottom-20 md:left-10 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-white z-20"
                                animate={{ y: [10, -10, 10] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="p-2 bg-[#FEEAC9] text-[#FD7979] rounded-full"><Brain size={20} /></div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium">Insights</p>
                                    <p className="text-sm font-bold text-slate-700">Mind is clear</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function AboutSection() {
    const features = [
        { title: "Mood Tracking", desc: "Log your daily mood, energy, and sleep. See profound patterns emerge over time.", icon: Activity },
        { title: "AI Companion", desc: "Chat with an empathetic AI that genuinely understands your mental health journey.", icon: MessageSquare },
        { title: "Smart Analytics", desc: "AI-generated insights and comprehensive trend analysis based on your personal data.", icon: LineChart },
        { title: "Coping Toolkit", desc: "Build your personal, easily accessible collection of customized coping strategies.", icon: Heart },
        { title: "Health Reports", desc: "Receive detailed weekly and monthly mental health reports delivered directly to you.", icon: Calendar },
        { title: "Privacy First", desc: "Your data is strictly yours. Encrypted at rest with military-grade AES-256 encryption.", icon: Shield },
    ];

    return (
        <section id="about" className="py-24 bg-white relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.h4 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[#FD7979] font-bold tracking-wider uppercase text-sm mb-3"
                    >
                        Features & Benefits
                    </motion.h4>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6"
                    >
                        Why choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">Blessedly?</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600"
                    >
                        Experience a new standard of mental health care. Our meticulously crafted tools empower you to understand, track, and improve your emotional well-being safely.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="group p-8 rounded-3xl bg-[#FEEAC9]/10 border border-[#FEEAC9]/50 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FDACAC] to-[#FD7979] text-white flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Icon size={28} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-[#FD7979] transition-colors">{f.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ContentSection() {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        contentApi
            .list(6, 0)
            .then((data) => setArticles(data.data || []))
            .catch(() => {});
    }, []);

    return (
        <section id="content" className="py-24 bg-gradient-to-b from-[#FEEAC9]/30 to-white relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <motion.h4 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-[#FD7979] font-bold tracking-wider uppercase text-sm mb-3"
                        >
                            Knowledge Base
                        </motion.h4>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-extrabold text-slate-800"
                        >
                            Latest <span className="text-[#FDACAC]">Resources</span>
                        </motion.h2>
                    </div>
                    <motion.button 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 text-[#FD7979] font-bold hover:gap-4 transition-all"
                    >
                        View All Articles <ChevronRight size={20} />
                    </motion.button>
                </div>

                {articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, i) => (
                            <motion.a
                                key={article.id}
                                href={`/blog/${article.slug}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
                            >
                                <div className="relative h-56 overflow-hidden bg-slate-100">
                                    {article.cover_image_url ? (
                                        <img
                                            src={article.cover_image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Brain size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-[#FD7979] text-xs font-bold rounded-full uppercase tracking-wider">
                                        Article
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-[#FD7979] transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-slate-600 mb-6 flex-1 line-clamp-3">
                                        {article.excerpt || "Discover expert insights and actionable strategies for your profound mental wellness journey."}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                                        {article.published_at && (
                                            <span className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                                <Calendar size={16} />
                                                {new Date(article.published_at).toLocaleDateString("en-US", {
                                                    month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </span>
                                        )}
                                        <span className="text-[#FDACAC] group-hover:text-[#FD7979] transition-colors">
                                            <ChevronRight size={20} />
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="w-20 h-20 bg-[#FEEAC9]/50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#FD7979]">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Articles Published</h3>
                        <p className="text-slate-500">Stay tuned. Our comprehensive mental health curriculum is launching soon!</p>
                    </div>
                )}
            </div>
        </section>
    );
}

function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="bg-[#FD7979] rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden text-white shadow-2xl">
                    <div className="absolute top-0 right-[-10%] w-[40rem] h-[40rem] bg-gradient-to-bl from-[#FDACAC] to-transparent rounded-full opacity-50 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[30rem] h-[30rem] bg-gradient-to-tr from-[#FEEAC9]/30 to-transparent rounded-full opacity-30 blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                                Ready to transform<br/>your mindset?
                            </h2>
                            <p className="text-lg text-white/90 mb-10 max-w-md">
                                Have questions, feedback, or need premium support? Our empathetic team is profoundly dedicated to your success and well-being.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/70">Drop us an email</p>
                                        <p className="text-lg font-bold">slaviors@gmail.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur">
                                        <Heart size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/70">Powered By</p>
                                        <p className="text-lg font-bold">TECHSOFT 2026</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[2rem] p-8 shadow-xl text-slate-800"
                        >
                            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <input type="text" placeholder="Your Name" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FD7979] focus:ring-2 focus:ring-[#FD7979]/20 transition-all" />
                                <input type="email" placeholder="Email Address" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FD7979] focus:ring-2 focus:ring-[#FD7979]/20 transition-all" />
                                <textarea placeholder="How can we help?" rows="4" className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#FD7979] focus:ring-2 focus:ring-[#FD7979]/20 transition-all resize-none"></textarea>
                                <button className="w-full py-4 bg-[#FDACAC] hover:bg-[#FD7979] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#FDACAC]/30">
                                    Send Message
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 md:py-16 border-t border-slate-800">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8 mb-8 md:mb-10">
                    <motion.div 
                        className="flex items-center gap-3 group" 
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Image
                            src="/assets/peach-transparent.png"
                            alt="Blessedly Logo"
                            width={44}
                            height={44}
                            className="object-contain group-hover:drop-shadow-lg transition-all"
                        />
                        <span className="text-xl md:text-2xl font-extrabold text-white group-hover:text-[#FDACAC] transition-colors">Blessedly</span>
                    </motion.div>
                    
                    <div className="flex gap-4 md:gap-8 text-xs md:text-sm font-medium flex-wrap justify-start md:justify-end">
                        <a href="#about" className="hover:text-[#FDACAC] transition-colors duration-200 py-2 px-2 md:px-0">About</a>
                        <a href="#content" className="hover:text-[#FDACAC] transition-colors duration-200 py-2 px-2 md:px-0">Articles</a>
                        <a href="#contact" className="hover:text-[#FDACAC] transition-colors duration-200 py-2 px-2 md:px-0">Contact</a>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 text-xs md:text-sm">
                    <p className="flex items-center gap-2 text-slate-400 text-center md:text-left">
                        © {new Date().getFullYear()} Blessedly.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default function HomePage() {
    return (
        <main className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">
            <HeroSection />
            <AboutSection />
            <ContentSection />
            <ContactSection />
            <Footer />
        </main>
    );
}
