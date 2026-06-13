import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const groups = await prisma.questionGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale } },
      _count: { select: { questions: true } },
    },
  });

  const result = groups.map((g) => ({
    id: g.id,
    order: g.order,
    status: g.status,
    name: g.translations[0]?.name || "",
    questionCount: g._count.questions,
    createdAt: g.createdAt,
    updatedAt: g.updatedAt,
  }));

  return NextResponse.json({ groups: result });
}

export async function POST(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nameEn, nameId, order, status } = body;

    if (!nameEn) {
      return NextResponse.json({ error: "Name (English) is required" }, { status: 400 });
    }

    const group = await prisma.questionGroup.create({
      data: {
        order: order || 0,
        status: status || "PUBLIC",
        translations: {
          create: [
            { locale: "en", name: nameEn },
            ...(nameId ? [{ locale: "id", name: nameId }] : []),
          ],
        },
      },
    });

    return NextResponse.json({ group });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create question group" }, { status: 500 });
  }
}
