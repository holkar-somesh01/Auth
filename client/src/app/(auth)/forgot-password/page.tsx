'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { showToast, handleApiError } from '@/lib/toast-utils';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await api.post<{ message: string }>('/api/auth/forgot-password', { email });
            showToast.success(data.message || 'OTP sent to your email!');
            setStep(2);
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await api.post<{ message: string }>('/api/auth/reset-password', { email, otp, newPassword });
            showToast.success(data.message || 'Password reset successful!');
            router.push('/login');
        } catch (err: any) {
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    {step === 1 ? 'Forgot Password' : 'Reset Password'}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Or{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        back to login
                    </Link>
                </p>
            </div>

            <div className="mt-8">
                {step === 1 ? (
                    <form className="space-y-6" onSubmit={handleSendOtp}>
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Error and Success are now shown via Toasts */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                ) : (
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                <input
                                    type="email"
                                    disabled
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-gray-400"
                                    value={email}
                                />
                            </div>
                            <div>
                                <label htmlFor="otp" className="sr-only">OTP</label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="new-password" className="sr-only">New Password</label>
                                <input
                                    id="new-password"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white dark:placeholder-gray-400"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Error and Success are now shown via Toasts */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
