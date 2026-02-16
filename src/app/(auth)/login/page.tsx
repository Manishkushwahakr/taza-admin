'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { login, signup } from './actions'

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                <p className="text-slate-500 text-sm">Please enter your details to sign in.</p>
            </div>

            {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-100">
                    <p className="text-sm font-medium text-red-600">
                        {error === 'Could not authenticate user' ? 'Invalid email or password' : error}
                    </p>
                </div>
            )}

            <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@example.com"
                        className="h-11 rounded-xl border border-slate-200 px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-11 rounded-xl border border-slate-200 px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                    />
                </div>

                <div className="flex flex-col gap-3 mt-4">
                    <button
                        formAction={login}
                        className="h-11 rounded-xl bg-slate-900 font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                    <button
                        formAction={signup}
                        className="h-11 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
                    >
                        Create Account
                    </button>
                </div>
            </form>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc] px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center" id="login-header">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">TAZA TAZA</h1>
                    <p className="text-slate-500 font-medium">Marketplace Admin & Seller Dashboard</p>
                </div>

                <Suspense fallback={
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 animate-pulse">
                        <div className="h-8 bg-slate-100 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-slate-100 rounded w-3/4 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-12 bg-slate-50 rounded"></div>
                            <div className="h-12 bg-slate-50 rounded"></div>
                            <div className="h-12 bg-slate-200 rounded mt-4"></div>
                        </div>
                    </div>
                }>
                    <LoginForm />
                </Suspense>

                <p className="mt-8 text-center text-sm text-slate-500">
                    Secure management for TAZA TAZA platform
                </p>
            </div>
        </div>
    )
}
