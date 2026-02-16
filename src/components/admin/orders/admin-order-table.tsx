'use client'

import { useState } from 'react'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { OrderDetailsDrawer } from '@/components/admin/orders/order-details-drawer'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, User, IndianRupee, Clock, Phone } from 'lucide-react'

interface Order {
    id: string
    order_number: string | number
    created_at: string
    total: number
    payment_mode: string
    delivery_slot: string
    status: string
    addresses?: {
        name: string
        phone: string
    }
    order_payments?: Array<{ paid: boolean }>
}

interface AdminOrdersTableProps {
    orders: Order[]
    count: number
    page: number
}

export function AdminOrdersTable({ orders, count, page }: AdminOrdersTableProps) {
    const [selectedOrder, setSelectedOrder] = useState<any>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', newPage.toString())
        router.push(`/admin/orders?${params.toString()}`)
    }

    const totalPages = Math.ceil(count / 20)

    const getSlotBadge = (slot: string) => {
        if (slot === 'morning') return <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-tight"><Clock className="w-3 h-3" /> Morning</span>
        if (slot === 'evening') return <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-tight"><Clock className="w-3 h-3" /> Evening</span>
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-tight">{slot}</span>
    }

    return (
        <>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Order Details</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Amount & Payment</th>
                                <th className="px-6 py-4 text-center">Delivery Slot</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                                <IndianRupee className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <p className="font-medium">No orders found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {orders.map((order, idx) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-blue-50/30 cursor-pointer transition-all duration-200 group relative"
                                    onClick={() => setSelectedOrder(order)}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs border border-slate-200">
                                                #{order.order_number.toString().slice(-3)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 tracking-tight">#{order.order_number}</div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-0.5">
                                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                                <User className="w-3 h-3 text-slate-400" />
                                                {order.addresses?.name}
                                            </div>
                                            <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 ml-0.5">
                                                <Phone className="w-3 h-3 text-slate-400" />
                                                {order.addresses?.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-extrabold text-slate-900 text-base">₹{order.total}</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">{order.payment_mode}</span>
                                                {order.order_payments?.[0]?.paid ? (
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">
                                                        <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse"></div>
                                                        PAID
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-[9px] font-bold text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded-full border border-yellow-100">
                                                        <div className="h-1 w-1 rounded-full bg-yellow-500"></div>
                                                        PENDING
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {getSlotBadge(order.delivery_slot)}
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <div className="scale-90 origin-left">
                                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedOrder(order)
                                            }}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-[10px] uppercase tracking-wider bg-white border border-blue-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-95"
                                        >
                                            View Details
                                            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-slate-900">{(page - 1) * 20 + 1}</span> to <span className="text-slate-900">{Math.min(page * 20, count)}</span> of <span className="text-slate-900">{count}</span> orders
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm active:scale-95"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm active:scale-95"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <OrderDetailsDrawer
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder || {}}
            />
        </>
    )
}
