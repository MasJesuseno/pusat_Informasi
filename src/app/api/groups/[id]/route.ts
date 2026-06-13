import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: { translations: true },
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Get group error:", error);
    return NextResponse.json({ error: "Failed to fetch group" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { nameEn, nameId, order, status } = await request.json();

    if (nameEn) {
      await prisma.groupTranslation.upsert({
        where: { groupId_locale: { groupId: parseInt(id), locale: "en" } },
        update: { name: nameEn },
        create: { groupId: parseInt(id), locale: "en", name: nameEn },
      });
    }
    if (nameId) {
      await prisma.groupTranslation.upsert({
        where: { groupId_locale: { groupId: parseInt(id), locale: "id" } },
        update: { name: nameId },
        create: { groupId: parseInt(id), locale: "id", name: nameId },
      });
    }

    const updateData: any = {};
    if (order !== undefined) updateData.order = order;
    if (status) updateData.status = status;
    
    if (Object.keys(updateData).length > 0) {
      await prisma.group.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update group error:", error);
    return NextResponse.json({ error: "Failed to update group" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await prisma.group.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete group error:", error);
    return NextResponse.json({ error: "Failed to delete group" }, { status: 500 });
  }
}
