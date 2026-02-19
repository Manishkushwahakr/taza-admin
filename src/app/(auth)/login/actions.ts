'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not authenticate user')
    }

    await handleRedirect(supabase)
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        redirect('/login?error=Could not create user')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function sendOTP(formData: FormData) {
    const supabase = await createClient()
    const phone = formData.get('phone') as string

    // Format phone number if needed (e.g., ensure country code)
    // Assuming input is full international format or just 10 digits to append +91
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`

    const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
    })

    if (error) {
        console.error('OTP Send Error:', error)
        return { error: error.message }
    }

    return { success: true, phone: formattedPhone }
}

export async function verifyOTP(phone: string, token: string) {
    const supabase = await createClient()

    const { data: { session, user }, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    })

    if (error) {
        return { error: error.message }
    }

    if (user) {
        await handleRedirect(supabase, user)
    } else {
        return { error: 'Verification succeeded but user session not found.' }
    }
}

async function handleRedirect(supabase: any, user?: any) {
    const targetUser = user || (await supabase.auth.getUser()).data.user

    if (targetUser) {
        const { data: userRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', targetUser.id)
            .single()

        const role = userRole?.role

        revalidatePath('/', 'layout')

        if (role === 'admin') {
            redirect('/admin')
        } else if (role === 'seller') {
            redirect('/seller')
        } else {
            redirect('/')
        }
    } else {
        redirect('/')
    }
}
