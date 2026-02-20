'use client'

import { useState, useEffect } from 'react'
import { Bell, User, Menu } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { useSidebar } from '@/contexts/sidebar-context'

export function TopNavbar() {
    const [currentTime, setCurrentTime] = useState<string>('')
    const [adminName, setAdminName] = useState<string>('Admin')
    const supabase = createClient()
    const router = useRouter()
    const { toggleSidebar, toggleMobileSidebar } = useSidebar()

    useEffect(() => {
        // Real-time clock
        const interval = setInterval(() => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
        }, 1000)

        // Fetch Admin Profile
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('name')
                    .eq('user_id', user.id)
                    .single()

                if (profile?.name) {
                    setAdminName(profile.name)
                }
            }
        }

        fetchProfile()

        return () => clearInterval(interval)
    }, [supabase])

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-white px-6 shadow-sm">
            {/* Left side */}
            <div className="flex items-center gap-4">
                {/* Desktop Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:flex p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                {/* Mobile Toggle */}
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden flex p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-bold text-green-700 tracking-tight">Taza Taza Admin</h2>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-6">
                {/* Clock */}
                <div className="hidden md:block">
                    <span className="font-mono text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-md border border-green-100 shadow-sm">
                        {currentTime}
                    </span>
                </div>

                {/* Notifications */}
                <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 border-l pl-6">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 leading-tight">{adminName}</span>
                        <span className="text-[10px] uppercase font-bold text-green-600">Administrator</span>
                    </div>
                    <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-green-100 bg-green-50 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                    </div>
                </div>
            </div>
        </header>
    )
}
