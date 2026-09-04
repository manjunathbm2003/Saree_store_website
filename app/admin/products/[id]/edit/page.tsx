import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteProduct,
  getProductForEdit,
  updateProduct,
} from "@/app/admin/actions/products";
import { getCategories } from "@/app/admin/actions/categories";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImages } from "@/components/admin/product-images";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getCategories(),
  ]);

  if (!product) notFound();

  const updateAction = updateProduct.bind(null, id);
  const deleteAction = deleteProduct.bind(null, id);

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
          Edit product
        </h1>
        <p className="mt-1 text-zinc-600">{product.name}</p>
      </div>

      <ProductImages images={product.images} productId={product.id} />

      <div className="mt-6">
        <ProductForm
          categories={categories}
          action={updateAction}
          deleteAction={deleteAction}
          defaultValues={{
            name: product.name,
            slug: product.slug,
            description: product.description ?? "",
            price: product.price,
            compareAt: product.compareAt,
            categoryId: product.categoryId,
            isActive: product.isActive,
            quantity: product.inventory?.quantity ?? 0,
            sku: product.inventory?.sku ?? "",
          }}
        />
      </div>
    </div>
  );
}
