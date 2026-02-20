import { AdminSidebar } from '@/components/admin-sidebar'
import { TopNavbar } from '@/components/admin/top-navbar'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { AdminLayoutWrapper } from '@/components/admin/admin-layout-wrapper'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <AdminLayoutWrapper>
                <TopNavbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </AdminLayoutWrapper>
        </SidebarProvider>
    )
}
