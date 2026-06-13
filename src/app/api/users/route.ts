import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { articles: true } },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users list error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { email, password, name, role } = await request.json();

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Email, password, name, and role are required" }, { status: 400 });
    }

    const validRoles = ["ADMIN", "HR", "INTERNAL"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be one of: ADMIN, HR, INTERNAL" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
