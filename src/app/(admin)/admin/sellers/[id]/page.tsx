
import { createClient } from '@/utils/supabase/server'
import { ChevronLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function EditSellerPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params

    // Fetch Seller
    const { data: seller, error } = await supabase
        .from('sellers')
        .select(`
            *,
            profiles:user_id (name, phone),
            areas (id, name)
        `)
        .eq('id', id)
        .single()

    if (error || !seller) {
        redirect('/admin/sellers')
    }

    // Fetch Areas for Dropdown
    const { data: areas } = await supabase
        .from('areas')
        .select('id, name')
        .eq('is_active', true)
        .order('name')

    async function updateSeller(formData: FormData) {
        'use server'
        const supabase = await createClient()

        const commission_percentage = formData.get('commission_percentage')
        const tech_fee_type = formData.get('tech_fee_type')
        const tech_fee_amount = formData.get('tech_fee_amount')
        const area_id = formData.get('area_id')

        await supabase
            .from('sellers')
            .update({
                commission_percentage,
                tech_fee_type,
                tech_fee_amount,
                area_id
            })
            .eq('id', id)

        revalidatePath('/admin/sellers')
        redirect('/admin/sellers') // Go back to list after save
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/sellers"
                    className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Seller</h1>
                    <p className="text-slate-500 text-sm">Update financial settings and area assignment.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header / Read-Only Info */}
                <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-col md:flex-row gap-6">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Seller Name</p>
                        <p className="font-bold text-slate-900 text-lg">{seller.Seller_name}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">User Profile</p>
                        <p className="font-medium text-slate-700">{seller.profiles?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-400">{seller.profiles?.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase border ${seller.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                            {seller.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>

                <form action={updateSeller} className="p-6 space-y-8">

                    {/* Area Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                            Area Assignment
                        </h3>
                        <div className="grid gap-2">
                            <label htmlFor="area_id" className="text-sm font-semibold text-slate-700">Operating Area</label>
                            <select
                                name="area_id"
                                id="area_id"
                                defaultValue={seller.area_id || ''}
                                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                            >
                                <option value="">-- Select Area --</option>
                                {areas?.map((area: any) => (
                                    <option key={area.id} value={area.id}>{area.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400">Current visible area for this seller.</p>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100"></div>

                    {/* Financials */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
                            Financial Configuration
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="commission_percentage" className="text-sm font-semibold text-slate-700">Commission (%)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="commission_percentage"
                                        id="commission_percentage"
                                        defaultValue={seller.commission_percentage || 0}
                                        className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tech_fee_type" className="text-sm font-semibold text-slate-700">Tech Fee Model</label>
                                <select
                                    name="tech_fee_type"
                                    id="tech_fee_type"
                                    defaultValue={seller.tech_fee_type || 'per_order'}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                >
                                    <option value="per_order">Per Order</option>
                                    <option value="fixed">Fixed Monthly</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="tech_fee_amount" className="text-sm font-semibold text-slate-700">Tech Fee Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="tech_fee_amount"
                                        id="tech_fee_amount"
                                        defaultValue={seller.tech_fee_amount || 0}
                                        className="h-11 w-full rounded-xl border border-slate-200 pl-8 pr-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}
