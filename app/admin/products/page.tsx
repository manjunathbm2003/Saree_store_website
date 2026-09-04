import Image from "next/image";
import Link from "next/link";
import {
  getAdminProducts,
  toggleProductActive,
} from "@/app/admin/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
          <p className="mt-1 text-zinc-600">
            Manage catalog, pricing, and images.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-zinc-600">No products yet.</p>
          <Link href="/admin/products/new" className="mt-4 inline-block">
            <Button>Add your first product</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Product</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Category</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Price</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Stock</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => {
                const image = product.images[0];
                return (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                              —
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {product.name}
                          </p>
                          <p className="text-xs text-zinc-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {product.category.name}
                    </td>
                    <td className="px-4 py-3 font-medium text-zinc-900">
                      {formatINR(product.price)}
                    </td>
                    <td className="px-4 py-3 text-zinc-600">
                      {product.inventory?.quantity ?? 0}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={product.isActive ? "success" : "default"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-sm text-zinc-600 hover:text-zinc-900"
                        >
                          Edit
                        </Link>
                        <form
                          action={toggleProductActive.bind(
                            null,
                            product.id,
                            !product.isActive,
                          )}
                        >
                          <button
                            type="submit"
                            className="text-sm text-zinc-500 hover:text-zinc-900"
                          >
                            {product.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
