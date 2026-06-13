import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromCookie, verifyToken } from "@/lib/auth";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getTokenFromCookie(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { answers } = body; // [{ questionId, selectedOptionIndex }]

    if (!Array.isArray(answers)) {
      return NextResponse.json({ error: "answers array is required" }, { status: 400 });
    }

    const assignment = await prisma.examAssignment.findUnique({
      where: { id: Number(id) },
      include: {
        exam: {
          include: {
            questions: {
              include: { question: { select: { id: true, correctOptionIndex: true } } },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    }

    if (assignment.userId !== payload.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (assignment.status === "COMPLETED") {
      return NextResponse.json({ error: "Already submitted" }, { status: 409 });
    }

    // Delete previous answers if re-submitting
    await prisma.examAnswer.deleteMany({ where: { assignmentId: Number(id) } });

    // Create answer for each question
    let correctCount = 0;
    const answerRecords = [];

    for (const ans of answers) {
      const examQuestion = assignment.exam.questions.find(
        (eq) => eq.question.id === ans.questionId
      );
      if (!examQuestion) continue;

      const isCorrect = ans.selectedOptionIndex === examQuestion.question.correctOptionIndex;
      if (isCorrect) correctCount++;

      const answer = await prisma.examAnswer.create({
        data: {
          assignmentId: Number(id),
          questionId: ans.questionId,
          selectedOptionIndex: ans.selectedOptionIndex,
          isCorrect,
        },
      });
      answerRecords.push(answer);
    }

    const totalQuestions = assignment.exam.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    // Update assignment status
    await prisma.examAssignment.update({
      where: { id: Number(id) },
      data: {
        status: "COMPLETED",
        score,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      score,
      correctCount,
      totalQuestions,
      answers: answerRecords,
    });
  } catch {
    return NextResponse.json({ error: "Failed to submit answers" }, { status: 500 });
  }
}
