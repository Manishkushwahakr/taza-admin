import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, DollarSign } from 'lucide-react'

export default async function SellerDashboard() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch seller ID
    const { data: seller } = await supabase
        .from('sellers')
        .select('id, Seller_name, area_name, is_active')
        .eq('user_id', user.id)
        .single()

    if (!seller) {
        return <div>Seller profile not found. Please contact support.</div>
    }

    // Fetch stats specific to this seller
    const [
        { count: productsCount },
        { count: ordersCount },
        { data: orders }
    ] = await Promise.all([
        supabase.from('seller_specific_prices').select('*', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('seller_id', seller.id),
        supabase.from('orders').select('subtotal').eq('seller_id', seller.id).eq('status', 'delivered')
    ])

    const totalRevenue = orders?.reduce((acc, order) => acc + (order.subtotal || 0), 0) || 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-medium text-gray-900">{seller.Seller_name}</span>
                    <span>|</span>
                    <span>{seller.area_name || 'No Area Assigned'}</span>
                    <span>|</span>
                    <span className={seller.is_active ? "text-green-600" : "text-yellow-600"}>
                        {seller.is_active ? 'Active' : 'Pending Verification'}
                    </span>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ordersCount || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{productsCount || 0}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
