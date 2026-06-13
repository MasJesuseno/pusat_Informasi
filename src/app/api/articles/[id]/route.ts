import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "en";

    const token = getTokenFromCookie(request);
    let userRole = "PUBLIC";
    if (token) {
      try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
        userRole = payload.role;
      } catch {}
    }

    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      include: {
        translations: true,
        group: { include: { translations: true } },
        subgroup: { include: { translations: true } },
        author: { select: { name: true, id: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check access rights
    if (article.status === "DRAFT" && userRole !== "ADMIN") {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    if (article.status === "INTERNAL" && userRole === "PUBLIC") {
      return NextResponse.json({ error: "Login required", requiresAuth: true }, { status: 401 });
    }

    const enTrans = article.translations.find(t => t.locale === "en");
    const idTrans = article.translations.find(t => t.locale === "id");
    const groupEn = article.group.translations.find(t => t.locale === "en");
    const groupId = article.group.translations.find(t => t.locale === "id");
    const subEn = article.subgroup?.translations.find(t => t.locale === "en");
    const subId = article.subgroup?.translations.find(t => t.locale === "id");

    return NextResponse.json({
      article: {
        id: article.id,
        status: article.status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        groupId: article.groupId,
        subgroupId: article.subgroupId,
        authorName: article.author.name,
        title: article.translations.find(t => t.locale === locale)?.title || "",
        content: article.translations.find(t => t.locale === locale)?.content || "",
        titleEn: enTrans?.title || "",
        titleId: idTrans?.title || "",
        contentEn: enTrans?.content || "",
        contentId: idTrans?.content || "",
        groupName: article.group.translations.find(t => t.locale === locale)?.name || "",
        subgroupName: article.subgroup?.translations.find(t => t.locale === locale)?.name || null,
      },
    });
  } catch (error) {
    console.error("Get article error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const { titleEn, titleId, contentEn, contentId, groupId, subgroupId, status } = await request.json();

    if (titleEn) {
      await prisma.articleTranslation.upsert({
        where: { articleId_locale: { articleId: parseInt(id), locale: "en" } },
        update: { title: titleEn, content: contentEn || "" },
        create: { articleId: parseInt(id), locale: "en", title: titleEn, content: contentEn || "" },
      });
    }
    if (titleId) {
      await prisma.articleTranslation.upsert({
        where: { articleId_locale: { articleId: parseInt(id), locale: "id" } },
        update: { title: titleId, content: contentId || "" },
        create: { articleId: parseInt(id), locale: "id", title: titleId, content: contentId || "" },
      });
    }

    const updateData: any = {};
    if (groupId) updateData.groupId = parseInt(groupId);
    if (subgroupId !== undefined) updateData.subgroupId = subgroupId ? parseInt(subgroupId) : null;
    if (status) updateData.status = status;

    if (Object.keys(updateData).length > 0) {
      await prisma.article.update({ where: { id: parseInt(id) }, data: updateData });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    await prisma.article.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
