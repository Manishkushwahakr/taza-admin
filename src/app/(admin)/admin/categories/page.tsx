import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Tag } from 'lucide-react'
import { revalidatePath } from 'next/cache'

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
        // Basic slug generation, ideally use a library or proper sanitization

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            </div>

            {/* Add Category Form */}
            <div className="rounded-md border bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-lg font-medium">Add New Category</h2>
                <form action={addCategory} className="flex gap-4 items-end">
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
                        <input required name="name" id="name" placeholder="e.g. Fruits & Veg" className="rounded-md border p-2 text-sm w-64" />
                    </div>
                    <button className="flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </button>
                </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((category) => (
                    <div key={category.id} className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                <Tag className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="font-medium">{category.name}</div>
                                <div className="text-xs text-gray-500">/{category.slug}</div>
                            </div>
                        </div>
                        <form action={deleteCategory.bind(null, category.id)}>
                            <button className="text-gray-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </form>
                    </div>
                ))}
                {categories?.length === 0 && (
                    <div className="col-span-full p-8 text-center text-gray-500">
                        No categories found. Add one above.
                    </div>
                )}
            </div>
        </div>
    )
}
