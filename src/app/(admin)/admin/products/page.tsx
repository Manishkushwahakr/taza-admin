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
            product_categories (
                category_id,
                categories (name)
            )
        `)

    if (q) {
        query = query.ilike('name', `%${q}%`)
    }

    if (category) {
        // This is a bit complex in Supabase with nested filters, 
        // often better to filter by specific join or use a rpc/view if needed.
        // For simplicity in this demo, let's assume we can filter products that have a link to this category.
        // In a real scenario, you might want a specialized query.
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
                    <p className="text-slate-500">Manage your entire product inventory across all categories.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add New Product
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <form className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        name="q"
                        defaultValue={q}
                        placeholder="Search products by name or brand..."
                        className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    />
                </form>

                <div className="flex items-center gap-3">
                    <Filter className="h-4 w-4 text-slate-400" />
                    <select
                        name="category"
                        defaultValue={category}
                        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                    >
                        <option value="">All Categories</option>
                        {categories?.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Pricing (MRP/Sell)</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products?.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No products found. Start by adding one!
                                    </td>
                                </tr>
                            ) : (
                                products?.map((product: any) => (
                                    <tr key={product.id} className="transition-colors hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded-lg object-cover border border-slate-100" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <ShoppingBag className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-slate-900">{product.name}</div>
                                                    <div className="text-xs text-slate-500">{product.brand || 'No Brand'} • {product.unit}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {product.product_categories?.map((pc: any) => (
                                                    <span key={pc.category_id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                                                        {pc.categories?.name}
                                                    </span>
                                                )) || <span className="text-slate-400 text-xs">Uncategorized</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 font-medium">₹{product.price_selling || product.price}</div>
                                            <div className="text-xs text-slate-400 line-through">₹{product.price_mrp}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-900 font-medium">{product.stock ?? '∞'}</div>
                                            <div className="text-xs text-slate-500">items left</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {product.in_stock ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                    In Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                                <form action={deleteProduct}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
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
