import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const subgroup = await prisma.subGroup.findUnique({
      where: { id: parseInt(id) },
      include: { translations: true },
    });

    if (!subgroup) {
      return NextResponse.json({ error: "Subgroup not found" }, { status: 404 });
    }

    return NextResponse.json({ subgroup });
  } catch (error) {
    console.error("Get subgroup error:", error);
    return NextResponse.json({ error: "Failed to fetch subgroup" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { nameEn, nameId, groupId, order, status } = await request.json();

    if (nameEn) {
      await prisma.subGroupTranslation.upsert({
        where: { subgroupId_locale: { subgroupId: parseInt(id), locale: "en" } },
        update: { name: nameEn },
        create: { subgroupId: parseInt(id), locale: "en", name: nameEn },
      });
    }
    if (nameId) {
      await prisma.subGroupTranslation.upsert({
        where: { subgroupId_locale: { subgroupId: parseInt(id), locale: "id" } },
        update: { name: nameId },
        create: { subgroupId: parseInt(id), locale: "id", name: nameId },
      });
    }

    const updateData: any = {};
    if (order !== undefined) updateData.order = order;
    if (groupId) updateData.groupId = parseInt(groupId);
    if (status) updateData.status = status;
    
    if (Object.keys(updateData).length > 0) {
      await prisma.subGroup.update({ where: { id: parseInt(id) }, data: updateData });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update subgroup error:", error);
    return NextResponse.json({ error: "Failed to update subgroup" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await prisma.subGroup.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete subgroup error:", error);
    return NextResponse.json({ error: "Failed to delete subgroup" }, { status: 500 });
  }
}
