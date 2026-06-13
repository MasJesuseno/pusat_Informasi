import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { helpful } = await request.json();

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    const articleId = parseInt(id);

    if (helpful === null) {
      // Remove vote (toggle off)
      await prisma.articleFeedback.deleteMany({
        where: { articleId, ip },
      });
    } else {
      // Upsert vote (create or update)
      await prisma.articleFeedback.upsert({
        where: { articleId_ip: { articleId, ip } },
        update: { helpful },
        create: { articleId, ip, helpful },
      });
    }

    // Get updated counts
    const feedbacks = await prisma.articleFeedback.findMany({
      where: { articleId },
      select: { helpful: true },
    });

    const helpfulCount = feedbacks.filter((f) => f.helpful).length;
    const notHelpfulCount = feedbacks.filter((f) => !f.helpful).length;

    return NextResponse.json({
      helpfulCount,
      notHelpfulCount,
      userVote: helpful,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const articleId = parseInt(id);

    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

    const feedbacks = await prisma.articleFeedback.findMany({
      where: { articleId },
      select: { helpful: true },
    });

    const helpfulCount = feedbacks.filter((f) => f.helpful).length;
    const notHelpfulCount = feedbacks.filter((f) => !f.helpful).length;

    const userFeedback = await prisma.articleFeedback.findUnique({
      where: { articleId_ip: { articleId, ip } },
    });

    return NextResponse.json({
      helpfulCount,
      notHelpfulCount,
      userVote: userFeedback?.helpful ?? null,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}
