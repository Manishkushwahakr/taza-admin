import Link from 'next/link'
import { LayoutDashboard, Store, Users, Settings, LogOut, MapPin, Tag, MessageSquare, Phone, DollarSign, ShoppingBag } from 'lucide-react'

export function AdminSidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                <Link
                    href="/admin"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/sellers"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Store className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Sellers
                </Link>
                <Link
                    href="/admin/orders"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Orders
                </Link>
                <Link
                    href="/admin/users"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Users className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Users
                </Link>
                <Link
                    href="/admin/areas"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <MapPin className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Areas
                </Link>
                <Link
                    href="/admin/categories"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Tag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Categories
                </Link>
                <Link
                    href="/admin/support"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <MessageSquare className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Support
                </Link>
                <Link
                    href="/admin/callbacks"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Phone className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Callbacks
                </Link>
                <Link
                    href="/admin/payouts"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <DollarSign className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Payouts
                </Link>
                <Link
                    href="/admin/settings"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Settings className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Settings
                </Link>
            </nav>
            <div className="border-t p-4">
                <form action="/auth/signout" method="post">
                    <button className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    )
}
