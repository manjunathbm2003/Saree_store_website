"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { slugify } from "@/lib/format";

function handlePrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "field";
      throw new Error(`A record with this ${field} already exists.`);
    }
  }
  throw err;
}

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug =
    (formData.get("slug") as string)?.trim() || slugify(name ?? "");
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) throw new Error("Category name is required");
  if (!slug) throw new Error("Slug is required");

  try {
    await db.category.create({
      data: { name, slug, description },
    });
  } catch (err) {
    handlePrismaError(err);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
}

export async function deleteCategory(categoryId: string) {
  const productCount = await db.product.count({ where: { categoryId } });
  if (productCount > 0) {
    throw new Error(
      `Cannot delete category with ${productCount} product(s). Reassign them first.`,
    );
  }

  await db.category.delete({ where: { id: categoryId } });
  revalidatePath("/admin/categories");
}

export async function getCategories() {
  return db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
}

export async function updateInventory(
  productId: string,
  quantity: number,
  sku: string | null,
) {
  await db.inventory.upsert({
    where: { productId },
    create: { productId, quantity, sku },
    update: { quantity, sku },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}

export async function getInventoryItems() {
  return db.product.findMany({
    include: {
      category: true,
      inventory: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { name: "asc" },
  });
}
