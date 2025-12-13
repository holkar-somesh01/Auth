"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, Users, Settings } from "lucide-react";

export default function AdminSidebar() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
            });
            if (res.ok) {
                // Clear local storage if we set anything
                localStorage.removeItem('user_role');
                router.push('/login');
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    return (
        <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 hidden md:flex flex-col h-full">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
            </div>
            <nav className="mt-6 px-6 space-y-2 flex-1">
                <Link href="/admin/dashboard" className="flex items-center gap-3 py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-white/5 dark:hover:text-indigo-400">
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link href="/admin/users" className="flex items-center gap-3 py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-white/5 dark:hover:text-indigo-400">
                    <Users className="w-5 h-5" />
                    Users
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-3 py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-white/5 dark:hover:text-indigo-400">
                    <Settings className="w-5 h-5" />
                    Settings
                </Link>
            </nav>
            <div className="p-6 border-t border-gray-200 dark:border-zinc-800">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 py-2.5 px-4 rounded text-red-600 hover:bg-red-50 transition duration-200 dark:hover:bg-red-900/20"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
