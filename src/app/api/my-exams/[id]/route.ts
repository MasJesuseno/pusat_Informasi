import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const assignment = await prisma.examAssignment.findUnique({
    where: { id: Number(id) },
    include: {
      exam: {
        include: {
          questions: {
            include: {
              question: {
                include: { options: { orderBy: { index: "asc" } } },
              },
            },
            orderBy: { id: "asc" },
          },
        },
      },
      answers: true,
    },
  });

  if (!assignment || assignment.userId !== payload.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ assignment });
}
