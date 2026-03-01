'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/browse')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const university_id = formData.get('university_id') as string

  // 1. Verify school email domain
  const domain = email.split('@')[1]
  if (!domain || !domain.endsWith('.edu.ng')) {
    return { error: 'Please use your university email address.' }
  }

  // 2. Auth Signup
  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        university_id,
      }
    }
  })

  if (authError) {
    return { error: authError.message }
  }

  // Profile creation is now handled by the database trigger `on_auth_user_created`
  // mapping data from raw_user_meta_data.

  revalidatePath('/', 'layout')
  redirect('/browse')
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  // Note: Assumes NEXT_PUBLIC_SITE_URL is set, otherwise fallback to request origin
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: 'Password reset link sent to your email' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/browse')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
