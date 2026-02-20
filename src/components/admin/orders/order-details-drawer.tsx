'use client'

import { useState, useEffect } from 'react'
import { OrderStatusSelect } from '@/components/admin/order-status-select'
import { X, User, MapPin, Phone, CreditCard, ShoppingBag, Receipt, Printer, MessageCircle, PhoneCall, Calendar, Clock } from 'lucide-react'

interface OrderItem {
    id: string
    product_name: string
    product_image?: string
    price: number
    quantity: number
}

interface Order {
    id: string
    order_number: string | number
    created_at: string
    status: string
    payment_mode: string
    subtotal: number
    delivery_fee: number
    total: number
    base_price_amount?: number
    seller_price_amount?: number
    commission_amount?: number
    tech_fee_amount?: number
    addresses?: {
        name: string
        phone: string
        house_no: string
        area: string
        pincode: string
        landmark?: string
    }
    order_payments?: Array<{ paid: boolean }>
    order_items?: OrderItem[]
}

interface OrderDetailsDrawerProps {
    isOpen: boolean
    onClose: () => void
    order: Order
}

export function OrderDetailsDrawer({ isOpen, onClose, order }: OrderDetailsDrawerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsVisible(true), 10)
            document.body.style.overflow = 'hidden'
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 400)
            document.body.style.overflow = 'unset'
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    if (!isVisible && !isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-[500px] bg-[#F8FAFC] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col h-full border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header Section */}
                <div className="bg-white px-6 py-5 border-b border-slate-100 flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                                ID
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                                    ORDER #{order.order_number}
                                </h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {new Date(order.created_at).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' })}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3 mt-6">
                        <a
                            href={`https://wa.me/91${order.addresses?.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-all font-bold text-xs tracking-wide shadow-sm hover:shadow-md active:scale-95"
                        >
                            <MessageCircle className="w-4 h-4 fill-white" />
                            WHATSAPP
                        </a>
                        <a
                            href={`tel:${order.addresses?.phone}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all font-bold text-xs tracking-wide shadow-sm hover:shadow-md active:scale-95"
                        >
                            <PhoneCall className="w-4 h-4 fill-white" />
                            DIRECT CALL
                        </a>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">

                    {/* Status & Payment Block */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                Track Status
                            </p>
                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                        </div>

                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <CreditCard className="w-3 h-3" />
                                Payment Mode
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-800 text-sm uppercase">{order.payment_mode}</span>
                                {order.order_payments?.[0]?.paid ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">PAID</span>
                                ) : (
                                    <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">PENDING</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Profile */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <User className="w-4 h-4 text-blue-500" />
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Customer Info</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Name</p>
                                    <p className="font-bold text-slate-800 text-sm">{order.addresses?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Phone</p>
                                    <p className="font-bold text-slate-800 text-sm">{order.addresses?.phone}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-50 flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Delivery Address</p>
                                    <p className="text-sm font-medium text-slate-700 leading-snug">
                                        {order.addresses?.house_no}, {order.addresses?.area} <br />
                                        <span className="text-slate-500 text-xs">Pincode: </span>
                                        <span className="font-bold text-slate-700">{order.addresses?.pincode}</span>
                                    </p>
                                    {order.addresses?.landmark && (
                                        <p className="mt-1.5 text-xs text-slate-500 font-medium bg-slate-50 inline-block px-2 py-1 rounded border border-slate-100">
                                            Landmark: {order.addresses?.landmark}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Analysis Divider */}
                    <div className="flex items-center gap-3 pt-2">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-2 bg-[#F8FAFC]">
                            <ShoppingBag className="w-3.5 h-3.5 text-purple-400" /> Cart Analysis ({order.order_items?.length})
                        </span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-xs">
                            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Item Snapshot</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Unit</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {order.order_items?.map((item: OrderItem) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-100 bg-white flex-shrink-0">
                                                    {item.product_image ? (
                                                        <img src={item.product_image} alt={item.product_name || 'Product'} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-[8px] font-bold text-slate-300">NO IMG</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 line-clamp-2">{item.product_name}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">Per Unit: ₹{item.price}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-slate-700">x{item.quantity}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-500">₹{item.price}</td>
                                        <td className="px-4 py-3 text-right font-black text-slate-900">₹{item.price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Bill Divider */}
                    <div className="flex items-center gap-3 pt-4">
                        <div className="flex-1 h-px bg-slate-200"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 px-2 bg-[#F8FAFC]">
                            <Receipt className="w-3.5 h-3.5 text-amber-500" /> Bill Breakdown
                        </span>
                        <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    {/* Dark Bill Card */}
                    <div className="bg-[#0f172a] rounded-[24px] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                        <div className="relative z-10 space-y-3">
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="text-xs font-bold tracking-wider uppercase">Subtotal</span>
                                <span className="font-semibold">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="text-xs font-bold tracking-wider uppercase">Service Fee</span>
                                <span className="font-semibold">₹{order.delivery_fee}</span>
                            </div>

                            <div className="h-px bg-white/10 my-4"></div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-blue-400 uppercase tracking-widest">Grand Total</span>
                                <span className="text-3xl font-black tabular-nums tracking-tight">₹{order.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Financials */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Internal Financials</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">Base Price</span>
                                <span className="font-bold text-slate-800 text-sm">₹{order.base_price_amount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">Seller Pay</span>
                                <span className="font-bold text-slate-800 text-sm">₹{order.seller_price_amount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">Commission</span>
                                <span className="font-bold text-green-600 text-sm">₹{order.commission_amount || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">Tech Fee</span>
                                <span className="font-bold text-blue-600 text-sm">₹{order.tech_fee_amount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)] flex justify-between gap-3 z-20">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 border border-slate-200 rounded-full hover:bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 transition-all active:scale-95"
                    >
                        Back to List
                    </button>
                    <button className="flex-[1.5] py-3.5 bg-[#0f172a] text-white rounded-full hover:bg-slate-800 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95">
                        <Printer className="w-4 h-4" />
                        Generate Invoice
                    </button>
                </div>
            </div>
        </div>
    )
}
