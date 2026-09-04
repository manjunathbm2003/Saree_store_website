import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      inventory: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}
