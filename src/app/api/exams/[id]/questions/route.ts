import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { questionId } = body;

    if (!questionId) {
      return NextResponse.json({ error: "questionId is required" }, { status: 400 });
    }

    // Check if question already exists in exam
    const existing = await prisma.examQuestion.findUnique({
      where: {
        examId_questionId: { examId: Number(id), questionId: Number(questionId) },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Question already in exam" }, { status: 409 });
    }

    const examQuestion = await prisma.examQuestion.create({
      data: {
        examId: Number(id),
        questionId: Number(questionId),
      },
      include: {
        question: {
          include: {
            options: { orderBy: { index: "asc" } },
          },
        },
      },
    });

    return NextResponse.json({ examQuestion });
  } catch {
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
