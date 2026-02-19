'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition, useCallback } from 'react'
import { Search, Calendar, Clock, Filter } from 'lucide-react'

export function OrderFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [filterType, setFilterType] = useState(searchParams.get('filter_type') || 'all')
    const [slot, setSlot] = useState(searchParams.get('slot') || 'all')
    const [startDate, setStartDate] = useState(searchParams.get('start_date') || '')
    const [endDate, setEndDate] = useState(searchParams.get('end_date') || '')
    const [search, setSearch] = useState(searchParams.get('search') || '')

    const applyFilters = useCallback((overrideType?: string, overrideSlot?: string) => {
        const type = overrideType || filterType
        const currentSlot = overrideSlot !== undefined ? overrideSlot : slot

        const params = new URLSearchParams()

        params.set('filter_type', type)
        if (search) params.set('search', search)

        if (type === 'today') {
            // FIX: Use Local Date instead of UTC (toISOString)
            // specific to user's timezone (India/Asia or system default)
            const d = new Date()
            const offset = d.getTimezoneOffset()
            const today = new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]

            params.set('start_date', today)
            params.set('end_date', today)
            if (currentSlot !== 'all') params.set('slot', currentSlot)
        } else if (type === 'yesterday') {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yStr = yesterday.toISOString().split('T')[0]
            params.set('start_date', yStr)
            params.set('end_date', yStr)
        } else if (type === 'custom') {
            if (startDate) params.set('start_date', startDate)
            if (endDate) params.set('end_date', endDate)
        }
        // 'all' type doesn't need start/end date params, so they are cleared by re-creating params or just not setting them

        startTransition(() => {
            router.push(`/admin/orders?${params.toString()}`)
        })
    }, [filterType, slot, startDate, endDate, search, router, startDate, endDate])

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters()
        }, 500)
        return () => clearTimeout(timer)
    }, [search, applyFilters])

    const handleTypeChange = (type: string) => {
        setFilterType(type)
        if (type !== 'custom') {
            applyFilters(type)
        }
    }

    const handleSlotChange = (newSlot: string) => {
        setSlot(newSlot)
        applyFilters(filterType, newSlot)
    }

    return (
        <div className={`space-y-4 ${isPending ? 'opacity-70' : ''}`}>
            {/* Top Bar: Tabs & Search */}
            <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                {/* Tabs */}
                <div className="flex bg-slate-100/80 p-1 rounded-lg self-start">
                    {['all', 'today', 'yesterday', 'custom'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`px-5 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${filterType === type
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                                }`}
                        >
                            {type === 'all' ? 'All Orders' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
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

            {/* Sub-Filters: Slots (Only for Today) */}
            {filterType === 'today' && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Slots
                    </span>
                    <div className="flex gap-2">
                        {['all', 'morning', 'evening'].map((s) => (
                            <button
                                key={s}
                                onClick={() => handleSlotChange(s)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${slot === s
                                    ? s === 'morning' ? 'bg-orange-50 text-orange-600 border-orange-200 ring-2 ring-orange-100'
                                        : s === 'evening' ? 'bg-purple-50 text-purple-600 border-purple-200 ring-2 ring-purple-100'
                                            : 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                {s === 'all' ? 'All Delivery' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Sub-Filters: Custom Date Range */}
            {filterType === 'custom' && (
                <div className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 focus:ring-2 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        onClick={() => applyFilters()}
                        className="px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 shadow-md shadow-green-200 hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" /> Apply Range
                    </button>
                </div>
            )}
        </div>
    )
}
