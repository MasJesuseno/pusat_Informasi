import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const question = await prisma.question.findUnique({
    where: { id: Number(id) },
    include: {
      options: { orderBy: { index: "asc" } },
    },
  });

  if (!question) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    question: {
      id: question.id,
      questionGroupId: question.questionGroupId,
      content: question.content,
      imageUrl: question.imageUrl,
      order: question.order,
      correctOptionIndex: question.correctOptionIndex,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      options: question.options.map((o) => ({
        id: o.id,
        index: o.index,
        content: o.content,
      })),
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
    const { questionGroupId, content, imageUrl, order, correctOptionIndex, options } = body;
    const questionId = Number(id);

    // Update question fields
    await prisma.question.update({
      where: { id: questionId },
      data: {
        ...(questionGroupId !== undefined ? { questionGroupId: Number(questionGroupId) } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(imageUrl !== undefined ? { imageUrl: imageUrl || null } : {}),
        ...(order !== undefined ? { order } : {}),
        ...(correctOptionIndex !== undefined ? { correctOptionIndex } : {}),
      },
    });

    // If options are provided, replace them
    if (options && options.length === 4) {
      await prisma.questionOption.deleteMany({ where: { questionId } });
      await prisma.questionOption.createMany({
        data: options.map((opt: { content: string; index: number }, i: number) => ({
          questionId,
          index: opt.index ?? i,
          content: opt.content,
        })),
      });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: { orderBy: { index: "asc" } },
      },
    });

    return NextResponse.json({ question });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
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
    await prisma.question.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
  }
}
