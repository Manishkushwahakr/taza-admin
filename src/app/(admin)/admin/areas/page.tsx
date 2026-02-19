import { createClient } from '@/utils/supabase/server'
import { Plus, CheckCircle, XCircle, MapPin } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AreasPage() {
    const supabase = await createClient()

    // Fetch available sellers for assignment
    const { data: sellers } = await supabase
        .from('sellers')
        .select('id, Seller_name')
        .eq('is_active', true)
        .order('Seller_name')

    // Fetch areas with assigned seller details
    const { data: areas } = await supabase
        .from('areas')
        .select(`
            *,
            sellers (
                id,
                Seller_name,
                profiles (phone)
            )
        `)
        .order('created_at', { ascending: false })

    async function addArea(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const pincode = formData.get('pincode') as string
        const seller_id = formData.get('seller_id') as string

        const supabase = await createClient()

        // 1. Create Area
        const { data: newArea, error } = await supabase
            .from('areas')
            .insert({ name, pincode })
            .select()
            .single()

        if (error || !newArea) {
            console.error('Error creating area:', error)
            return
        }

        // 2. Assign Seller if selected
        if (seller_id) {
            await supabase
                .from('sellers')
                .update({ area_id: newArea.id })
                .eq('id', seller_id)
        }

        revalidatePath('/admin/areas')
    }

    async function toggleStatus(id: string, currentStatus: boolean) {
        'use server'
        const supabase = await createClient()
        await supabase.from('areas').update({ is_active: !currentStatus }).eq('id', id)
        revalidatePath('/admin/areas')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Areas</h1>
            </div>

            {/* Add Area Form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Add New Area</h2>
                <form action={addArea} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">Area Name</label>
                        <input required name="name" id="name" placeholder="e.g. Downtown" className="h-11 rounded-xl border border-slate-200 px-4 text-sm w-64 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="pincode" className="text-sm font-semibold text-slate-700">Pincode</label>
                        <input required name="pincode" id="pincode" placeholder="e.g. 110001" className="h-11 rounded-xl border border-slate-200 px-4 text-sm w-40 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="seller_id" className="text-sm font-semibold text-slate-700">Assign Seller</label>
                        <select name="seller_id" id="seller_id" className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm w-64 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 transition-all">
                            <option value="">-- No Seller --</option>
                            {sellers?.map((seller) => (
                                <option key={seller.id} value={seller.id}>{seller.Seller_name}</option>
                            ))}
                        </select>
                    </div>
                    <button className="flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-semibold text-white transition-all hover:bg-slate-800 active:scale-95 shadow-lg shadow-slate-900/10">
                        <Plus className="mr-2 h-4 w-4" /> Add Area
                    </button>
                </form>
            </div>

            {/* Areas List */}
            <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr className="text-slate-400">
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Name</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Pincode</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Assigned Seller</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                <th className="h-12 px-6 font-bold uppercase tracking-wider text-[10px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {areas?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No areas found. Add one above.
                                    </td>
                                </tr>
                            )}
                            {areas?.map((area) => {
                                // Since unique constraint, sellers should be an object or single item array depending on supabase return
                                // Standard: Returns array even if 1-to-1 unless .single() used, but on list join it returns array/object usually
                                const assignedSeller = Array.isArray(area.sellers) ? area.sellers[0] : area.sellers

                                return (
                                    <tr key={area.id} className="transition-colors hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                                <MapPin className="h-4 w-4 text-slate-400" />
                                                {area.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{area.pincode}</td>
                                        <td className="px-6 py-4">
                                            {assignedSeller ? (
                                                <div>
                                                    <div className="font-bold text-slate-900">{assignedSeller.Seller_name}</div>
                                                    <div className="text-[10px] font-medium text-slate-500">{assignedSeller.profiles?.phone || 'No Phone'}</div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${area.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {area.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={toggleStatus.bind(null, area.id, area.is_active)}>
                                                <button className={`text-xs font-bold transition-colors ${area.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                                                    {area.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
