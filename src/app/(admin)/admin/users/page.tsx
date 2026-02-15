import { createClient } from '@/utils/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns' // You might need to install date-fns or use native Intl

export default async function UsersPage() {
    const supabase = await createClient()

    // Fetch profiles with order stats
    // Note: Supabase doesn't support complex joins with aggregation easily in one go without RPC or views.
    // For now, I'll just fetch profiles.

    const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Phone</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Joined</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {users?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {users?.map((user) => (
                                <tr key={user.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle font-medium">{user.name}</td>
                                    <td className="p-4 align-middle">{user.phone || 'N/A'}</td>
                                    <td className="p-4 align-middle">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            View Details
                                        </button>
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
