'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, Users, Settings, LogOut, MapPin, Tag, MessageSquare, Phone, DollarSign, ShoppingBag, Package } from 'lucide-react'
import { useSidebar } from '@/contexts/sidebar-context'

export function AdminSidebar() {
    const { isExpanded, isMobileOpen, closeMobileSidebar } = useSidebar()
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Sellers', href: '/admin/sellers', icon: Store },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Delivery Boys', href: '/admin/delivery-boys', icon: Users },
        { name: 'Areas', href: '/admin/areas', icon: MapPin },
        { name: 'Categories', href: '/admin/categories', icon: Tag },
        { name: 'Support', href: '/admin/support', icon: MessageSquare },
        { name: 'Callbacks', href: '/admin/callbacks', icon: Phone },
        { name: 'Revenue', href: '/admin/payouts', icon: DollarSign },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={closeMobileSidebar}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
                ${isExpanded ? 'w-[250px]' : 'w-[70px]'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className={`flex h-16 items-center border-b border-gray-100 ${isExpanded ? 'px-6' : 'justify-center'}`}>
                    {isExpanded ? (
                        <span className="text-xl font-bold text-gray-900 truncate">Admin Panel</span>
                    ) : (
                        <span className="text-xl font-bold text-green-600">AP</span>
                    )}
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <div key={item.name} className="relative group">
                                <Link
                                    href={item.href}
                                    onClick={() => { if (isMobileOpen) closeMobileSidebar() }}
                                    className={`
                                        flex items-center rounded-lg transition-all duration-200
                                        ${isExpanded ? 'px-3 py-2.5' : 'justify-center p-3'}
                                        ${isActive
                                            ? 'bg-green-50 text-green-700 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-green-600 font-medium'
                                        }
                                    `}
                                >
                                    <Icon className={`
                                        flex-shrink-0 transition-colors duration-200
                                        ${isExpanded ? 'mr-3 h-5 w-5' : 'h-6 w-6'}
                                        ${isActive ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}
                                    `} />

                                    {isExpanded && (
                                        <span className="truncate text-sm">{item.name}</span>
                                    )}
                                </Link>

                                {/* Tooltip for collapsed state */}
                                {!isExpanded && (
                                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                        {item.name}
                                        {/* Tooltip Arrow */}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                <div className="border-t border-gray-100 p-4">
                    <form action="/auth/signout" method="post" className="relative group">
                        <button className={`
                            flex w-full items-center rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-medium
                            ${isExpanded ? 'px-3 py-2.5' : 'justify-center p-3'}
                        `}>
                            <LogOut className={`
                                flex-shrink-0 transition-colors duration-200
                                ${isExpanded ? 'mr-3 h-5 w-5' : 'h-6 w-6'}
                                text-red-500 group-hover:text-red-600
                            `} />

                            {isExpanded && (
                                <span className="truncate text-sm">Sign Out</span>
                            )}
                        </button>

                        {/* Tooltip for Sign Out in collapsed state */}
                        {!isExpanded && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg">
                                Sign Out
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    )
}
