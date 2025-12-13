"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BarChart3, Users, Zap, Search, Globe } from "lucide-react";

const features = [
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Secure Authentication",
        description: "Enterprise-grade security with role-based access control and encrypted data protection."
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Real-time Analytics",
        description: "Visualize your property performance with interactive dashboards and real-time reports."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Tenant Management",
        description: "Streamline tenant onboarding, lease tracking, and communication in one unified hub."
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Automated Workflows",
        description: "Save time by automating rent collection, maintenance requests, and notifications."
    },
    {
        icon: <Search className="w-6 h-6" />,
        title: "Smart Search",
        description: "Find properties, tenants, and contracts instantly with our AI-powered search engine."
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: "Global Reach",
        description: "Manage properties across multiple locations and currencies with ease."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-white dark:bg-black/20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-4"
                    >
                        Capabilities that Empowers.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Everything you need to manage your real estate portfolio effectively, all in one place.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/10 transition-all dark:bg-white/5 dark:border-white/10"
                        >
                            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-6 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
