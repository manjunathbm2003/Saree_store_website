import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const orders = await db.order.findMany({
    include: {
      items: { include: { product: true } },
      payment: true,
      shipment: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ orders });
}

export async function POST() {
  // TODO: create order from cart at checkout
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
