import { createClient } from '@/utils/supabase/server'
import { OrderFilter } from '@/components/admin/orders/order-filter'
import { AdminOrdersTable } from '@/components/admin/orders/admin-order-table'

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{
        slot?: string;
        search?: string;
        page?: string;
    }>
}) {
    const supabase = await createClient()
    const params = await searchParams

    const page = parseInt(params.page || '1')
    const limit = 20
    const startRange = (page - 1) * limit
    const endRange = startRange + limit - 1

    // 1. Build Base Query
    let query = supabase
        .from('orders')
        .select(`
            *,
            addresses ( name, phone, area, pincode, house_no, landmark ),
            sellers ( Seller_name ),
            areas ( name ),
            order_items ( id, product_name, quantity, price, product_image ),
            order_payments ( mode, paid )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })



    // 3. Apply Other Filters
    if (params.slot && params.slot !== 'all') {
        query = query.eq('delivery_slot', params.slot)
    }

    if (params.search) {
        query = query.ilike('order_number', `%${params.search}%`)
    }

    // 4. Pagination & Fetch
    query = query.range(startRange, endRange)
    const { data: orders, count, error } = await query

    if (error) console.error("Supabase Error:", error)

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <OrderFilter />
            <AdminOrdersTable orders={orders || []} count={count || 0} page={page} />
        </div>
    )
}