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

export async function getUserDetails(userId: string) {
    const supabase = await createClient()

    // 1. Fetch Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('user_id, name, phone, created_at')
        .eq('user_id', userId)
        .single()

    // 2. Fetch Addresses
    const { data: addresses } = await supabase
        .from('addresses')
        .select('id, type, address_line, city, state, pincode, is_default')
        .eq('user_id', userId)

    // 3. Fetch Recent Orders
    const { data: orders } = await supabase
        .from('orders')
        .select(`
            id,
            order_number,
            status,
            total_amount,
            created_at,
            order_items (
                id,
                quantity,
                price_at_time,
                products (name, image_url)
            )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5)

    return { profile, addresses, orders }
}
