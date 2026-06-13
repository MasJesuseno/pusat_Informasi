import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, hashPassword } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string; userId: number };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const userId = parseInt(id);

    const { email, password, name, role } = await request.json();

    // Cannot modify yourself
    if (userId === payload.userId) {
      return NextResponse.json({ error: "Cannot modify your own account from here" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: { email?: string; name?: string; role?: string; password?: string } = {};

    if (email !== undefined) {
      // Check email uniqueness if changed
      if (email !== existing.email) {
        const emailExists = await prisma.user.findUnique({ where: { email } });
        if (emailExists) {
          return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
      }
      updateData.email = email;
    }

    if (name !== undefined) updateData.name = name;

    if (role !== undefined) {
      const validRoles = ["ADMIN", "HR", "INTERNAL"];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role. Must be one of: ADMIN, HR, INTERNAL" }, { status: 400 });
      }
      updateData.role = role;
    }

    if (password !== undefined && password !== "") {
      updateData.password = await hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string; userId: number };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const userId = parseInt(id);

    // Cannot delete yourself
    if (userId === payload.userId) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
