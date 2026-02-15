'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { OrderDetailsDrawer } from '@/components/admin/orders/order-details-drawer'
import { useRouter, useSearchParams } from 'next/navigation'

interface AdminOrdersTableProps {
    orders: any[]
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
        if (slot === 'morning') return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">Morning</span>
        if (slot === 'evening') return <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full font-medium">Evening</span>
        return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-medium">{slot}</span>
    }

    return (
        <>
            <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Slot</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            )}
                            {orders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">#{order.order_number}</div>
                                        <div className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.addresses?.name}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{order.addresses?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">₹{order.total}</div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-gray-500 uppercase">{order.payment_mode}</span>
                                            {order.order_payments?.[0]?.paid ? (
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" title="Paid"></div>
                                            ) : (
                                                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" title="Pending"></div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getSlotBadge(order.delivery_slot)}
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedOrder(order)
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1.5 rounded-md hover:bg-blue-50"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
                    <div className="text-xs text-gray-500">
                        Showing <span className="font-medium">{(page - 1) * 20 + 1}</span> to <span className="font-medium">{Math.min(page * 20, count)}</span> of <span className="font-medium">{count}</span> results
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}
                            className="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => handlePageChange(page + 1)}
                            className="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
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
