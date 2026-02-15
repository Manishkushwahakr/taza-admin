import { createClient } from '@/utils/supabase/server'
import { Plus, CheckCircle, XCircle, MapPin } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AreasPage() {
    const supabase = await createClient()

    const { data: areas } = await supabase
        .from('areas')
        .select('*')
        .order('created_at', { ascending: false })

    async function addArea(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const pincode = formData.get('pincode') as string

        const supabase = await createClient()
        await supabase.from('areas').insert({ name, pincode })
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
                <h1 className="text-3xl font-bold tracking-tight">Areas</h1>
            </div>

            {/* Add Area Form */}
            <div className="rounded-md border bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Add New Area</h2>
                <form action={addArea} className="flex gap-4 items-end">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Area Name</label>
                        <input required name="name" id="name" placeholder="e.g. Downtown" className="rounded-md border p-2 text-sm w-64" />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="pincode" className="text-sm font-medium">Pincode</label>
                        <input required name="pincode" id="pincode" placeholder="e.g. 110001" className="rounded-md border p-2 text-sm w-32" />
                    </div>
                    <button className="flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" /> Add Area
                    </button>
                </form>
            </div>

            {/* Areas List */}
            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Pincode</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {areas?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No areas found. Add one above.
                                    </td>
                                </tr>
                            )}
                            {areas?.map((area) => (
                                <tr key={area.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        {area.name}
                                    </td>
                                    <td className="p-4 align-middle text-gray-500">{area.pincode}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${area.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {area.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <form action={toggleStatus.bind(null, area.id, area.is_active)}>
                                            <button className={`text-sm font-medium ${area.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}>
                                                {area.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
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
