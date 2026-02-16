'use client'

import { useState } from 'react'
import { User as UserIcon, Phone, Calendar, Shield } from 'lucide-react'
import { RoleSelector } from './role-selector'
import { UserDetailDrawer } from './user-detail-drawer'

export function UserList({ initialUsers }: { initialUsers: any[] }) {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">User Profile</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Contact Info</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Access Role</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Registration</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {initialUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="rounded-full bg-slate-50 p-4">
                                                <UserIcon className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <div className="font-bold text-slate-900 text-lg">No users found</div>
                                            <p className="text-slate-500 max-w-xs text-sm">We couldn't find any users matching your search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                initialUsers.map((user: any) => (
                                    <tr key={user.id} className="transition-colors hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                    <UserIcon className="h-6 w-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate font-bold text-slate-900">{user.name}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {user.user_id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                    <Phone className="h-3.5 w-3.5 text-slate-300" />
                                                    {user.phone || 'No phone'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Shield className="h-4 w-4 text-slate-300" />
                                                <RoleSelector
                                                    userId={user.user_id}
                                                    currentRole={user.user_roles?.[0]?.role || 'user'}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserDetailDrawer
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </>
    )
}
