import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { revalidatePath } from 'next/cache'

export default async function SellerOrdersPage() {
    const supabase = await createClient()

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Please log in.</div>

    // 2. Get Seller ID
    const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!seller) return <div>Seller account not found.</div>

    // 3. Fetch Orders
    const { data: orders } = await supabase
        .from('orders')
        .select(`
        *,
        addresses (
            name,
            house_no,
            area,
            pincode,
            phone
        ),
        order_items (
            product_name,
            quantity,
            price,
            product_image
        ),
        order_payments (
            mode,
            paid
        )
    `)
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false })

    // Action to update status
    async function updateStatus(orderId: string, newStatus: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
        revalidatePath('/seller/orders')
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Orders</h1>

            <div className="divide-y rounded-md border bg-white shadow-sm">
                {orders?.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No orders found.
                    </div>
                )}
                {orders?.map((order: any) => (
                    <div key={order.id} className="p-6">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">Order #{order.order_number}</span>
                                    <Badge variant={
                                        order.status === 'delivered' ? 'success' :
                                            order.status === 'cancelled' ? 'destructive' :
                                                'default'
                                    }>
                                        {order.status.toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                    Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <form action={updateStatus.bind(null, order.id, 'processing')}>
                                    <button disabled={order.status !== 'confirmed'} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                        Process
                                    </button>
                                </form>
                                <form action={updateStatus.bind(null, order.id, 'shipped')}>
                                    <button disabled={order.status !== 'processing'} className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50">
                                        Ship
                                    </button>
                                </form>
                                <form action={updateStatus.bind(null, order.id, 'delivered')}>
                                    <button disabled={order.status !== 'shipped'} className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">
                                        Deliver
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="mt-4 grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
                                <div className="text-sm text-gray-600">
                                    <p><span className="font-medium">Name:</span> {order.addresses?.name}</p>
                                    <p><span className="font-medium">Phone:</span> {order.addresses?.phone}</p>
                                    <p><span className="font-medium">Address:</span> {order.addresses?.house_no}, {order.addresses?.area} - {order.addresses?.pincode}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Order Items</h3>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {order.order_items?.map((item: any) => (
                                        <li key={item.id} className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                {item.product_image && (
                                                    <img src={item.product_image} alt={item.product_name} className="h-8 w-8 rounded object-cover" />
                                                )}
                                                <span>{item.quantity}x {item.product_name}</span>
                                            </div>
                                            <span>₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 border-t pt-2 space-y-1 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>₹{order.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Delivery Fee</span>
                                        <span>₹{order.delivery_fee}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-gray-900 border-t border-dashed pt-1 mt-1">
                                        <span>Total Amount</span>
                                        <span>₹{order.total}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <div className="flex items-center gap-2">
                                            <span>Payment: {order.payment_mode}</span>
                                            {order.order_payments?.[0]?.paid ? (
                                                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">PAID</span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">PENDING</span>
                                            )}
                                        </div>
                                        <span>Slot: {order.delivery_slot}</span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100 bg-gray-50 p-2 rounded text-xs space-y-1">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Your Earnings</span>
                                            <span className="font-medium text-green-600">₹{order.seller_price_amount}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Commission</span>
                                            <span>-₹{order.commission_amount}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Tech Fee</span>
                                            <span>-₹{order.tech_fee_amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
