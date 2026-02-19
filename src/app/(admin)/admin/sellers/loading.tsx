import { TableSkeleton } from "@/components/ui/skeletons"

export default function Loading() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-8 w-32 rounded-lg bg-slate-100 animate-pulse" />
            </div>
            <TableSkeleton />
        </div>
    )
}
