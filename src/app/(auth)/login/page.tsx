'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { login, signup, sendOTP, verifyOTP } from './actions'
import { Loader2, ArrowRight, ArrowLeft, Mail, Phone } from 'lucide-react'

function LoginForm() {
    const searchParams = useSearchParams()
    const errorParam = searchParams.get('error')

    const [mode, setMode] = useState<'email' | 'phone'>('phone') // Default to phone
    const [otpSent, setOtpSent] = useState(false)
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSendOTP(formData: FormData) {
        setLoading(true)
        setMessage('')
        const res = await sendOTP(formData)
        setLoading(false)
        if (res?.error) {
            setMessage(res.error)
        } else if (res?.success && res.phone) {
            setPhone(res.phone)
            setOtpSent(true)
        }
    }

    async function handleVerifyOTP(formData: FormData) {
        setLoading(true)
        setMessage('')
        const token = formData.get('token') as string
        const res = await verifyOTP(phone, token)
        setLoading(false)
        if (res?.error) {
            setMessage(res.error)
        }
        // Redirect happens on server if successful
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-8 border border-slate-100 transition-all duration-300">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">
                        {otpSent ? 'Enter Code' : 'Welcome Back'}
                    </h2>
                    {!otpSent && (
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button
                                onClick={() => setMode('phone')}
                                className={`p-2 rounded-md transition-all ${mode === 'phone' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Phone Login"
                            >
                                <Phone className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setMode('email')}
                                className={`p-2 rounded-md transition-all ${mode === 'email' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                                title="Email Login"
                            >
                                <Mail className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
                <p className="text-slate-500 text-sm">
                    {otpSent
                        ? `We sent a code to ${phone}`
                        : mode === 'phone'
                            ? 'Enter your phone number to sign in.'
                            : 'Please enter your details to sign in.'
                    }
                </p>
                {otpSent && (
                    <button
                        onClick={() => { setOtpSent(false); setMessage('') }}
                        className="text-xs text-blue-600 font-bold hover:underline mt-1 flex items-center gap-1"
                    >
                        <ArrowLeft className="w-3 h-3" /> Change number
                    </button>
                )}
            </div>

            {(errorParam || message) && (
                <div className="mb-6 rounded-lg bg-red-50 p-3 border border-red-100 animate-in fade-in slide-in-from-top-1">
                    <p className="text-sm font-medium text-red-600">
                        {message || (errorParam === 'Could not authenticate user' ? 'Invalid credentials' : errorParam)}
                    </p>
                </div>
            )}

            {mode === 'email' ? (
                <form className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="name@example.com"
                            className="h-11 rounded-xl border border-slate-200 px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
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
                    </div>
                </form>
            ) : (
                <form action={otpSent ? handleVerifyOTP : handleSendOTP} className="flex flex-col gap-5">
                    {!otpSent ? (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">+91</span>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="9876543210"
                                    className="h-11 w-full rounded-xl border border-slate-200 pl-12 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 font-medium tracking-wide"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <label htmlFor="token" className="text-sm font-semibold text-slate-700">OTP Code</label>
                            <input
                                id="token"
                                name="token"
                                type="text"
                                required
                                autoFocus
                                placeholder="123456"
                                maxLength={6}
                                className="h-11 rounded-xl border border-slate-200 px-4 text-center text-lg font-bold tracking-[0.5em] transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 placeholder:tracking-normal"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-11 flex items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/10 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                otpSent ? 'Verify & Login' : 'Send Code'
                            )}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            )}
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
                        <div className="h-12 bg-slate-50 rounded mb-4"></div>
                        <div className="h-12 bg-slate-200 rounded mt-4"></div>
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
