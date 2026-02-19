import Link from 'next/link'
import { LayoutDashboard, Store, Users, Settings, LogOut, MapPin, Tag, MessageSquare, Phone, DollarSign, ShoppingBag, Package } from 'lucide-react'

export function AdminSidebar() {
    return (
        <div className="hidden border-r bg-white md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-50">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                <Link
                    href="/admin"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/sellers"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Store className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Sellers
                </Link>
                <Link
                    href="/admin/products"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Package className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Products
                </Link>
                <Link
                    href="/admin/orders"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <ShoppingBag className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Orders
                </Link>
                <Link
                    href="/admin/users"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Users
                </Link>
                <Link
                    href="/admin/delivery-boys"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Users className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Delivery Boys
                </Link>
                <Link
                    href="/admin/areas"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <MapPin className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Areas
                </Link>
                <Link
                    href="/admin/categories"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Tag className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Categories
                </Link>
                <Link
                    href="/admin/support"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <MessageSquare className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Support
                </Link>
                <Link
                    href="/admin/callbacks"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Phone className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Callbacks
                </Link>
                <Link
                    href="/admin/payouts"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <DollarSign className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
                    Revenue
                </Link>
                <Link
                    href="/admin/settings"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-all"
                >
                    <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-green-600" />
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
