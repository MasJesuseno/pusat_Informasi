"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ExamResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/my-exams/${id}/result`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Result not found</p>
        <Link href="/enter/my-exams" className="text-indigo-600 text-sm mt-2 inline-block">Back</Link>
      </div>
    );
  }

  const { assignment, results, totalQuestions, correctAnswers } = data;
  const score = assignment.score;
  const passed = score >= 70;
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/enter/my-exams" className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to My Exams
      </Link>

      {/* Score card */}
      <div className={`rounded-xl border-2 overflow-hidden shadow-sm mb-6 ${
        passed ? "border-green-200" : "border-red-200"
      }`}>
        <div className={`px-6 py-8 text-center ${
          passed ? "bg-green-50" : "bg-red-50"
        }`}>
          <div className={`text-5xl font-bold mb-2 ${passed ? "text-green-600" : "text-red-600"}`}>
            {score}
          </div>
          <p className="text-sm text-gray-500 mb-1">Score / 100</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-sm">
            <span className="text-green-600 font-medium">✓ {correctAnswers} Correct</span>
            <span className="text-red-600 font-medium">✗ {totalQuestions - correctAnswers} Incorrect</span>
          </div>
          <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
            passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {passed ? "🎉 Passed!" : "😔 Not Passed"}
          </div>
        </div>
      </div>

      {/* Detailed results */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
          Detailed Results
        </div>
        <div className="bg-white divide-y divide-gray-100">
          {results.map((r: any, idx: number) => (
            <div key={r.questionId} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                  r.isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 mb-3" dangerouslySetInnerHTML={{ __html: r.content }} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {r.options.map((opt: any) => {
                      const isUserAnswer = r.selectedOptionIndex === opt.index;
                      const isCorrectAnswer = opt.index === r.correctOptionIndex;
                      let bg = "bg-gray-50 border-gray-100";
                      if (isCorrectAnswer) bg = "bg-green-50 border-green-200 text-green-800";
                      else if (isUserAnswer && !isCorrectAnswer) bg = "bg-red-50 border-red-200 text-red-800";
                      return (
                        <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${bg}`}>
                          <span className="font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200">
                            {optionLabels[opt.index]}
                          </span>
                          <span className="truncate">{opt.content}</span>
                          {isCorrectAnswer && (
                            <svg className="w-4 h-4 text-green-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <svg className="w-4 h-4 text-red-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
