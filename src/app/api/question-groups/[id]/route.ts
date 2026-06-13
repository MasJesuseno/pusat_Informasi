import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const group = await prisma.questionGroup.findUnique({
    where: { id: Number(id) },
    include: {
      translations: true,
      _count: { select: { questions: true } },
    },
  });

  if (!group) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const getTranslation = (loc: string) =>
    group.translations.find((t) => t.locale === loc)?.name || "";

  return NextResponse.json({
    group: {
      id: group.id,
      order: group.order,
      status: group.status,
      nameEn: getTranslation("en"),
      nameId: getTranslation("id"),
      questionCount: group._count.questions,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    },
  });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nameEn, nameId, order, status } = body;

    const groupId = Number(id);

    // Update translations
    if (nameEn !== undefined) {
      await prisma.questionGroupTranslation.upsert({
        where: { questionGroupId_locale: { questionGroupId: groupId, locale: "en" } },
        update: { name: nameEn },
        create: { questionGroupId: groupId, locale: "en", name: nameEn },
      });
    }

    if (nameId !== undefined) {
      await prisma.questionGroupTranslation.upsert({
        where: { questionGroupId_locale: { questionGroupId: groupId, locale: "id" } },
        update: { name: nameId },
        create: { questionGroupId: groupId, locale: "id", name: nameId },
      });
    }

    const group = await prisma.questionGroup.update({
      where: { id: groupId },
      data: {
        ...(order !== undefined ? { order } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return NextResponse.json({ group });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update question group" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.questionGroup.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete question group" }, { status: 500 });
  }
}
