import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-black/95">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-xl shadow-lg dark:bg-zinc-900 border dark:border-zinc-800">
                {children}
            </div>
        </div>
    );
}
