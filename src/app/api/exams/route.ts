import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
    },
  });

  return NextResponse.json({ exams });
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
    const { name, questionIds } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Exam name is required" }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        name: name.trim(),
        ...(questionIds?.length
          ? {
              questions: {
                create: questionIds.map((qId: number) => ({ questionId: qId })),
              },
            }
          : {}),
      },
      include: {
        _count: { select: { questions: true } },
      },
    });

    return NextResponse.json({ exam });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 });
  }
}
