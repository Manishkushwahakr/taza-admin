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
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`relative w-full max-w-xl bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col h-full border-l border-slate-200 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center text-white font-black text-xs rotate-3">
                            ID
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Order #{order.order_number}</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-slate-200/50 rounded-xl transition-all active:scale-90 border border-transparent hover:border-slate-200 group">
                        <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Status & Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                                Track Status
                            </p>
                            <div className="scale-105 origin-left">
                                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                            </div>
                        </div>
                        <div className="p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <CreditCard className="w-3 h-3" />
                                Payment Mode
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-slate-900 text-sm italic">{order.payment_mode}</span>
                                {order.order_payments?.[0]?.paid ? (
                                    <span className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm shadow-green-200">PAID</span>
                                ) : (
                                    <span className="bg-yellow-500 text-white px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase shadow-sm shadow-yellow-200">PENDING</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Details */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            <span className="h-px bg-slate-200 flex-1"></span>
                            <span className="flex items-center gap-2 pr-3">
                                <User className="w-4 h-4 text-blue-500" />
                                Customer Insight
                            </span>
                        </h3>
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                                    <p className="font-black text-slate-900 text-lg">{order.addresses?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                    <p className="font-black text-blue-600 text-lg tabular-nums">{order.addresses?.phone}</p>
                                </div>
                            </div>

                            <div className="relative z-10 pt-4 border-t border-slate-100 flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Delivery Address</p>
                                    <p className="text-slate-700 font-semibold leading-relaxed">
                                        {order.addresses?.house_no}, {order.addresses?.area} <br />
                                        <span className="text-slate-400">Pincode:</span> <span className="font-bold">{order.addresses?.pincode}</span>
                                    </p>
                                    {order.addresses?.landmark && (
                                        <p className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-100 mt-2">
                                            Landmark: {order.addresses?.landmark}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 flex gap-3 mt-4 pt-4 border-t border-slate-100">
                                <a
                                    href={`https://wa.me/91${order.addresses?.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-2xl hover:brightness-110 transition-all font-black text-xs uppercase tracking-wider shadow-lg shadow-green-100 active:scale-95"
                                >
                                    <MessageCircle className="w-4 h-4 fill-white" />
                                    WhatsApp
                                </a>
                                <a
                                    href={`tel:${order.addresses?.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-2xl hover:brightness-110 transition-all font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-100 active:scale-95"
                                >
                                    <PhoneCall className="w-4 h-4 fill-white" />
                                    Direct Call
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            <span className="h-px bg-slate-200 flex-1"></span>
                            <span className="flex items-center gap-2 pr-3">
                                <ShoppingBag className="w-4 h-4 text-purple-500" />
                                Cart Analysis ({order.order_items?.length})
                            </span>
                        </h3>
                        <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50/80 border-b border-slate-100">
                                    <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-5 py-4">Item Snapshot</th>
                                        <th className="px-5 py-4 text-right">Qty</th>
                                        <th className="px-5 py-3 text-right">Unit</th>
                                        <th className="px-5 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {order.order_items?.map((item: OrderItem) => (
                                        <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform bg-slate-50">
                                                        {item.product_image ? (
                                                            <img src={item.product_image} alt={item.product_name || 'Product'} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">NO IMG</div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.product_name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Per Unit: ₹{item.price}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-right font-black text-slate-700 tabular-nums">x{item.quantity}</td>
                                            <td className="px-5 py-4 text-right font-medium text-slate-500 tabular-nums">₹{item.price}</td>
                                            <td className="px-5 py-4 text-right font-black text-slate-900 tabular-nums">₹{item.price * item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 pb-4">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                            <span className="h-px bg-slate-200 flex-1"></span>
                            <span className="flex items-center gap-2 pr-3">
                                <Receipt className="w-4 h-4 text-amber-500" />
                                Bill Breakdown
                            </span>
                        </h3>
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 blur-3xl group-hover:bg-white/10 transition-all"></div>

                            <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-xs font-black tracking-widest uppercase italic">Subtotal</span>
                                    <span className="text-lg font-bold tabular-nums italic">₹{order.subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-400">
                                    <span className="text-xs font-black tracking-widest uppercase italic">Service Fee</span>
                                    <span className="text-lg font-bold tabular-nums italic">₹{order.delivery_fee}</span>
                                </div>
                                <div className="h-px bg-white/10 my-6"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Grand Final Amount</p>
                                        <h4 className="text-4xl font-black italic tracking-tighter">TOTAL</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-5xl font-black tabular-nums bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent italic">₹{order.total}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Financials */}
                        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                Internal Financials
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Base Price</p>
                                    <p className="font-bold text-slate-900">₹{order.base_price_amount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Seller Pay</p>
                                    <p className="font-bold text-slate-900">₹{order.seller_price_amount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Commission</p>
                                    <p className="font-bold text-green-600">₹{order.commission_amount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tech Fee</p>
                                    <p className="font-bold text-blue-600">₹{order.tech_fee_amount || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border border-slate-200 rounded-2xl hover:bg-slate-50 text-xs font-black uppercase tracking-widest text-slate-500 transition-all active:scale-95"
                    >
                        Back to List
                    </button>
                    <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95 group">
                        <Printer className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Generate Invoice
                    </button>
                </div>
            </div>
        </div>
    )
}
