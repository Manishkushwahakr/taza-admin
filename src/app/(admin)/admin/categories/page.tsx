import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Tag, ChevronRight } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function CategoriesPage() {
    const supabase = await createClient()

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    async function addCategory(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const slug = name.toLowerCase().replace(/ /g, '-')

        const supabase = await createClient()
        await supabase.from('categories').insert({ name, slug })
        revalidatePath('/admin/categories')
    }

    async function deleteCategory(id: string) {
        'use server'
        const supabase = await createClient()
        await supabase.from('categories').delete().eq('id', id)
        revalidatePath('/admin/categories')
    }

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Categories</h1>
                <p className="text-slate-500">Organize your products into logical groups for better discoverability.</p>
            </div>

            {/* Add Category Form */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-slate-900">Add New Category</h2>
                <form action={addCategory} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="grid flex-1 gap-2">
                        <label htmlFor="name" className="text-sm font-semibold text-slate-700">Category Name</label>
                        <input
                            required
                            name="name"
                            id="name"
                            placeholder="e.g. Fruits & Veg"
                            className="h-11 rounded-xl border border-slate-200 px-4 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>
                    <button className="flex h-11 items-center justify-center rounded-xl bg-slate-900 px-6 font-semibold text-white transition-all hover:bg-slate-800 active:scale-95">
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category) => (
                    <div key={category.id} className="group relative flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md">
                        <Link
                            href={`/admin/products?category=${category.id}`}
                            className="flex flex-1 items-center gap-4 focus:outline-none"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                <Tag className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-bold text-slate-900">{category.name}</div>
                                <div className="text-xs font-medium text-slate-400">/{category.slug}</div>
                            </div>
                            <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-500" />
                        </Link>

                        <div className="ml-4 flex items-center border-l border-slate-100 pl-4">
                            <form action={deleteCategory.bind(null, category.id)}>
                                <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {categories?.length === 0 && (
                    <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
                        No categories found. Start by adding one to organize your inventory.
                    </div>
                )}
            </div>
        </div>
    )
}
