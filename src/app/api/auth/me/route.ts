import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return NextResponse.json({ user: null });

    const match = cookieHeader.match(/\btoken=([^;]+)/);
    if (!match) return NextResponse.json({ user: null });

    const token = match[1];
    const jwt = require("jsonwebtoken");
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key");

    const { prisma } = await import("@/lib/db");
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
