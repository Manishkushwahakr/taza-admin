import { createClient } from '@/utils/supabase/server'
import { Plus, Search } from 'lucide-react'
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>

            {/* Search Form */}
            <form method="get" className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        name="q"
                        defaultValue={query}
                        placeholder="Search global product catalog..."
                        className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                    />
                </div>
                <button className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800">
                    Search
                </button>
            </form>

            {/* Results */}
            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">MRP</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-gray-500">
                                        {query ? 'No products found.' : 'Search for products to add to your inventory.'}
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b transition-colors hover:bg-gray-50">
                                        <td className="p-4 align-middle">
                                            <div className="font-medium text-gray-900">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.unit}</div>
                                        </td>
                                        <td className="p-4 align-middle">₹{product.price_mrp}</td>
                                        <td className="p-4 align-middle">
                                            <form action={addProduct} className="flex gap-2">
                                                <input type="hidden" name="productId" value={product.id} />
                                                <input type="hidden" name="sellerId" value={seller.id} />
                                                <input
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Your Price"
                                                    required
                                                    className="w-24 rounded-md border border-gray-300 py-1 px-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <button className="flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700">
                                                    <Plus className="mr-1 h-3 w-3" /> Add
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
