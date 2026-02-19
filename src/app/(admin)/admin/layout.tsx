import { AdminSidebar } from '@/components/admin-sidebar'
import { TopNavbar } from '@/components/admin/top-navbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
                <TopNavbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
