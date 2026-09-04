"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { rupeesToPaise, slugify } from "@/lib/format";
import {
  deleteProductImageFile,
  uploadProductImages,
} from "@/lib/product-images";

function handlePrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = (err.meta?.target as string[])?.join(", ") ?? "field";
      throw new Error(`A record with this ${field} already exists.`);
    }
  }
  throw err;
}

function parseProductForm(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || slugify(name);
  const description = (formData.get("description") as string)?.trim() || null;
  const priceRupees = parseFloat(formData.get("price") as string);
  const compareAtRaw = formData.get("compareAt") as string;
  const compareAtRupees = compareAtRaw ? parseFloat(compareAtRaw) : null;
  const categoryId = formData.get("categoryId") as string;
  const isActive = formData.get("isActive") === "on";
  const quantity = parseInt(formData.get("quantity") as string, 10) || 0;
  const sku = (formData.get("sku") as string)?.trim() || null;

  if (!name) throw new Error("Product name is required");
  if (!slug) throw new Error("Slug is required");
  if (isNaN(priceRupees) || priceRupees <= 0) {
    throw new Error("Valid price is required");
  }
  if (!categoryId) throw new Error("Category is required");

  return {
    name,
    slug,
    description,
    price: rupeesToPaise(priceRupees),
    compareAt:
      compareAtRupees && !isNaN(compareAtRupees)
        ? rupeesToPaise(compareAtRupees)
        : null,
    categoryId,
    isActive,
    quantity,
    sku,
  };
}

export async function createProduct(formData: FormData) {
  const data = parseProductForm(formData);
  const imageFiles = formData.getAll("images") as File[];
  const imageUrls = await uploadProductImages(imageFiles);

  try {
    const product = await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAt: data.compareAt,
        categoryId: data.categoryId,
        isActive: data.isActive,
        images: {
          create: imageUrls.map((url, i) => ({
            url,
            alt: data.name,
            sortOrder: i,
          })),
        },
        inventory: {
          create: { quantity: data.quantity, sku: data.sku },
        },
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    redirect(`/admin/products/${product.id}/edit`);
  } catch (err) {
    handlePrismaError(err);
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  const data = parseProductForm(formData);
  const imageFiles = formData.getAll("images") as File[];
  const imageUrls = await uploadProductImages(imageFiles);

  const existingImageCount = await db.productImage.count({
    where: { productId },
  });

  try {
    await db.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAt: data.compareAt,
        categoryId: data.categoryId,
        isActive: data.isActive,
        images:
          imageUrls.length > 0
            ? {
                create: imageUrls.map((url, i) => ({
                  url,
                  alt: data.name,
                  sortOrder: existingImageCount + i,
                })),
              }
            : undefined,
        inventory: {
          upsert: {
            create: { quantity: data.quantity, sku: data.sku },
            update: { quantity: data.quantity, sku: data.sku },
          },
        },
      },
    });
  } catch (err) {
    handlePrismaError(err);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function deleteProduct(productId: string) {
  const images = await db.productImage.findMany({ where: { productId } });

  await db.product.delete({ where: { id: productId } });

  await Promise.all(images.map((image) => deleteProductImageFile(image.url)));

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  redirect("/admin/products");
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  await db.product.update({
    where: { id: productId },
    data: { isActive },
  });

  revalidatePath("/admin/products");
}

export async function deleteProductImage(imageId: string, productId: string) {
  const image = await db.productImage.findUnique({ where: { id: imageId } });

  if (image) {
    await db.productImage.delete({ where: { id: imageId } });
    await deleteProductImageFile(image.url);
  }

  revalidatePath(`/admin/products/${productId}/edit`);
}

export async function getAdminProducts() {
  return db.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      inventory: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductForEdit(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      inventory: true,
    },
  });
}
