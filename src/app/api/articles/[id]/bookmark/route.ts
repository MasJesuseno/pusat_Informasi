import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie } from "@/lib/auth";
import jwt from "jsonwebtoken";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromCookie(request);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number };
    const { id } = await params;
    const articleId = parseInt(id);

    // Check if already bookmarked
    const existing = await prisma.articleCollection.findUnique({
      where: { userId_articleId: { userId: payload.userId, articleId } },
    });

    if (existing) {
      // Remove bookmark
      await prisma.articleCollection.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.articleCollection.create({
        data: { userId: payload.userId, articleId },
      });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 });
  }
}
