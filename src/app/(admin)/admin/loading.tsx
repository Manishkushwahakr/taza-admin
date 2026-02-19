import { DashboardSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
    return (
        <div className="p-6">
            <div className="mb-6 space-y-2">
                <div className="h-8 w-48 rounded-lg bg-slate-100 animate-pulse" />
                <div className="h-4 w-96 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <DashboardSkeleton />
        </div>
    )
}
