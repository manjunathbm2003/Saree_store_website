import { NextResponse } from "next/server";

export async function GET() {
  // TODO: resolve cart by session or authenticated user
  return NextResponse.json({ cart: { items: [] } });
}

export async function POST() {
  // TODO: add item to cart
  return NextResponse.json({ success: true });
}
