import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const { id, questionId } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.examQuestion.delete({
      where: {
        examId_questionId: {
          examId: Number(id),
          questionId: Number(questionId),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove question" }, { status: 500 });
  }
}
