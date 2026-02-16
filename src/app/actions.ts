'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateOrderStatus(orderId: string, newStatus: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

    if (error) throw error

    revalidatePath('/admin/orders')
    revalidatePath('/seller/orders')
}

export async function updateUserRole(userId: string, newRole: string) {
    const supabase = await createClient()

    // 1. Check if role entry exists
    const { data: existing } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single()

    if (existing) {
        // Update
        const { error } = await supabase
            .from('user_roles')
            .update({ role: newRole })
            .eq('user_id', userId)
        if (error) throw error
    } else {
        // Insert
        const { error } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role: newRole })
        if (error) throw error
    }

    revalidatePath('/admin/users')
}
