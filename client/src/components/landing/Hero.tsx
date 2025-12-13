"use client";

import { motion } from "framer-motion";
import ThreeBuilding from "./ThreeBuilding";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-background via-slate-50 to-indigo-50 dark:via-slate-950 dark:to-indigo-950">
            <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-800/20 -z-10" />

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-indigo-500 uppercase bg-indigo-100 rounded-full dark:bg-indigo-900/30">
                        Next Gen Property Management
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Manage Properties <br />
                        <span className="text-indigo-600 dark:text-indigo-400">With Ease.</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg leading-relaxed">
                        Experience the future of real estate management. Streamline operations, enhance tenant satisfaction, and maximize revenue with our intelligent platform.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/register" className="group inline-flex items-center px-8 py-4 text-white bg-indigo-600 rounded-full font-semibold transition-all hover:bg-indigo-700 hover:scale-105 shadow-lg shadow-indigo-500/30">
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#demo" className="inline-flex items-center px-8 py-4 text-gray-700 bg-white border border-gray-200 rounded-full font-semibold transition-all hover:bg-gray-50 hover:border-gray-300 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10">
                            View Demo
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-8 text-sm text-gray-500 font-medium">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gray-300 dark:border-gray-900 z-${10 - i}`} />
                            ))}
                        </div>
                        <p>Trusted by 1000+ Property Managers</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="relative h-full min-h-[500px]"
                >
                    <ThreeBuilding />

                    {/* Ambient Blobs */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10" />
                </motion.div>
            </div>
        </section>
    );
}
