import { createClient } from '@/utils/supabase/server'
import { Search } from 'lucide-react'
import { UserList } from '@/app/(admin)/admin/users/user-list' // Reusing UserList but will label as Delivery Boys

export default async function DeliveryBoysPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; page?: string }>
}) {
    const supabase = await createClient()
    const { q } = await searchParams

    const page = parseInt((await searchParams).page || '1')
    const limit = 50
    const startRange = (page - 1) * limit
    const endRange = startRange + limit - 1

    // Fetch profiles with role 'delivery_partner'
    // This requires filtering on the related user_roles table which is tricky in Supabase one-shot standard queries without RPC or complex embedding.
    // However, I can select from user_roles and join profiles.

    let query = supabase
        .from('user_roles')
        .select(`
            role,
            profiles!inner (
                user_id,
                name,
                phone,
                created_at,
                user_roles (role)
            )
        `, { count: 'exact' })
        .eq('role', 'delivery_partner')

    // Since we are filtering on profiles!inner, we might need to apply search there.
    if (q) {
        query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`, { foreignTable: 'profiles' })
    }

    // Apply Pagination
    query = query.range(startRange, endRange)

    const { data: rolesData, count, error } = await query

    // Transform data to match UserList expectation (array of profiles)
    const users = rolesData?.map((item: any) => item.profiles) || []

    return (
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Delivery Partners</h1>
                    <p className="text-slate-500 text-sm">Manage your delivery fleet and verify their status.</p>
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
                            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-medium transition-all focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 placeholder:text-slate-300"
                        />
                    </div>
                    <button type="submit" className="h-12 rounded-xl bg-green-600 px-8 font-bold text-white shadow-lg shadow-green-600/10 transition-all hover:bg-green-700 active:scale-95">
                        Search
                    </button>
                    {q && (
                        <a
                            href="/admin/delivery-boys"
                            className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-6 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            Clear
                        </a>
                    )}
                </form>
            </div>

            {/* We can re-use UserList since the data structure is mapped to be the same */}
            <UserList initialUsers={users} totalCount={count || 0} currentPage={page} />
        </div>
    )
}
