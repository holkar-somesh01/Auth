"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Building2, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 dark:bg-black/10 dark:border-white/10"
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Building2 className="w-6 h-6 text-indigo-500" />
                    <span>PropManage</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/#features" className="text-sm font-medium hover:text-indigo-500 transition-colors">Features</Link>
                    <Link href="/#about" className="text-sm font-medium hover:text-indigo-500 transition-colors">About</Link>
                    <Link href="/#properties" className="text-sm font-medium hover:text-indigo-500 transition-colors">Properties</Link>
                    <div className="flex items-center gap-4 ml-4">
                        <ModeToggle />
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30">
                            Login
                        </Link>
                    </div>
                </div>

                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="md:hidden bg-background border-b border-border"
                >
                    <div className="flex flex-col p-4 gap-4">
                        <Link href="#features" className="text-sm font-medium" onClick={() => setIsOpen(false)}>Features</Link>
                        <Link href="#about" className="text-sm font-medium" onClick={() => setIsOpen(false)}>About</Link>
                        <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md text-center" onClick={() => setIsOpen(false)}>Login</Link>
                    </div>
                </motion.div>
            )}
        </motion.nav>
    );
}
