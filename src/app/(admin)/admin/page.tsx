import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShoppingBag, Truck, IndianRupee, Clock, ArrowUpRight } from 'lucide-react'
import { RecentOrdersTable } from '@/components/admin/dashboard/recent-orders-table'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Get start of today in ISO format
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayISO = today.toISOString()

    // Parallel Data Fetching
    const [
        { count: ordersToday },
        { count: pendingOrders },
        { data: revenueData },
        { count: activeDeliveryBoys },
        { data: recentOrders }
    ] = await Promise.all([
        // 1. Total Orders Today
        supabase.from('orders')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayISO),

        // 2. Pending Orders (Total, not just today)
        supabase.from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),

        // 3. Revenue Today (Only specific statuses like delivered typically count, but for now summing all non-cancelled today or just delivered today)
        supabase.from('orders')
            .select('total')
            .gte('created_at', todayISO)
            .neq('status', 'cancelled'), // Assuming we count all valid orders for "Revenue Today" projection, or restrict to delivered if strict.

        // 4. Active Delivery Boys (assuming role 'delivery_boy' exists, or we count users who are online/active if we had that status. For now, counting all delivery boys)
        supabase.from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'delivery_partner'), // Adjust role name if needed

        // 5. Recent 10 Orders
        supabase.from('orders')
            .select(`
                id,
                order_number,
                created_at,
                total,
                payment_mode,
                status,
                addresses ( name )
            `)
            .order('created_at', { ascending: false })
            .limit(10)
    ])

    const totalRevenueToday = revenueData?.reduce((acc, order) => acc + (order.total || 0), 0) || 0

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                <p className="text-slate-500">Overview of your store's performance today.</p>
            </div>

            {/* Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Orders Today</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{ordersToday || 0}</div>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            <span className="text-green-600 font-bold flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                Today
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Orders</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{pendingOrders || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Requires attention
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue Today</CardTitle>
                        <IndianRupee className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">₹{totalRevenueToday.toLocaleString()}</div>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                            <span className="text-green-600 font-bold flex items-center mr-1">
                                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                                +0%
                            </span>
                            from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Delivery Boys</CardTitle>
                        <Truck className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">{activeDeliveryBoys || 0}</div>
                        <p className="text-xs text-slate-500 mt-1">
                            Registered partners
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Orders */}
            <RecentOrdersTable orders={recentOrders || []} />
        </div>
    )
}
