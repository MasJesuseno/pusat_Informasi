"use client";

import { useState } from "react";

interface ArticleFeedbackProps {
  articleId: number;
  initialHelpful: number;
  initialNotHelpful: number;
  initialUserVote: boolean | null;
  locale: string;
}

export default function ArticleFeedback({
  articleId,
  initialHelpful,
  initialNotHelpful,
  initialUserVote,
  locale,
}: ArticleFeedbackProps) {
  const [helpfulCount, setHelpfulCount] = useState(initialHelpful);
  const [notHelpfulCount, setNotHelpfulCount] = useState(initialNotHelpful);
  const [userVote, setUserVote] = useState<boolean | null>(initialUserVote);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isId = locale === "id";

  const handleVote = async (helpful: boolean) => {
    if (loading) return;

    const newVote = userVote === helpful ? null : helpful;

    // Optimistic update
    setLoading(true);
    if (userVote === true) setHelpfulCount((p) => Math.max(0, p - 1));
    if (userVote === false) setNotHelpfulCount((p) => Math.max(0, p - 1));
    if (newVote === true) setHelpfulCount((p) => p + 1);
    if (newVote === false) setNotHelpfulCount((p) => p + 1);
    setUserVote(newVote);
    if (newVote !== null) setSubmitted(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ helpful: newVote }),
      });

      if (!res.ok) throw new Error("Failed");
    } catch {
      // Revert on error
      setUserVote(userVote);
      setHelpfulCount(initialHelpful);
      setNotHelpfulCount(initialNotHelpful);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };

  const total = helpfulCount + notHelpfulCount;
  const helpfulPct = total > 0 ? Math.round((helpfulCount / total) * 100) : 0;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <p className="text-center text-gray-800 font-semibold text-lg mb-5">
        {isId ? "Apakah informasi ini membantu?" : "Was this information helpful?"}
      </p>

      {/* Progress bar */}
      {total > 0 && (
        <div className="max-w-md mx-auto mb-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="text-green-600 font-medium">{helpfulPct}%</span>
            <span className="text-gray-400">{total} {isId ? "suara" : "votes"}</span>
            <span className="text-red-500 font-medium">{100 - helpfulPct}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${helpfulPct}%`,
                background: "linear-gradient(90deg, #22c55e 0%, #16a34a 100%)",
              }}
            />
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleVote(true)}
          disabled={loading}
          className={`relative flex flex-col items-center gap-1 px-7 py-3.5 rounded-xl border-2 transition-all duration-200 ${
            userVote === true
              ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:bg-green-50/60 hover:shadow-sm"
          } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
            </svg>
            <span className="font-medium">{isId ? "Membantu" : "Helpful"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="bg-white/70 px-2 py-0.5 rounded-full font-semibold">
              {helpfulCount}
            </span>
            {total > 0 && (
              <span className="text-gray-400">({helpfulPct}%)</span>
            )}
          </div>
        </button>
        <button
          onClick={() => handleVote(false)}
          disabled={loading}
          className={`relative flex flex-col items-center gap-1 px-7 py-3.5 rounded-xl border-2 transition-all duration-200 ${
            userVote === false
              ? "bg-red-50 border-red-500 text-red-700 shadow-sm"
              : "bg-white border-gray-200 text-gray-600 hover:border-red-400 hover:bg-red-50/60 hover:shadow-sm"
          } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            <span className="font-medium">{isId ? "Tidak" : "Not Helpful"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="bg-white/70 px-2 py-0.5 rounded-full font-semibold">
              {notHelpfulCount}
            </span>
            {total > 0 && (
              <span className="text-gray-400">({100 - helpfulPct}%)</span>
            )}
          </div>
        </button>
      </div>
      {submitted && userVote !== null && (
        <p className="text-center text-sm text-gray-500 mt-4">
          {isId
            ? "Terima kasih atas masukan Anda!"
            : "Thank you for your feedback!"}
        </p>
      )}
    </div>
  );
}
