"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  articleId: number;
  initialBookmarked: boolean;
}

export default function BookmarkButton({ articleId, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggleBookmark = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/articles/${articleId}/bookmark`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.bookmarked !== undefined) {
        setBookmarked(data.bookmarked);
      } else if (data.error) {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
        error ? "bg-red-50 text-red-700 border-red-200" :
        bookmarked
          ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
          : "bg-white text-gray-500 border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
      }`}
    >
      <svg className={`w-4 h-4 transition-colors ${bookmarked ? "text-indigo-600 fill-indigo-600" : ""}`} fill={bookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      {loading ? "..." : error ? "Error" : bookmarked ? "Saved" : "Save"}
    </button>
  );
}
