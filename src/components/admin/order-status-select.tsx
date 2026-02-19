'use client'

import { updateOrderStatus } from '@/app/actions'
import { useState } from 'react'

export function OrderStatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus)
    const [loading, setLoading] = useState(false)

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value
        setStatus(newStatus)
        setLoading(true)
        try {
            await updateOrderStatus(orderId, newStatus)
        } catch (error) {
            console.error('Failed to update status', error)
            setStatus(currentStatus) // Revert on error
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'processing': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'shipped': return 'text-purple-600 bg-purple-50 border-purple-200'
            case 'delivered': return 'text-green-600 bg-green-50 border-green-200'
            case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    return (
        <div className="relative">
            <select
                value={status}
                onChange={handleChange}
                disabled={loading}
                className={`
                    appearance-none w-full px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-green-400
                    ${getStatusColor(status)}
                    ${loading ? 'opacity-50 cursor-wait' : ''}
                `}
            >
                <option value="confirmed">CONFIRMED</option>
                <option value="processing">PROCESSING</option>
                <option value="shipped">SHIPPED</option>
                <option value="delivered">DELIVERED</option>
                <option value="cancelled">CANCELLED</option>
            </select>
        </div>
    )
}
