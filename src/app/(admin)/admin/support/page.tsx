import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Badge } from '@/components/ui/badge'

export default async function SupportPage() {
    const supabase = await createClient()

    const { data: tickets } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false })

    async function updateStatus(id: string, newStatus: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('support_tickets').update({ status: newStatus }).eq('id', id)
        revalidatePath('/admin/support')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Support Tickets</h1>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Issue</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">User</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Description</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Priority</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {tickets?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No tickets found.
                                    </td>
                                </tr>
                            )}
                            {tickets?.map((ticket) => (
                                <tr key={ticket.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle">
                                        <div className="font-medium">{ticket.issue_type}</div>
                                        <div className="text-xs text-gray-500">Order: {ticket.order_id || 'N/A'}</div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div>{ticket.name}</div>
                                        <div className="text-xs text-gray-500">{ticket.phone}</div>
                                    </td>
                                    <td className="p-4 align-middle max-w-xs truncate" title={ticket.description}>
                                        {ticket.description}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={ticket.priority === 'high' ? 'destructive' : ticket.priority === 'medium' ? 'secondary' : 'outline'}>
                                            {ticket.priority.toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={ticket.status === 'closed' ? 'success' : ticket.status === 'in_progress' ? 'secondary' : 'default'}>
                                            {ticket.status.replaceAll('_', ' ').toUpperCase()}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <div className="flex gap-2">
                                            {ticket.status !== 'closed' && (
                                                <form action={updateStatus.bind(null, ticket.id, 'closed')}>
                                                    <button className="text-xs font-medium text-green-600 hover:text-green-800">
                                                        Close
                                                    </button>
                                                </form>
                                            )}
                                            {ticket.status === 'open' && (
                                                <form action={updateStatus.bind(null, ticket.id, 'in_progress')}>
                                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-800">
                                                        Mark In Progress
                                                    </button>
                                                </form>
                                            )}
                                        </div>
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
