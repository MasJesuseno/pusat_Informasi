"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  useEffect(() => {
    fetch(`/api/exam-assignments/${id}`)
      .then((r) => r.json())
      .then((d) => setData(d.assignment))
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Assignment not found</p>
        <Link href="/enter/exam-assignments" className="text-indigo-600 text-sm mt-2 inline-block">Back</Link>
      </div>
    );
  }

  const isCompleted = data.status === "COMPLETED";
  const answers: Record<number, any> = {};
  (data.answers || []).forEach((a: any) => { answers[a.questionId] = a; });
  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/enter/exam-assignments" className="hover:text-indigo-600">Exam Assignments</Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-900 font-medium">{data.exam?.name}</span>
      </nav>

      {/* Summary card */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm mb-6">
        <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: settings.hero_bg_color_start }}>
          Assignment Details
        </div>
        <div className="bg-white p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">User</p>
            <p className="text-sm font-semibold text-gray-900">{data.user?.name}</p>
            <p className="text-xs text-gray-400">{data.user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Exam</p>
            <p className="text-sm font-semibold text-gray-900">{data.exam?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full mt-1 ${
              data.status === "COMPLETED" ? "bg-green-100 text-green-800" :
              data.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" :
              "bg-yellow-100 text-yellow-800"
            }`}>
              {data.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Score</p>
            {isCompleted ? (
              <p className={`text-lg font-bold ${data.score >= 70 ? "text-green-600" : "text-red-600"}`}>
                {data.score}
              </p>
            ) : (
              <p className="text-sm text-gray-400">-</p>
            )}
          </div>
        </div>
      </div>

      {/* Questions and answers */}
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
          Questions ({data.exam?.questions?.length || 0})
        </div>
        <div className="bg-white divide-y divide-gray-100">
          {data.exam?.questions?.map((eq: any, idx: number) => {
            const answer = answers[eq.question.id];
            const isCorrect = answer?.isCorrect;
            return (
              <div key={eq.id} className="px-5 py-4">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-900 mb-3" dangerouslySetInnerHTML={{ __html: eq.question.content }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {eq.question.options.map((opt: any) => {
                        const isUserAnswer = answer?.selectedOptionIndex === opt.index;
                        const isCorrectAnswer = opt.index === eq.question.correctOptionIndex;
                        let bg = "bg-gray-50 border-gray-100";
                        if (isCompleted && isCorrectAnswer) bg = "bg-green-50 border-green-200 text-green-800";
                        else if (isCompleted && isUserAnswer && !isCorrect) bg = "bg-red-50 border-red-200 text-red-800";
                        else if (!isCompleted && isUserAnswer) bg = "bg-indigo-50 border-indigo-200";
                        return (
                          <div key={opt.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${bg}`}>
                            <span className="font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200">
                              {optionLabels[opt.index]}
                            </span>
                            <span className="truncate">{opt.content}</span>
                            {isCompleted && isCorrectAnswer && (
                              <svg className="w-4 h-4 text-green-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isCompleted && isUserAnswer && !isCorrect && (
                              <svg className="w-4 h-4 text-red-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {isCompleted && (
                      <div className="mt-2 flex items-center gap-2">
                        {isCorrect ? (
                          <span className="text-xs text-green-600 font-medium">✓ Correct</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">✗ Incorrect</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
