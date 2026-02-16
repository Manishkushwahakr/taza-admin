import { createClient } from '@/utils/supabase/server'
import { Search } from 'lucide-react'
import { UserList } from './user-list'

export default async function UsersPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const supabase = await createClient()
    const { q } = await searchParams

    // Fetch profiles with roles
    let query = supabase
        .from('profiles')
        .select(`
            *,
            user_roles (role)
        `)

    if (q) {
        query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
    }

    const { data: users, error } = await query.order('created_at', { ascending: false })

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm">Monitor user profiles, contact details, and manage system access roles.</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <form method="GET" className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search by name or phone number..."
                            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                        />
                    </div>
                    <button type="submit" className="h-12 rounded-xl bg-slate-900 px-8 font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95">
                        Search Users
                    </button>
                    {q && (
                        <a
                            href="/admin/users"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-6 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Clear
                        </a>
                    )}
                </form>
            </div>

            <UserList initialUsers={users || []} />
        </div>
    )
}
