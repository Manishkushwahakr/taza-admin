import { createClient } from '@/utils/supabase/server'
import { CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function SellersPage({ searchParams }: { searchParams: Promise<{ status?: string; page?: string }> }) {
    const supabase = await createClient()
    const { status: statusFilter = 'all', page: pageParam = '1' } = await searchParams
    const page = parseInt(pageParam)
    const limit = 20
    const startRange = (page - 1) * limit
    const endRange = startRange + limit - 1

    let query = supabase
        .from('sellers')
        .select(`
            id,
            Seller_name,
            is_active,
            commission_percentage,
            area_name,
            profiles:user_id (
                name,
                phone
            ),
            areas (
                name,
                pincode
            )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })

    if (statusFilter === 'active') {
        query = query.eq('is_active', true)
    } else if (statusFilter === 'inactive') {
        query = query.eq('is_active', false)
    }

    // Apply Pagination
    query = query.range(startRange, endRange)

    const { data: sellers, count } = await query
    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / limit)

    async function toggleStatus(sellerId: string, currentStatus: boolean) {
        'use server'
        const supabase = await createClient()
        await supabase.from('sellers').update({ is_active: !currentStatus }).eq('id', sellerId)
        revalidatePath('/admin/sellers')
    }

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams()
        if (statusFilter !== 'all') params.set('status', statusFilter)
        params.set('page', pageNumber.toString())
        return `?${params.toString()}`
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Seller Verification</h1>
            </div>

            <div className="flex space-x-2 border-b border-slate-100">
                <Link
                    href="/admin/sellers?status=all"
                    className={`px-4 py-2 text-sm font-bold ${statusFilter === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All
                </Link>
                <Link
                    href="/admin/sellers?status=active"
                    className={`px-4 py-2 text-sm font-bold ${statusFilter === 'active' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Active
                </Link>
                <Link
                    href="/admin/sellers?status=inactive"
                    className={`px-4 py-2 text-sm font-bold ${statusFilter === 'inactive' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Pending / Inactive
                </Link>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-slate-400">
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Seller Name</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Contact</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Area</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Commission</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sellers?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="font-bold text-slate-900 text-lg">No sellers found.</div>
                                            <p className="text-slate-500 text-sm">No seller accounts match your current filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {sellers?.map((seller: any) => (
                                <tr key={seller.id} className="transition-colors hover:bg-slate-50/50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{seller.Seller_name}</div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {seller.id.slice(0, 8)}...</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-700 font-medium">{seller.profiles?.phone || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-slate-700 font-medium">{seller.area_name || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-slate-900 text-xs">{seller.commission_percentage}%</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${seller.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {seller.is_active ? 'Verified' : 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <form action={toggleStatus.bind(null, seller.id, seller.is_active)}>
                                            {seller.is_active ? (
                                                <button className="h-9 rounded-xl border border-red-100 bg-white px-4 text-[11px] font-bold text-red-600 transition-all hover:bg-red-50 active:scale-95">
                                                    Deactivate
                                                </button>
                                            ) : (
                                                <button className="h-9 rounded-xl bg-emerald-600 px-4 text-[11px] font-bold text-white transition-all hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-500/20">
                                                    Verify & Approve
                                                </button>
                                            )}
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="text-xs font-bold text-slate-400">
                            Showing {startRange + 1} to {Math.min(endRange + 1, totalCount)} of {totalCount} sellers
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href={page > 1 ? createPageURL(page - 1) : '#'}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 ${page <= 1 ? 'pointer-events-none opacity-30' : ''}`}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Link>
                            <span className="text-xs font-bold text-slate-700">Page {page} of {totalPages}</span>
                            <Link
                                href={page < totalPages ? createPageURL(page + 1) : '#'}
                                className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 ${page >= totalPages ? 'pointer-events-none opacity-30' : ''}`}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
