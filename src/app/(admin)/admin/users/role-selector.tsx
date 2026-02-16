'use client'

import { useState } from 'react'
import { updateUserRole } from '@/app/actions'
import { UserRoleType } from '@/types'
import { Loader2 } from 'lucide-react'

export function RoleSelector({ userId, currentRole }: { userId: string, currentRole: UserRoleType }) {
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState(currentRole)

    const handleRoleChange = async (newRole: string) => {
        setLoading(true)
        try {
            await updateUserRole(userId, newRole)
            setRole(newRole as UserRoleType)
        } catch (error) {
            console.error('Failed to update role:', error)
            alert('Failed to update role')
            setRole(currentRole) // Rollback
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative">
            <select
                disabled={loading}
                value={role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="h-9 w-32 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 appearance-none cursor-pointer"
            >
                <option value="user">User</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
                <option value="delivery">Delivery</option>
            </select>
            {loading && (
                <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                </div>
            )}
        </div>
    )
}
