"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { contentApi } from "@/lib/api";
import { Brain, Calendar, ChevronRight, Smartphone } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
    const [articles, setArticles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        contentApi
            .list(50, 0)
            .then((data) => {
                setArticles(data.data || []);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 py-24 pb-32 pt-32 lg:pt-40">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h4 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[#FD7979] font-bold tracking-wider uppercase text-sm mb-3"
                    >
                        Knowledge Base
                    </motion.h4>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-6"
                    >
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FD7979] to-[#FDACAC]">Articles</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600"
                    >
                        Discover expert insights, actionable strategies, and meaningful stories for your profound mental wellness journey.
                    </motion.p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FD7979]"></div>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, i) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={`/blog/${article.slug}`}
                                    className="flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 group"
                                >
                                    <div className="relative h-56 overflow-hidden bg-slate-100 shrink-0">
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
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-3xl mx-auto">
                        <div className="w-20 h-20 bg-[#FEEAC9]/50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#FD7979]">
                            <Smartphone size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">No Articles Published</h3>
                        <p className="text-slate-500">Stay tuned. Our comprehensive mental health curriculum is launching soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
