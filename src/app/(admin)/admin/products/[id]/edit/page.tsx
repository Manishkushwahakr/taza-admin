import { createClient } from '@/utils/supabase/server'
import { ProductForm } from '../../form'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch product data
    const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (!product) {
        notFound()
    }

    // Fetch categories for the form
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/products"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-all hover:bg-slate-50 hover:text-slate-600 active:scale-95"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Product</h1>
                    <p className="text-slate-500 text-sm">Update details for "{product.name}".</p>
                </div>
            </div>

            <ProductForm
                product={product}
                categories={categories || []}
                mode="edit"
            />
        </div>
    )
}
