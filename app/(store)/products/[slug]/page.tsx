import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
    },
  });

  if (!product || !product.isActive) notFound();

  const cover = product.images[0];
  const inStock = (product.inventory?.quantity ?? 0) > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/products"
        className="text-sm text-zinc-500 hover:text-zinc-900"
      >
        ← All sarees
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
            {cover ? (
              <Image
                src={cover.url}
                alt={cover.alt ?? product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                No image
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-[3/4] overflow-hidden rounded-md bg-zinc-100"
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? product.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            {product.category.name}
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-900">
            {product.name}
          </h1>
          <div className="mt-4 flex items-baseline gap-3">
            <p className="text-2xl font-semibold text-zinc-900">
              {formatINR(product.price)}
            </p>
            {product.compareAt != null && product.compareAt > product.price && (
              <p className="text-lg text-zinc-400 line-through">
                {formatINR(product.compareAt)}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-zinc-600">
            {inStock ? "In stock" : "Out of stock"}
            {product.inventory?.sku ? ` · SKU ${product.inventory.sku}` : ""}
          </p>
          {product.description && (
            <p className="mt-6 whitespace-pre-line text-zinc-600">
              {product.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
