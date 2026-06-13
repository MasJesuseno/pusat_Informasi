import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    // Determine user role for visibility filtering
    const token = getTokenFromCookie(request);
    let userRole = "PUBLIC";
    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
        userRole = payload.role;
      } catch {}
    }

    // Build where clause based on auth status
    const where: any = {};
    if (userRole === "PUBLIC") {
      where.status = "PUBLIC";
    }

    const groups = await prisma.group.findMany({
      where,
      orderBy: { order: "asc" },
      include: {
        translations: true,
        subgroups: {
          orderBy: { order: "asc" },
          include: {
            translations: true,
            _count: { select: { articles: true } },
          },
        },
        _count: { select: { articles: true } },
      },
    });

    const formatted = groups.map(g => ({
      id: g.id,
      order: g.order,
      status: g.status,
      name: g.translations.find(t => t.locale === locale)?.name || g.translations[0]?.name || "",
      nameEn: g.translations.find(t => t.locale === "en")?.name || "",
      nameId: g.translations.find(t => t.locale === "id")?.name || "",
      articleCount: g._count.articles,
      subgroups: g.subgroups.map(sg => ({
        id: sg.id,
        order: sg.order,
        status: sg.status,
        groupId: sg.groupId,
        name: sg.translations.find(t => t.locale === locale)?.name || sg.translations[0]?.name || "",
        nameEn: sg.translations.find(t => t.locale === "en")?.name || "",
        nameId: sg.translations.find(t => t.locale === "id")?.name || "",
        articleCount: sg._count.articles,
      })),
    }));

    return NextResponse.json({ groups: formatted });
  } catch (error) {
    console.error("Groups error:", error);
    return NextResponse.json({ error: "Failed to fetch groups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { nameEn, nameId, order, status } = await request.json();
    
    const group = await prisma.group.create({
      data: {
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

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: "Failed to create group" }, { status: 500 });
  }
}
