import Image from "next/image";
import Link from "next/link";
import { getInventoryItems } from "@/app/admin/actions/categories";
import { InventoryRow } from "@/components/admin/inventory-row";
import { Button } from "@/components/ui/button";

export default async function AdminInventoryPage() {
  const products = await getInventoryItems();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Inventory</h1>
        <p className="mt-1 text-zinc-600">Track stock levels and SKUs.</p>
      </div>

      {products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-zinc-300 bg-white p-12 text-center">
          <p className="text-zinc-600">No products in catalog yet.</p>
          <Link href="/admin/products/new" className="mt-4 inline-block">
            <Button>Add a product</Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-600">Product</th>
                <th className="px-4 py-3 font-medium text-zinc-600">SKU</th>
                <th className="px-4 py-3 font-medium text-zinc-600">
                  Quantity
                </th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => {
                const image = product.images[0];
                const quantity = product.inventory?.quantity ?? 0;

                return (
                  <tr key={product.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-8 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : null}
                        </div>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="font-medium text-zinc-900 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <InventoryRow
                      productId={product.id}
                      sku={product.inventory?.sku ?? ""}
                      quantity={quantity}
                    />
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
