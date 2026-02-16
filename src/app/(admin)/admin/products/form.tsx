'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Product, Category } from '@/types'
import { Save, X, Loader2, Upload } from 'lucide-react'

interface ProductFormProps {
    product?: Product
    categories: Category[]
    mode: 'create' | 'edit'
}

export function ProductForm({ product, categories, mode }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<Partial<Product>>(product || {
        name: '',
        unit: '1 kg',
        in_stock: true,
        price_mrp: 0,
        price_selling: 0,
        stock: 0,
        is_seller_editable: false,
        categories: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        const supabase = createClient()

        try {
            if (mode === 'create') {
                const { error } = await supabase
                    .from('products')
                    .insert([formData])
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', product?.id)
                if (error) throw error
            }
            router.push('/admin/products')
            router.refresh()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Product Details</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Product Name</label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="e.g. Fresh Tomatoes"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Brand (Optional)</label>
                                <input
                                    value={formData.brand || ''}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="e.g. Taza Farms"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Unit</label>
                                <input
                                    required
                                    value={formData.unit}
                                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="e.g. 1 kg, 500 g"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Barcode</label>
                                <input
                                    value={formData.barcode || ''}
                                    onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    placeholder="000000000000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Description</label>
                            <textarea
                                rows={4}
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="Describe the quality, benefits, and origin of the product..."
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Pricing & Inventory</h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">MRP (₹)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price_mrp}
                                    onChange={e => setFormData({ ...formData, price_mrp: parseFloat(e.target.value) })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Selling Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price_selling}
                                    onChange={e => setFormData({ ...formData, price_selling: parseFloat(e.target.value) })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Stock Count</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Profit Margin (%)</label>
                                <input
                                    type="number"
                                    value={formData.profit_margin_percent}
                                    onChange={e => setFormData({ ...formData, profit_margin_percent: parseFloat(e.target.value) })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Tax Percent (%)</label>
                                <input
                                    type="number"
                                    value={formData.tax_percent}
                                    onChange={e => setFormData({ ...formData, tax_percent: parseFloat(e.target.value) })}
                                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Organization</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Status</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.in_stock}
                                    onChange={e => setFormData({ ...formData, in_stock: e.target.checked })}
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-600 font-medium">Available in Stock</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Seller Editable</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.is_seller_editable}
                                    onChange={e => setFormData({ ...formData, is_seller_editable: e.target.checked })}
                                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-600 font-medium">Sellers can edit this product</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-semibold text-slate-700">Primary Category</label>
                            <input
                                value={formData.categories}
                                onChange={e => setFormData({ ...formData, categories: e.target.value })}
                                className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                                placeholder="Category text tag"
                            />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Media</h2>
                        <div className="aspect-square w-full rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 text-center space-y-2 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                            {formData.image_url ? (
                                <div className="relative w-full h-full group">
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image_url: '' })}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <Upload className="h-6 h-6" />
                                    </div>
                                    <div className="text-xs font-medium text-slate-500">
                                        <span className="text-blue-600">Click to upload</span> or drag and drop image
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Or paste image URL"
                                        className="mt-2 w-full text-xs border-b border-slate-100 focus:outline-none focus:border-blue-500"
                                        onBlur={e => setFormData({ ...formData, image_url: e.target.value })}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            disabled={loading}
                            type="submit"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-slate-900 font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            {mode === 'create' ? 'Publish Product' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="h-12 rounded-xl border border-slate-200 font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
