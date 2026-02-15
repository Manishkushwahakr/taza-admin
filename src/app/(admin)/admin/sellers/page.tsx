import { createClient } from '@/utils/supabase/server'
import { CheckCircle, XCircle, Filter } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SellersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
    const supabase = await createClient()
    const params = await searchParams
    const statusFilter = params.status || 'all'

    let query = supabase
        .from('sellers')
        .select(`
      *,
      profiles:user_id (
        name,
        phone
      ),
      areas (
        name,
        pincode
      )
    `)
        .order('created_at', { ascending: false })

    if (statusFilter === 'active') {
        query = query.eq('is_active', true)
    } else if (statusFilter === 'inactive') {
        query = query.eq('is_active', false)
    }

    const { data: sellers } = await query

    async function toggleStatus(sellerId: string, currentStatus: boolean) {
        'use server'
        const supabase = await createClient()
        await supabase.from('sellers').update({ is_active: !currentStatus }).eq('id', sellerId)
        revalidatePath('/admin/sellers')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Seller Verification</h1>
            </div>

            <div className="flex space-x-2 border-b">
                <Link
                    href="/admin/sellers?status=all"
                    className={`px-4 py-2 text-sm font-medium ${statusFilter === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All
                </Link>
                <Link
                    href="/admin/sellers?status=active"
                    className={`px-4 py-2 text-sm font-medium ${statusFilter === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Active
                </Link>
                <Link
                    href="/admin/sellers?status=inactive"
                    className={`px-4 py-2 text-sm font-medium ${statusFilter === 'inactive' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Pending / Inactive
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors">
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Seller Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Contact</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Area</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Commission</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {sellers?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No sellers found.
                                    </td>
                                </tr>
                            )}
                            {sellers?.map((seller: any) => (
                                <tr key={seller.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle">
                                        <div className="font-medium text-gray-900">{seller.Seller_name}</div>
                                        <div className="text-xs text-gray-500">ID: {seller.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="text-gray-900">{seller.profiles?.phone || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="text-gray-900">{seller.area_name || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 align-middle font-mono">
                                        {seller.commission_percentage}%
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${seller.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {seller.is_active ? 'Verified' : 'Pending Verification'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <form action={toggleStatus.bind(null, seller.id, seller.is_active)}>
                                            {seller.is_active ? (
                                                <button className="flex items-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                                                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Deactivate
                                                </button>
                                            ) : (
                                                <button className="flex items-center rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm">
                                                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Verify & Approve
                                                </button>
                                            )}
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
