import Link from "next/link";
import { createProduct } from "@/app/admin/actions/products";
import { getCategories } from "@/app/admin/actions/categories";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await getCategories();

  if (categories.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Add product</h1>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6">
          <p className="text-amber-800">
            You need at least one category before adding products.
          </p>
          <Link
            href="/admin/categories"
            className="mt-3 inline-block text-sm font-medium text-amber-900 underline"
          >
            Create a category →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Back to products
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Add product
        </h1>
      </div>

      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
