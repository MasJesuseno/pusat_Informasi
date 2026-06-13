import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const groupId = searchParams.get("groupId");

    // Determine user role for visibility filtering
    const token = getTokenFromCookie(request);
    let userRole = "PUBLIC";
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
        userRole = payload.role;
      } catch {}
    }

    const where: any = groupId ? { groupId: parseInt(groupId) } : {};

    // Filter by status for unauthenticated users
    if (userRole === "PUBLIC") {
      where.status = "PUBLIC";
    }

    const subgroups = await prisma.subGroup.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        translations: true,
        group: { include: { translations: true } },
        _count: { select: { articles: true } },
      },
    });

    const formatted = subgroups.map(sg => ({
      id: sg.id,
      order: sg.order,
      status: sg.status,
      groupId: sg.groupId,
      name: sg.translations.find(t => t.locale === locale)?.name || sg.translations[0]?.name || "",
      nameEn: sg.translations.find(t => t.locale === "en")?.name || "",
      nameId: sg.translations.find(t => t.locale === "id")?.name || "",
      groupName: sg.group.translations.find(t => t.locale === locale)?.name || "",
      articleCount: sg._count.articles,
    }));

    return NextResponse.json({ subgroups: formatted });
  } catch (error) {
    console.error("Subgroups error:", error);
    return NextResponse.json({ error: "Failed to fetch subgroups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { nameEn, nameId, groupId, order, status } = await request.json();
    
    const subgroup = await prisma.subGroup.create({
      data: {
        groupId: parseInt(groupId),
        order: order || 0,
        status: status || "PUBLIC",
        translations: {
          create: [
            { locale: "en", name: nameEn },
            { locale: "id", name: nameId },
          ],
        },
      },
      include: { translations: true },
    });

    return NextResponse.json({ subgroup });
  } catch (error) {
    console.error("Create subgroup error:", error);
    return NextResponse.json({ error: "Failed to create subgroup" }, { status: 500 });
  }
}
