'use client'

import { useSidebar } from '@/contexts/sidebar-context'

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isExpanded } = useSidebar()

    return (
        <div
            className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${isExpanded ? 'md:pl-[250px]' : 'md:pl-[70px]'
                }`}
        >
            {children}
        </div>
    )
}
