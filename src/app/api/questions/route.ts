import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const questionGroupId = searchParams.get("questionGroupId");
  const locale = searchParams.get("locale") || "en";

  const where = questionGroupId ? { questionGroupId: Number(questionGroupId) } : {};

  // Also get group info
  const groupWhere = questionGroupId ? { id: Number(questionGroupId) } : undefined;

  let groupName = "";
  if (groupWhere) {
    const group = await prisma.questionGroup.findUnique({
      where: groupWhere,
      include: { translations: { where: { locale } } },
    });
    groupName = group?.translations[0]?.name || "";
  }

  const questions = await prisma.question.findMany({
    where,
    orderBy: { order: "asc" },
    include: {
      options: { orderBy: { index: "asc" } },
    },
  });

  const result = questions.map((q) => ({
    id: q.id,
    questionGroupId: q.questionGroupId,
    content: q.content,
    imageUrl: q.imageUrl,
    order: q.order,
    correctOptionIndex: q.correctOptionIndex,
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
    options: q.options.map((o) => ({
      id: o.id,
      index: o.index,
      content: o.content,
    })),
  }));

  return NextResponse.json({ questions: result, groupName });
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
    const { questionGroupId, content, imageUrl, order, correctOptionIndex, options } = body;

    if (!questionGroupId || !content || !options || options.length !== 4) {
      return NextResponse.json({ error: "Question group, content, and 4 options are required" }, { status: 400 });
    }

    const question = await prisma.question.create({
      data: {
        questionGroupId: Number(questionGroupId),
        content,
        imageUrl: imageUrl || null,
        order: order || 0,
        correctOptionIndex: correctOptionIndex ?? 0,
        options: {
          create: options.map((opt: { content: string; index: number }, i: number) => ({
            index: opt.index ?? i,
            content: opt.content,
          })),
        },
      },
      include: {
        options: { orderBy: { index: "asc" } },
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
  }
}
