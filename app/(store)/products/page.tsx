import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categorySlug } = await searchParams;

  const products = await db.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">All Sarees</h1>
      <p className="mt-2 text-zinc-600">
        {products.length === 0
          ? "No products yet — add them from Admin."
          : `${products.length} saree${products.length === 1 ? "" : "s"}`}
      </p>

      {products.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              compareAt={product.compareAt}
              imageUrl={product.images[0]?.url}
              categoryName={product.category.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
