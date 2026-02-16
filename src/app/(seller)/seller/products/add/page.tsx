import { createClient } from '@/utils/supabase/server'
import { Plus, Search, Package } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function AddProductPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const supabase = await createClient()
    const params = await searchParams
    const query = params.q || ''

    // 1. Get Current Seller
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Please log in.</div>

    const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!seller) return <div>Seller account not found.</div>

    // 2. Search Products (if query exists)
    let products: any[] = []
    if (query) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(20)
        products = data || []
    }

    // Action to add product
    async function addProduct(formData: FormData) {
        'use server'
        const productId = formData.get('productId') as string
        const price = formData.get('price') as string
        const sellerId = formData.get('sellerId') as string

        const supabase = await createClient()

        // Check if already exists
        const { data: existing } = await supabase
            .from('seller_specific_prices')
            .select('id')
            .eq('seller_id', sellerId)
            .eq('product_id', productId)
            .single()

        if (existing) {
            // Handle error or just redirect
            redirect('/seller/products?error=Product already added')
        }

        await supabase.from('seller_specific_prices').insert({
            seller_id: sellerId,
            product_id: productId,
            price: parseFloat(price)
        })

        revalidatePath('/seller/products')
        redirect('/seller/products')
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add to Inventory</h1>
                <p className="text-slate-500">Search for products from the global catalog and set your selling price.</p>
            </div>

            {/* Search Form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <form method="get" className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                        <input
                            name="q"
                            defaultValue={query}
                            placeholder="Type product name, brand or category..."
                            className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-medium transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                        />
                    </div>
                    <button className="h-12 rounded-xl bg-slate-900 px-8 font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95">
                        Search Catalog
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Product Details</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Market Price</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-center">Add to Inventory</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">
                                        {query ? 'No matching products found.' : 'Use the search bar above to look for products.'}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="transition-colors hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{product.name}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                        <span>{product.unit}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                        <span>{product.brand || 'Global Brand'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-500">
                                            ₹{product.price_mrp}
                                        </td>
                                        <td className="px-6 py-4">
                                            <form action={addProduct} className="mx-auto flex max-w-[200px] items-center gap-2">
                                                <input type="hidden" name="productId" value={product.id} />
                                                <input type="hidden" name="sellerId" value={seller.id} />
                                                <div className="relative flex-1">
                                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                                                    <input
                                                        name="price"
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="Your Price"
                                                        required
                                                        className="h-10 w-full rounded-xl border border-slate-200 pl-6 pr-2 text-sm font-semibold text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                                                    />
                                                </div>
                                                <button className="flex h-10 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95">
                                                    <Plus className="h-3.5 w-3.5" /> Add
                                                </button>
                                            </form>
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
