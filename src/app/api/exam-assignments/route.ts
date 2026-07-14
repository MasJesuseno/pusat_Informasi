import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "HR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const examId = searchParams.get("examId");
  const userId = searchParams.get("userId");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const where: any = {};
  if (status) where.status = status;
  if (examId) where.examId = Number(examId);
  if (userId) where.userId = Number(userId);
  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo + "T23:59:59.999Z");
  }

  const assignments = await prisma.examAssignment.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      exam: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { answers: true } },
    },
  });

  return NextResponse.json({ assignments });
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
    const { examId, userIds } = body;

    if (!examId || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "examId and userIds are required" }, { status: 400 });
    }

    // Create assignments for each user (skip if already exists)
    const results = [];
    for (const userId of userIds) {
      const existing = await prisma.examAssignment.findUnique({
        where: { examId_userId: { examId, userId } },
      });
      if (!existing) {
        const assignment = await prisma.examAssignment.create({
          data: { examId, userId },
          include: {
            exam: { select: { id: true, name: true } },
            user: { select: { id: true, name: true, email: true } },
          },
        });
        results.push(assignment);
      }
    }

    return NextResponse.json({ assignments: results });
  } catch {
    return NextResponse.json({ error: "Failed to create assignments" }, { status: 500 });
  }
}
