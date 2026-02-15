import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut } from 'lucide-react'

export function SellerSidebar() {
    return (
        <div className="flex h-screen w-64 flex-col border-r bg-white">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-xl font-bold text-gray-900">Seller Panel</span>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                <Link
                    href="/seller"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Dashboard
                </Link>
                <Link
                    href="/seller/products"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <Package className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Products
                </Link>
                <Link
                    href="/seller/orders"
                    className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                    <ShoppingBag className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900" />
                    Orders
                </Link>
                <Link
                    href="/seller/settings"
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
