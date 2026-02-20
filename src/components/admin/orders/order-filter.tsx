'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition, useCallback } from 'react'
import { Search, Clock } from 'lucide-react'

export function OrderFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [slot, setSlot] = useState(searchParams.get('slot') || 'all')
    const [search, setSearch] = useState(searchParams.get('search') || '')

    const applyFilters = useCallback((overrideSlot?: string) => {
        const currentSlot = overrideSlot !== undefined ? overrideSlot : slot

        const params = new URLSearchParams()

        if (search) params.set('search', search)
        if (currentSlot !== 'all') params.set('slot', currentSlot)

        startTransition(() => {
            router.push(`/admin/orders?${params.toString()}`)
        })
    }, [search, slot, router])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters()
        }, 500)
        return () => clearTimeout(timer)
    }, [search, applyFilters])

    const handleSlotChange = (newSlot: string) => {
        setSlot(newSlot)
        applyFilters(newSlot)
    }

    return (
        <div className={`space-y-4 ${isPending ? 'opacity-70' : ''}`}>
            {/* Top Bar: Tabs & Search */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                {/* Slot Tabs */}
                <div className="flex items-center gap-3 bg-slate-100/80 p-1.5 rounded-lg self-start">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 pl-2">
                        <Clock className="w-3.5 h-3.5" /> Slots
                    </span>
                    <div className="flex bg-white rounded-md shadow-sm border border-slate-200/50 p-0.5">
                        {['all', 'morning', 'evening'].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSlotChange(s)}
                                className={`px-5 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 ${slot === s
                                        ? s === 'morning' ? 'bg-orange-50 text-orange-600 shadow-sm'
                                            : s === 'evening' ? 'bg-purple-50 text-purple-600 shadow-sm'
                                                : 'bg-slate-800 text-white shadow-sm'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {s === 'all' ? 'All Delivery' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search */}
                <div className="relative group flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search Order ID, Name, Phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/10 focus:border-green-500 transition-all"
                    />
                </div>
            </div>
        </div>
    )
}
