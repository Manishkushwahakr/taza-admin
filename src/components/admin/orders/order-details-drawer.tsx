'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

interface OrderDetailsDrawerProps {
    isOpen: boolean
    onClose: () => void
    order: any
}

export function OrderDetailsDrawer({ isOpen, onClose, order }: OrderDetailsDrawerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
            document.body.style.overflow = 'hidden'
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            document.body.style.overflow = 'unset'
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible && !isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 transform flex flex-col h-full ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Order #{order.order_number}</h2>
                        <p className="text-xs text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Status & Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Status</p>
                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Payment</p>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{order.payment_mode}</span>
                                {order.order_payments?.[0]?.paid ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">PAID</span>
                                ) : (
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">PENDING</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            Customer Details
                        </h3>
                        <div className="bg-white border rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Name</span>
                                <span className="font-medium">{order.addresses?.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone</span>
                                <a href={`tel:${order.addresses?.phone}`} className="font-medium text-blue-600 hover:underline">{order.addresses?.phone}</a>
                            </div>
                            <div className="mt-2 pt-2 border-t">
                                <p className="text-gray-900">{order.addresses?.house_no}, {order.addresses?.area} - {order.addresses?.pincode}</p>
                                {order.addresses?.landmark && <p className="text-gray-500 text-xs mt-1">Near {order.addresses?.landmark}</p>}
                            </div>
                            <div className="flex gap-2 mt-3 pt-2 border-t">
                                <a
                                    href={`https://wa.me/91${order.addresses?.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors font-medium border border-green-200"
                                >
                                    WhatsApp
                                </a>
                                <a
                                    href={`tel:${order.addresses?.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                                >
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            Cart Items ({order.order_items?.length})
                        </h3>
                        <div className="border rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3 text-right">Qty</th>
                                        <th className="px-4 py-3 text-right">Price</th>
                                        <th className="px-4 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {order.order_items?.map((item: any) => (
                                        <tr key={item.id} className="bg-white">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {item.product_image ? (
                                                        <img src={item.product_image} alt="" className="h-10 w-10 rounded-md object-cover border" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-md bg-gray-100 border flex items-center justify-center text-xs text-gray-400">IMG</div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.product_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-right text-gray-600">x{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">₹{item.price}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-900">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bill Summary */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3">Bill Details</h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm border">
                            <div className="flex justify-between text-gray-600">
                                <span>Item Total</span>
                                <span>₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>₹{order.delivery_fee}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                                <span>Grand Total</span>
                                <span>₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-white flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm font-medium"
                    >
                        Close
                    </button>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Invoice
                    </button>
                </div>
            </div>
        </div>
    )
}
