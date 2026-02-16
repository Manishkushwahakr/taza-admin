export default function AdminOrdersLoading() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
                <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            </div>

            {/* Filter Skeleton */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 h-16 w-full"></div>

            {/* Table Skeleton */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="h-12 bg-slate-50 border-b border-slate-200"></div>
                <div className="p-0">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-16 border-b border-slate-100 px-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-slate-100 rounded-xl"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-24 bg-slate-100 rounded"></div>
                                    <div className="h-3 w-16 bg-slate-50 rounded"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-slate-100 rounded"></div>
                                <div className="h-3 w-20 bg-slate-50 rounded"></div>
                            </div>
                            <div className="h-8 w-24 bg-slate-100 rounded-lg"></div>
                        </div>
                    ))}
                </div>
                <div className="h-14 bg-slate-50/50 flex items-center justify-between px-6">
                    <div className="h-4 w-40 bg-slate-100 rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
                        <div className="h-8 w-20 bg-slate-100 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
