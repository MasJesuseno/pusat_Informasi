import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request) {
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assignments = await prisma.examAssignment.findMany({
    where: { userId: payload.userId },
    orderBy: { createdAt: "desc" },
    include: {
      exam: { select: { id: true, name: true } },
      _count: { select: { answers: true } },
    },
  });

  return NextResponse.json({ assignments });
}
