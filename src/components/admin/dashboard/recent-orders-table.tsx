'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, Clock, User, IndianRupee } from 'lucide-react'

interface Order {
    id: string
    order_number: string | number
    created_at: string
    total: number
    payment_mode: string
    status: string
    addresses?: {
        name: string
    } | {
        name: string
    }[]
}

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
    const router = useRouter()

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Recent Orders</h3>
                <button
                    onClick={() => router.push('/admin/orders')}
                    className="text-xs font-bold text-green-600 hover:text-green-700 uppercase tracking-wider flex items-center gap-1"
                >
                    View All
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
            <div className="relative w-full overflow-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                        <tr>
                            <th className="px-6 py-3">Order ID</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                    No recent orders found.
                                </td>
                            </tr>
                        )}
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="hover:bg-green-50/30 transition-colors"
                            >
                                <td className="px-6 py-3">
                                    <span className="font-bold text-slate-700">#{order.order_number}</span>
                                    <div className="text-[10px] text-slate-400 font-medium">
                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-1.5 font-medium text-slate-900">
                                        <User className="w-3 h-3 text-slate-400" />
                                        {Array.isArray(order.addresses)
                                            ? order.addresses[0]?.name
                                            : order.addresses?.name || 'Unknown'}
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="font-bold text-slate-900">₹{order.total}</div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400">{order.payment_mode}</span>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button
                                        onClick={() => router.push('/admin/orders')}
                                        className="text-blue-600 hover:underline text-xs font-bold"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
