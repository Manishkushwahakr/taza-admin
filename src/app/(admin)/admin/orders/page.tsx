import { createClient } from '@/utils/supabase/server'
import { Badge } from '@/components/ui/badge'
import { revalidatePath } from 'next/cache'
import { OrderFilter } from '@/components/admin/order-filter'
import { OrderStatusSelect } from '@/components/admin/order-status-select'

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{ start_date?: string; end_date?: string }>
}) {
    const supabase = await createClient()
    const params = await searchParams

    // 1. Fetch All Orders (Filtered)
    let query = supabase
        .from('orders')
        .select(`
        *,
        addresses ( name, phone, area, pincode ),
        sellers ( Seller_name ),
        order_payments ( mode, paid )
    `)
        .order('created_at', { ascending: false })

    console.log("AdminOrdersPage Params:", params)

    if (params.start_date) {
        console.log("Applying Start Date:", params.start_date)
        query = query.gte('created_at', `${params.start_date}T00:00:00`)
    }
    if (params.end_date) {
        console.log("Applying End Date:", params.end_date)
        query = query.lte('created_at', `${params.end_date}T23:59:59`)
    }

    const { data: orders } = await query

    // 2. Fetch Live Orders (Today, Not Delivered/Cancelled)
    const todayStart = new Date().toISOString().split('T')[0]
    const { data: liveOrders } = await supabase
        .from('orders')
        .select(`
        *,
        addresses ( name, phone, area, pincode ),
        sellers ( Seller_name ),
        order_payments ( mode, paid )
    `)
        .gte('created_at', `${todayStart}T00:00:00`)
        .neq('status', 'delivered')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false })

    // Helper to Render Table
    const OrdersTable = ({ data, emptyMessage }: { data: any[], emptyMessage: string }) => (
        <div className="rounded-md border bg-white shadow-sm">
            <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="bg-gray-50 [&_tr]:border-b">
                        <tr className="border-b transition-colors text-gray-500">
                            <th className="h-12 px-4 text-left align-middle font-medium">Order #</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Customer</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Seller</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Amount</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Finances</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                            <th className="h-12 px-4 text-left align-middle font-medium">Date</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {data?.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-gray-500">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                        {data?.map((order: any) => (
                            <tr key={order.id} className="border-b transition-colors hover:bg-gray-50">
                                <td className="p-4 align-middle font-bold">
                                    {order.order_number}
                                    <div className="flex flex-col gap-0.5 text-xs font-normal text-gray-500 mt-0.5">
                                        <span>{order.delivery_slot}</span>
                                        <div className="flex items-center gap-1">
                                            <span>{order.payment_mode}</span>
                                            {order.order_payments?.[0]?.paid ? (
                                                <span className="text-green-600 font-medium ml-1">PAID</span>
                                            ) : (
                                                <span className="text-yellow-600 font-medium ml-1">PENDING</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="font-medium">{order.addresses?.name}</div>
                                    <div className="text-xs text-gray-500">{order.addresses?.area} | {order.addresses?.phone}</div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="font-medium">{order.sellers?.Seller_name || 'Unassigned'}</div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="font-bold">₹{order.total}</div>
                                    <div className="text-xs text-gray-500">Sub: ₹{order.subtotal}</div>
                                </td>
                                <td className="p-4 align-middle text-xs space-y-0.5">
                                    <div className="text-green-600">Seller: ₹{order.seller_price_amount}</div>
                                    <div className="text-blue-600">Comm: ₹{order.commission_amount}</div>
                                    <div className="text-purple-600">Tech: ₹{order.tech_fee_amount}</div>
                                </td>
                                <td className="p-4 align-middle">
                                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                </td>
                                <td className="p-4 align-middle text-gray-500">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Live Orders (Today's Active)</h2>
                </div>
                {/* @ts-ignore */}
                <OrdersTable data={liveOrders} emptyMessage="No active orders today. All caught up!" />
            </section>

            <div className="border-t pt-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">All Orders History</h2>
                </div>
                <OrderFilter />
                {/* @ts-ignore */}
                <OrdersTable data={orders} emptyMessage="No orders found matching filters." />
            </div>
        </div>
    )
}
