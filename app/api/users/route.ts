import { NextResponse } from "next/server";

export async function GET() {
  // TODO: return current authenticated user profile
  return NextResponse.json({ user: null });
}
