'use client'

import { useState, useEffect } from 'react'
import { getUserDetails } from '@/app/actions'
import { X, User, Phone, MapPin, Package, Calendar, Loader2 } from 'lucide-react'

interface UserDetailDrawerProps {
    userId: string | null
    onClose: () => void
}

export function UserDetailDrawer({ userId, onClose }: UserDetailDrawerProps) {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (userId) {
            setLoading(true)
            getUserDetails(userId)
                .then((res) => setData(res))
                .finally(() => setLoading(false))
        } else {
            setData(null)
        }
    }, [userId])

    if (!userId) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${userId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-lg transform border-l border-slate-100 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${userId ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-50 p-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">User Account Details</h2>
                            <p className="text-sm text-slate-500">ID: {userId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {loading ? (
                            <div className="flex h-full flex-col items-center justify-center gap-3">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                                <p className="text-sm font-bold text-slate-500">Loading profile data...</p>
                            </div>
                        ) : data ? (
                            <div className="space-y-8">
                                {/* Profile Info */}
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <User className="h-3.5 w-3.5" /> Basic Information
                                    </h3>
                                    <div className="grid gap-4 rounded-2xl bg-slate-50 p-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
                                            <span className="font-bold text-slate-900">{data.profile?.name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
                                            <span className="flex items-center gap-2 font-bold text-slate-700">
                                                <Phone className="h-3.5 w-3.5 text-blue-500" />
                                                {data.profile?.phone || 'Not provided'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Account Created</span>
                                            <span className="flex items-center gap-2 font-bold text-slate-700">
                                                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                                {new Date(data.profile?.created_at).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                {/* Addresses */}
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <MapPin className="h-3.5 w-3.5" /> Delivery Addresses
                                    </h3>
                                    <div className="space-y-3">
                                        {data.addresses?.length > 0 ? (
                                            data.addresses.map((addr: any) => (
                                                <div key={addr.id} className="rounded-2xl border border-slate-100 p-4 transition-all hover:border-blue-200">
                                                    <div className="flex items-start justify-between">
                                                        <div className="space-y-1">
                                                            <div className="font-bold text-slate-900">{addr.name || data.profile?.name}</div>
                                                            <div className="text-sm text-slate-600 leading-snug">
                                                                {addr.house_no}, {addr.landmark && `${addr.landmark}, `}{addr.area}
                                                            </div>
                                                            <div className="text-xs font-bold text-slate-400">PIN: {addr.pincode}</div>
                                                        </div>
                                                        {addr.is_default && (
                                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 uppercase">Default</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                                                No addresses found
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Recent Orders */}
                                <section>
                                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <Package className="h-3.5 w-3.5" /> Recent Orders (Max 5)
                                    </h3>
                                    <div className="space-y-3">
                                        {data.orders?.length > 0 ? (
                                            data.orders.map((order: any) => (
                                                <div key={order.id} className="rounded-2xl border border-slate-100 p-4 transition-all hover:bg-slate-50">
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="font-bold text-slate-900">#{order.order_number}</span>
                                                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                                                                    'bg-blue-50 text-blue-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="font-bold text-slate-500 italic">
                                                            {order.order_items?.length} items
                                                        </span>
                                                        <span className="font-bold text-slate-900 text-sm">₹{order.total}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                                                No purchase history found
                                            </div>
                                        )}
                                    </div>
                                </section>
                            </div>
                        ) : null}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-50 p-6 bg-slate-50/50">
                        <button
                            className="w-full h-12 rounded-xl bg-slate-900 font-bold text-white transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10"
                            onClick={onClose}
                        >
                            Close Account View
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
