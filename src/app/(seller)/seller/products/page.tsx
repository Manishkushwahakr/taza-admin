import { createClient } from '@/utils/supabase/server'
import { Plus, Package } from 'lucide-react'
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
                price_mrp,
                categories,
                is_seller_editable
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
        <div className="space-y-8 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Inventory</h1>
                    <p className="text-slate-500">Manage prices for your assigned products. You can only edit Vegetables and authorized items.</p>
                </div>
                <Link
                    href="/seller/products/add"
                    className="flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-slate-100 bg-slate-50/50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs">Product</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">MRP</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-center">Your Price</th>
                                <th className="px-6 py-4 font-semibold uppercase tracking-wider text-xs text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sellerProducts?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                                        No products in your inventory. Search and add products to start selling!
                                    </td>
                                </tr>
                            )}
                            {sellerProducts?.map((item: any) => {
                                const prod = item.products
                                const isVeg = prod?.categories?.toLowerCase().includes('veg')
                                const canEdit = prod?.is_seller_editable || isVeg

                                return (
                                    <tr key={item.id} className="transition-colors hover:bg-slate-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 p-1 flex items-center justify-center">
                                                    {prod?.image_url ? (
                                                        <img src={prod.image_url} alt={prod.name} className="h-full w-full object-cover rounded-md" />
                                                    ) : (
                                                        <Package className="h-5 w-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{prod?.name}</div>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span>{prod?.unit}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                        <span className={isVeg ? 'text-emerald-600 font-medium' : ''}>{prod?.categories}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-slate-500">
                                            ₹{prod?.price_mrp}
                                        </td>
                                        <td className="px-6 py-4">
                                            {canEdit ? (
                                                <form action={updatePrice} className="mx-auto flex max-w-[140px] items-center gap-2">
                                                    <input type="hidden" name="id" value={item.id} />
                                                    <div className="relative flex-1">
                                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">₹</span>
                                                        <input
                                                            name="price"
                                                            defaultValue={item.price}
                                                            type="number"
                                                            step="0.01"
                                                            className="h-9 w-full rounded-lg border border-slate-200 pl-6 pr-2 text-sm font-semibold text-slate-900 transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                                                        />
                                                    </div>
                                                    <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-700">
                                                        Save
                                                    </button>
                                                </form>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2 text-slate-400">
                                                    <span className="text-sm font-bold italic">₹{item.price}</span>
                                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px]">🔒</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {canEdit ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                                    Editable
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                                    Restricted
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
