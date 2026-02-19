import { createClient } from '@/utils/supabase/server'
import { OrderFilter } from '@/components/admin/orders/order-filter'
import { AdminOrdersTable } from '@/components/admin/orders/admin-order-table'

export default async function AdminOrdersPage({
    searchParams,
}: {
    searchParams: Promise<{
        filter_type?: string;
        slot?: string;
        start_date?: string;
        end_date?: string;
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

    // Build Query
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

    // Date Filters
    if (params.start_date) {
        query = query.gte('created_at', `${params.start_date}T00:00:00`)
    }
    if (params.end_date) {
        query = query.lte('created_at', `${params.end_date}T23:59:59`)
    }

    // Slot Filter
    if (params.slot && params.slot !== 'all') {
        query = query.eq('delivery_slot', params.slot)
    }

    // Search Filter
    if (params.search) {
        query = query.ilike('order_number', `%${params.search}%`)
    }

    // Pagination
    query = query.range(startRange, endRange)

    const { data: orders, count, error } = await query

    if (error) {
        console.error("Supabase Fetch Error:", JSON.stringify(error, null, 2))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order Management</h1>
            </div>

            <OrderFilter />

            <AdminOrdersTable orders={orders || []} count={count || 0} page={page} />
        </div>
    )
}
