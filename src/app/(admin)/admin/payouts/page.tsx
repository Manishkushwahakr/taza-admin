import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

export default async function PayoutsPage() {
    const supabase = await createClient()

    const { data: payouts } = await supabase
        .from('seller_payouts')
        .select(`
        *,
        sellers (
            id,
            Seller_name,
            profiles:user_id (
                name,
                phone
            )
        )
    `)
        .order('created_at', { ascending: false })

    async function releasePayout(id: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('seller_payouts').update({
            payout_status: 'released',
            released_at: new Date().toISOString()
        }).eq('id', id)
        revalidatePath('/admin/payouts')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Seller Payouts</h1>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Seller</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Total Sales</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Commission</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Tech Fee</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Payout Amount</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {payouts?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-500">
                                        No payouts found.
                                    </td>
                                </tr>
                            )}
                            {payouts?.map((payout: any) => (
                                <tr key={payout.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle">
                                        <div className="font-medium">{payout.sellers?.Seller_name}</div>
                                        <div className="text-xs text-gray-500">{payout.sellers?.profiles?.phone}</div>
                                    </td>
                                    <td className="p-4 align-middle">₹{payout.total_order_amount}</td>
                                    <td className="p-4 align-middle text-red-600">-₹{payout.total_commission_amount}</td>
                                    <td className="p-4 align-middle text-red-600">-₹{payout.total_tech_fee_amount}</td>
                                    <td className="p-4 align-middle font-bold text-green-600">₹{payout.final_payout_amount}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={payout.payout_status === 'released' ? 'success' : 'secondary'}>
                                            {payout.payout_status.toUpperCase()}
                                        </Badge>
                                        {payout.released_at && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(payout.released_at).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 align-middle">
                                        {payout.payout_status === 'pending' && (
                                            <form action={releasePayout.bind(null, payout.id)}>
                                                <button className="flex items-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700">
                                                    <CheckCircle className="mr-1.5 h-3.5 w-3.5" /> Release
                                                </button>
                                            </form>
                                        )}
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
