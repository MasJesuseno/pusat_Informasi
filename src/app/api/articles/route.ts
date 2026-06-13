import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";
    const groupId = searchParams.get("groupId");
    const subgroupId = searchParams.get("subgroupId");
    const status = searchParams.get("status");
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");
    
    // Determine what articles to show based on authentication
    const token = getTokenFromCookie(request);
    let userRole = "PUBLIC";
    if (token) {
      try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
        userRole = payload.role;
      } catch {}
    }

    // Build where clause
    const where: any = {};
    
    if (userRole === "ADMIN" && status) {
      where.status = status;
    } else if (userRole === "ADMIN") {
      // Admin sees all
    } else if (userRole === "INTERNAL") {
      where.status = { in: ["PUBLIC", "INTERNAL"] };
    } else {
      where.status = "PUBLIC";
    }

    if (groupId) where.groupId = parseInt(groupId);
    if (subgroupId) where.subgroupId = parseInt(subgroupId);

    // Search
    if (query) {
      where.translations = {
        some: {
          locale,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
      };
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        translations: { where: { locale } },
        group: { include: { translations: { where: { locale } } } },
        subgroup: { include: { translations: { where: { locale } } } },
        author: { select: { name: true } },
      },
    });

    const formatted = articles.map(a => ({
      id: a.id,
      status: a.status,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
      title: a.translations[0]?.title || "",
      content: a.translations[0]?.content || "",
      groupName: a.group.translations[0]?.name || "",
      groupId: a.groupId,
      subgroupName: a.subgroup?.translations[0]?.name || null,
      subgroupId: a.subgroupId,
      authorName: a.author.name,
    }));

    return NextResponse.json({ articles: formatted });
  } catch (error) {
    console.error("Articles error:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number; role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { titleEn, titleId, contentEn, contentId, groupId, subgroupId, status } = await request.json();
    
    const article = await prisma.article.create({
      data: {
        groupId: parseInt(groupId),
        subgroupId: subgroupId ? parseInt(subgroupId) : null,
        status: status || "DRAFT",
        authorId: payload.userId,
        translations: {
          create: [
            { locale: "en", title: titleEn, content: contentEn },
            { locale: "id", title: titleId, content: contentId },
          ],
        },
      },
      include: { translations: true },
    });

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
