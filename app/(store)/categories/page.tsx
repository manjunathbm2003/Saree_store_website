import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900">Categories</h1>
      <p className="mt-2 text-zinc-600">
        Browse sarees by collection.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 text-zinc-500">No categories yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-zinc-200 border-y border-zinc-200">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="flex items-center justify-between py-4 hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{category.name}</p>
                  {category.description && (
                    <p className="mt-0.5 text-sm text-zinc-500">
                      {category.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-zinc-500">
                  {category._count.products} item
                  {category._count.products === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
