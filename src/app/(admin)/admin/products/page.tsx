import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Edit2, Trash2, Filter, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function AdminProductsPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const supabase = await createClient()
    const { q, category } = await searchParams

    // Fetch categories for filter
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name')
        .order('name')

    // Base query
    let query = supabase
        .from('products')
        .select(`
            *,
            product_categories!inner (
                category_id,
                categories (name)
            )
        `, { count: 'exact' })

    // Apply Filters
    if (q) {
        query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
    }

    if (category) {
        query = query.eq('product_categories.category_id', category)
    }

    const { data: products, error } = await query.order('created_at', { ascending: false })

    async function deleteProduct(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const supabase = await createClient()
        await supabase.from('products').delete().eq('id', id)
        revalidatePath('/admin/products')
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Product Catalog</h1>
                    <p className="text-slate-500 text-sm">Manage {products?.length || 0} products across all categories.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <form method="GET" className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                        <input
                            name="q"
                            defaultValue={q}
                            placeholder="Search by name or brand..."
                            className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <select
                                name="category"
                                defaultValue={category}
                                className="h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm appearance-none focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                            >
                                <option value="">All Categories</option>
                                {categories?.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="h-11 rounded-xl bg-blue-600 px-6 font-bold text-white shadow-lg shadow-blue-600/10 transition-all hover:bg-blue-700 active:scale-95">
                            Apply
                        </button>
                        {(q || category) && (
                            <Link
                                href="/admin/products"
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                            >
                                Clear
                            </Link>
                        )}
                    </div>
                </form>
            </div>

            {/* Product Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Product Information</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Pricing</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Inventory</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
                                <th className="px-6 py-4 font-bold uppercase tracking-wider text-[10px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="rounded-full bg-slate-50 p-4">
                                                <ShoppingBag className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <div className="font-bold text-slate-900 text-lg">No products found</div>
                                            <p className="text-slate-500 max-w-xs text-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products?.map((product: any) => (
                                    <tr key={product.id} className="transition-colors hover:bg-slate-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                                                            <ShoppingBag className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="truncate font-bold text-slate-900">{product.name}</div>
                                                    <div className="text-xs font-semibold text-slate-500">{product.brand || 'Global Brand'} • {product.unit}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1.5">
                                                {product.product_categories?.map((pc: any) => (
                                                    <span key={pc.category_id} className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-tighter">
                                                        {pc.categories?.name}
                                                    </span>
                                                )) || <span className="text-slate-400 text-xs">Uncategorized</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">₹{product.price_selling || product.price}</div>
                                            <div className="text-[10px] font-bold text-slate-300 line-through uppercase">MRP ₹{product.price_mrp}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-bold text-slate-900">{product.stock ?? '∞'}</div>
                                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className={`h-full ${product.stock > 50 ? 'bg-emerald-500' : product.stock > 10 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.in_stock ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 uppercase">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                    Live
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[10px] font-bold text-red-700 uppercase">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                                                    Out
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 transition-all hover:border-blue-200 hover:text-blue-600 hover:shadow-sm active:scale-95"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteProduct}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 transition-all hover:border-red-200 hover:text-red-600 hover:shadow-sm active:scale-95">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
