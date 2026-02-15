import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function SellerProductsPage() {
    const supabase = await createClient()

    // 1. Get Current User & Seller ID
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return <div>Please log in.</div>

    const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!seller) return <div>Seller account not found.</div>

    // 2. Fetch Seller's Products (via seller_specific_prices)
    const { data: sellerProducts } = await supabase
        .from('seller_specific_prices')
        .select(`
        id,
        price,
        products (
            id,
            name,
            image_url,
            unit,
            price_mrp
        )
    `)
        .eq('seller_id', seller.id)
        .order('updated_at', { ascending: false })

    // Action to update price
    async function updatePrice(formData: FormData) {
        'use server'
        const priceId = formData.get('id') as string
        const newPrice = formData.get('price') as string

        const supabase = await createClient()
        await supabase.from('seller_specific_prices').update({ price: parseFloat(newPrice) }).eq('id', priceId)
        revalidatePath('/seller/products')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
                <Link href="/seller/products/add" className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Link>
            </div>

            <div className="rounded-md border bg-white shadow-sm">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="bg-gray-50 [&_tr]:border-b">
                            <tr className="border-b transition-colors text-gray-500">
                                <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">MRP</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Your Price</th>
                                <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {sellerProducts?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        You haven't added any products yet.
                                    </td>
                                </tr>
                            )}
                            {sellerProducts?.map((item: any) => (
                                <tr key={item.id} className="border-b transition-colors hover:bg-gray-50">
                                    <td className="p-4 align-middle">
                                        <div className="font-medium text-gray-900">{item.products?.name}</div>
                                        <div className="text-xs text-gray-500">{item.products?.unit}</div>
                                    </td>
                                    <td className="p-4 align-middle text-gray-500">
                                        ₹{item.products?.price_mrp}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <form action={updatePrice} className="flex items-center gap-2">
                                            <input type="hidden" name="id" value={item.id} />
                                            <div className="relative">
                                                <span className="absolute left-2 top-1.5 text-gray-500">₹</span>
                                                <input
                                                    name="price"
                                                    defaultValue={item.price}
                                                    type="number"
                                                    step="0.01"
                                                    className="w-24 rounded-md border border-gray-300 py-1 pl-6 pr-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                            </div>
                                            <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                                Save
                                            </button>
                                        </form>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
