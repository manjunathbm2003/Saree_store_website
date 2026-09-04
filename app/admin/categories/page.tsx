import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/app/admin/actions/categories";
import { CategoryForm } from "@/components/admin/category-form";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Categories</h1>
        <p className="mt-1 text-zinc-600">
          Organize your sarees into collections.
        </p>
      </div>

      <div className="mt-6">
        <CategoryForm action={createCategory} />
      </div>

      {categories.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Name</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Slug</th>
                <th className="px-4 py-3 font-medium text-zinc-600">
                  Products
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">
                    {category.name}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">{category.slug}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {category._count.products}
                  </td>
                  <td className="px-4 py-3">
                    {category._count.products === 0 ? (
                      <form
                        action={deleteCategory.bind(null, category.id)}
                      >
                        <button
                          type="submit"
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </form>
                    ) : (
                      <span className="text-xs text-zinc-400">In use</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
