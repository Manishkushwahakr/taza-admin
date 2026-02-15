import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'

export default async function CallbacksPage() {
    const supabase = await createClient()

    const { data: callbacks } = await supabase
        .from('callback_requests')
        .select('*')
        .order('created_at', { ascending: false })

    async function resolveCallback(id: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('callback_requests').update({ status: 'resolved' }).eq('id', id)
        revalidatePath('/admin/callbacks')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Callback Requests</h1>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Preferred Time</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {callbacks?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No callback requests.
                                    </td>
                                </tr>
                            )}
                            {callbacks?.map((request) => (
                                <tr key={request.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle font-medium">{request.name}</td>
                                    <td className="p-4 align-middle">{request.phone}</td>
                                    <td className="p-4 align-middle">{request.preferred_time}</td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={request.status === 'resolved' ? 'success' : 'default'}>
                                            {request.status.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        {request.status !== 'resolved' && (
                                            <form action={resolveCallback.bind(null, request.id)}>
                                                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                                    Mark Resolved
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
