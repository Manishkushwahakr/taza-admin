'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function OrderFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [startDate, setStartDate] = useState(searchParams.get('start_date') || '')
    const [endDate, setEndDate] = useState(searchParams.get('end_date') || '')

    const handleFilter = () => {
        const params = new URLSearchParams(searchParams)
        if (startDate) params.set('start_date', startDate)
        else params.delete('start_date')

        if (endDate) params.set('end_date', endDate)
        else params.delete('end_date')

        router.push(`/admin/orders?${params.toString()}`)
    }

    const handleReset = () => {
        setStartDate('')
        setEndDate('')
        router.push('/admin/orders')
    }

    return (
        <div className="flex items-end gap-4 bg-gray-50 p-4 rounded-md border text-sm">
            <div className="flex flex-col gap-1.5">
                <label className="font-medium text-gray-700">Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded px-3 py-2 bg-white"
                />
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="font-medium text-gray-700">End Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded px-3 py-2 bg-white"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={handleFilter}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
                >
                    Filter
                </button>
                <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-white border rounded hover:bg-gray-50 text-gray-700"
                >
                    Reset
                </button>
            </div>
        </div>
    )
}
