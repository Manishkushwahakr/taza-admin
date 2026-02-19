import Link from 'next/link'

export default function AccessDenied() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-4 text-lg text-gray-700">
                    You do not have the required permissions to view this page.
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    If you believe this is an error, please contact the administrator.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        href="/"
                        className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg"
                    >
                        Go Home
                    </Link>
                    <form action="/auth/signout" method="post">
                        <button className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
