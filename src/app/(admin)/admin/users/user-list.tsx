'use client'

import { useState, useMemo } from 'react'
import { User as UserIcon, Phone, Calendar, Shield, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { RoleSelector } from './role-selector'
import { UserDetailDrawer } from './user-detail-drawer'

type FilterRoleType = 'all' | 'admin' | 'seller' | 'delivery' | 'user'

export function UserList({ initialUsers }: { initialUsers: any[] }) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [filterRole, setFilterRole] = useState<FilterRoleType>('all')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 100

    // 1. Role Fallback & Frontend Filtering Logic
    const filteredUsers = useMemo(() => {
        return initialUsers.filter(user => {
            const userRole = user.user_roles?.[0]?.role || 'user'
            if (filterRole === 'all') return true
            return userRole === filterRole
        })
    }, [initialUsers, filterRole])

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-50 text-red-700 border-red-100'
            case 'seller': return 'bg-blue-50 text-blue-700 border-blue-100'
            case 'delivery': return 'bg-green-50 text-green-700 border-green-100'
            default: return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }

    return (
        <div className="space-y-4">
            {/* Frontend Filter Dropdown */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                    <Filter className="h-4 w-4" />
                    Filter by Role:
                </div>
                <select
                    value={filterRole}
                    onChange={(e) => {
                        setFilterRole(e.target.value as FilterRoleType)
                        setCurrentPage(1)
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
                >
                    <option value="all">All Users</option>
                    <option value="user">Users (Customers)</option>
                    <option value="admin">Admins</option>
                    <option value="seller">Sellers</option>
                    <option value="delivery">Delivery</option>
                </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Name</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Phone</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Role</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Created Date</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginatedUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="rounded-full bg-slate-50 p-4">
                                                <UserIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <div className="font-bold text-slate-900 text-lg">No Users Available</div>
                                            <p className="text-slate-500 max-w-xs text-sm">There are no user profiles to display for this role.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedUsers.map((user: any) => {
                                    const userRole = user.user_roles?.[0]?.role || 'user'
                                    return (
                                        <tr key={user.id} className="transition-colors hover:bg-slate-50/50 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <UserIcon className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-bold text-slate-900">{user.name}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {user.user_id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                    <Phone className="h-3.5 w-3.5 text-slate-300" />
                                                    {user.phone || 'No phone'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${getRoleBadgeColor(userRole)}`}>
                                                        {userRole}
                                                    </span>
                                                    <RoleSelector
                                                        userId={user.user_id}
                                                        currentRole={userRole}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                                    <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setSelectedUserId(user.user_id)}
                                                    className="h-9 rounded-xl border border-slate-200 px-4 text-[11px] font-bold text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                                                >
                                                    View Account
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4">
                        <div className="text-xs font-bold text-slate-400">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-bold text-slate-700">Page {currentPage} of {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-30"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <UserDetailDrawer
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </div>
    )
}
