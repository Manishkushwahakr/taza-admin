'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface SidebarContextType {
    isExpanded: boolean
    isMobileOpen: boolean
    toggleSidebar: () => void
    toggleMobileSidebar: () => void
    closeMobileSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    // Default to true on desktop, false on mobile.
    const [isExpanded, setIsExpanded] = useState(true)
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        // Load preference from local storage on mount
        const stored = localStorage.getItem('taza_sidebar_expanded')
        if (stored !== null) {
            setIsExpanded(stored === 'true')
        }
    }, [])

    const toggleSidebar = () => {
        setIsExpanded(prev => {
            const next = !prev
            localStorage.setItem('taza_sidebar_expanded', String(next))
            return next
        })
    }

    const toggleMobileSidebar = () => {
        setIsMobileOpen(prev => !prev)
    }

    const closeMobileSidebar = () => {
        setIsMobileOpen(false)
    }

    // Prevent hydration mismatch by rendering default states server-side
    // and only applying localStorage values after mount.
    if (!isMounted) {
        return (
            <SidebarContext.Provider
                value={{
                    isExpanded: true,
                    isMobileOpen: false,
                    toggleSidebar,
                    toggleMobileSidebar,
                    closeMobileSidebar
                }}
            >
                {/* We render a div that defaults to pl-64 or pl-[250px] to match SSR */}
                <div className="flex h-screen bg-gray-50 overflow-hidden" suppressHydrationWarning>
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }

    return (
        <SidebarContext.Provider
            value={{
                isExpanded,
                isMobileOpen,
                toggleSidebar,
                toggleMobileSidebar,
                closeMobileSidebar
            }}
        >
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {children}
            </div>
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider')
    }
    return context
}
