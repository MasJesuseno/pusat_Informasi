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
      answers: {
        include: { question: { select: { id: true, correctOptionIndex: true } } },
      },
    },
  });

  if (!assignment || assignment.userId !== payload.userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const totalQuestions = assignment.exam.questions.length;
  const answeredQuestions = assignment.answers.length;
  const correctAnswers = assignment.answers.filter((a) => a.isCorrect).length;

  // Build detailed results per question
  const results = assignment.exam.questions.map((eq) => {
    const userAnswer = assignment.answers.find((a) => a.questionId === eq.question.id);
    return {
      questionId: eq.question.id,
      content: eq.question.content,
      options: eq.question.options,
      correctOptionIndex: eq.question.correctOptionIndex,
      selectedOptionIndex: userAnswer?.selectedOptionIndex ?? null,
      isCorrect: userAnswer?.isCorrect ?? false,
    };
  });

  return NextResponse.json({
    assignment: {
      id: assignment.id,
      status: assignment.status,
      score: assignment.score,
      startedAt: assignment.startedAt,
      submittedAt: assignment.submittedAt,
      exam: { id: assignment.exam.id, name: assignment.exam.name },
    },
    results,
    totalQuestions,
    answeredQuestions,
    correctAnswers,
  });
}
