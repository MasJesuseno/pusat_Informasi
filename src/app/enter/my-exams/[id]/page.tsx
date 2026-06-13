"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Question {
  id: number;
  content: string;
  imageUrl: string | null;
  options: { id: number; index: number; content: string }[];
}

export default function TakeExamPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [assignment, setAssignment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/my-exams/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setAssignment(d.assignment);
        if (d.assignment?.exam?.questions) {
          const qs = d.assignment.exam.questions.map((eq: any) => eq.question);
          setQuestions(qs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const selectOption = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId: Number(questionId),
        selectedOptionIndex,
      }));

      const res = await fetch(`/api/exam-assignments/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersArray }),
      });

      if (res.ok) {
        router.push(`/enter/my-exams/${id}/result`);
      } else {
        const data = await res.json();
        if (data.error === "Already submitted") {
          router.push(`/enter/my-exams/${id}/result`);
        } else {
          alert(data.error || "Failed to submit");
        }
      }
    } catch {
      alert("Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Exam not found</p>
        <Link href="/enter/my-exams" className="text-indigo-600 text-sm mt-2 inline-block">Back</Link>
      </div>
    );
  }

  if (assignment.status === "COMPLETED") {
    router.push(`/enter/my-exams/${id}/result`);
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const optionLabels = ["A", "B", "C", "D"];
  const answeredCount = Object.keys(answers).length;

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">No questions in this exam</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{assignment.exam?.name}</h1>
          <p className="text-sm text-gray-500">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500">
            {answeredCount}/{questions.length} answered
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* Navigation dots */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(idx)}
            className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
              idx === currentIndex
                ? "bg-indigo-600 text-white"
                : answers[q.id] !== undefined
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Question {currentIndex + 1}</span>
          {answers[currentQuestion?.id] !== undefined && (
            <span className="text-xs text-green-600 font-medium">✓ Answered</span>
          )}
        </div>
        <div className="bg-white p-5">
          <div
            className="text-sm text-gray-900 mb-4 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: currentQuestion?.content || "" }}
          />
          {currentQuestion?.imageUrl && (
            <img src={currentQuestion.imageUrl} alt="Question" className="max-h-40 rounded-lg border mb-4" />
          )}
          <div className="space-y-2">
            {currentQuestion?.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectOption(currentQuestion.id, opt.index)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-left transition-all ${
                  answers[currentQuestion.id] === opt.index
                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-900"
                    : "bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  answers[currentQuestion.id] === opt.index
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-500"
                }`}>
                  {optionLabels[opt.index]}
                </span>
                <span>{opt.content}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex(currentIndex + 1)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {submitting ? "Submitting..." : `Submit (${answeredCount}/${questions.length})`}
          </button>
        )}
      </div>
    </div>
  );
}
