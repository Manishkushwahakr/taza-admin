import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: userRole, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  const role = userRole?.role

  if (role === 'admin') {
    redirect('/admin')
  } else if (role === 'seller') {
    redirect('/seller')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">You do not have permission to access this portal.</p>
        <div className="mt-4 rounded-md bg-white p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 font-mono">User ID: {user.id}</p>
          <p className="text-sm text-gray-500 font-mono">Role: {role || 'None'}</p>
          {error && (
            <div className="mt-2 text-xs text-red-500 bg-red-50 p-2 rounded">
              <p>Error Code: {error.code}</p>
              <p>Error Message: {error.message}</p>
              <p>Details: {error.details}</p>
            </div>
          )}
        </div>
        <form action="/auth/signout" method="post" className="mt-8">
          <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
