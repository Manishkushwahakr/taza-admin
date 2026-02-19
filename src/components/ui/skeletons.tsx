import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-8 w-[100px]" />
            </div>
            <div className="rounded-md border">
                <div className="h-12 border-b bg-muted/50 px-4 flex items-center">
                    <Skeleton className="h-4 w-[100px]" />
                </div>
                <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between space-x-4">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export function FormSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
            </div>
            <div className="space-y-4 border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-10 w-[150px]" />
            </div>
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 len:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-[400px] rounded-xl" />
                <Skeleton className="col-span-3 h-[400px] rounded-xl" />
            </div>
        </div>
    )
}
