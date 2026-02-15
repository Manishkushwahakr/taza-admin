'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function OrderFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [filterType, setFilterType] = useState(searchParams.get('filter_type') || 'today')
    const [slot, setSlot] = useState(searchParams.get('slot') || 'all')
    const [startDate, setStartDate] = useState(searchParams.get('start_date') || '')
    const [endDate, setEndDate] = useState(searchParams.get('end_date') || '')
    const [search, setSearch] = useState(searchParams.get('search') || '')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters()
        }, 500)
        return () => clearTimeout(timer)
    }, [search])

    const applyFilters = (overrideType?: string, overrideSlot?: string) => {
        const type = overrideType || filterType
        const currentSlot = overrideSlot !== undefined ? overrideSlot : slot

        const params = new URLSearchParams()

        params.set('filter_type', type)
        if (search) params.set('search', search)

        if (type === 'today') {
            const today = new Date().toISOString().split('T')[0]
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

        router.push(`/admin/orders?${params.toString()}`)
    }

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
        <div className="space-y-4">
            {/* Top Bar: Tabs & Search */}
            <div className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border">
                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['today', 'yesterday', 'custom'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleTypeChange(type)}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filterType === type
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search Order ID, Name, Phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-4 pr-10 py-2 border rounded-lg w-full md:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Sub-Filters: Slots (Only for Today) */}
            {filterType === 'today' && (
                <div className="flex gap-2">
                    {['all', 'morning', 'evening'].map((s) => (
                        <button
                            key={s}
                            onClick={() => handleSlotChange(s)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${slot === s
                                    ? s === 'morning' ? 'bg-orange-50 text-orange-700 border-orange-200'
                                        : s === 'evening' ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-gray-900 text-white border-gray-900'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {s === 'all' ? 'All Slots' : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            )}

            {/* Sub-Filters: Custom Date Range */}
            {filterType === 'custom' && (
                <div className="flex items-end gap-4 bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-700">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-3 py-2 text-sm bg-white"
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-700">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-3 py-2 text-sm bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => applyFilters()}
                            className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
                        >
                            Apply Range
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
