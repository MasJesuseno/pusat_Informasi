"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Option {
  id: number;
  index: number;
  content: string;
}

interface ExamQuestion {
  id: number;
  questionId: number;
  question: {
    id: number;
    content: string;
    imageUrl: string | null;
    correctOptionIndex: number;
    options: Option[];
    questionGroup: {
      id: number;
      translations: { locale: string; name: string }[];
    };
  };
}

interface Exam {
  id: number;
  name: string;
  createdAt: string;
  questions: ExamQuestion[];
}

interface AvailableQuestion {
  id: number;
  content: string;
  options: Option[];
  questionGroup: { id: number; translations: { locale: string; name: string }[] };
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────
function DeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Exam</h3>
            <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">All question assignments in this exam will be removed.</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-2 fade-in duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Question bank browsing
  const [availableGroups, setAvailableGroups] = useState<{ id: number; name: string }[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<AvailableQuestion[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  // Add/remove loading states
  const [addingId, setAddingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Delete
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  const fetchExam = useCallback(async () => {
    try {
      const res = await fetch(`/api/exams/${id}`);
      const data = await res.json();
      if (data.exam) {
        setExam(data.exam);
        setName(data.exam.name);
      }
    } catch {
      setToast({ message: "Failed to load exam", type: "error" });
    } finally {
      setFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchExam();
    fetch("/api/question-groups?locale=en")
      .then((r) => r.json())
      .then((data) => setAvailableGroups(data.groups || []))
      .catch(() => {});
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, [fetchExam]);

  useEffect(() => {
    if (!selectedGroupId) {
      setAvailableQuestions([]);
      return;
    }
    fetch(`/api/questions?questionGroupId=${selectedGroupId}&locale=en`)
      .then((r) => r.json())
      .then((data) => setAvailableQuestions(data.questions || []))
      .catch(() => {});
  }, [selectedGroupId]);

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/exams/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setToast({ message: "Exam name updated!", type: "success" });
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Failed to update", type: "error" });
      }
    } catch {
      setToast({ message: "An error occurred", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (questionId: number) => {
    setAddingId(questionId);
    try {
      const res = await fetch(`/api/exams/${id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId }),
      });
      if (res.ok) {
        await fetchExam();
        setToast({ message: "Question added to exam", type: "success" });
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Failed to add question", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to add question", type: "error" });
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    setRemovingId(questionId);
    try {
      const res = await fetch(`/api/exams/${id}/questions/${questionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchExam();
        setToast({ message: "Question removed from exam", type: "success" });
      } else {
        setToast({ message: "Failed to remove question", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to remove question", type: "error" });
    } finally {
      setRemovingId(null);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteModalOpen(false);
        setToast({ message: "Exam deleted", type: "success" });
        setTimeout(() => router.push("/enter/exams"), 600);
      } else {
        setToast({ message: "Failed to delete exam", type: "error" });
        setDeleting(false);
        setDeleteModalOpen(false);
      }
    } catch {
      setToast({ message: "Failed to delete exam", type: "error" });
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const existingQuestionIds = new Set(exam?.questions.map((eq) => eq.questionId) || []);

  const filteredAvailable = availableQuestions.filter(
    (q) =>
      !existingQuestionIds.has(q.id) &&
      q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (fetching) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8" />
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-14 bg-gray-200" />
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Exam not found</p>
        <Link href="/enter/exams" className="text-indigo-600 hover:text-indigo-700 text-sm mt-2 inline-block">
          Back to Exams
        </Link>
      </div>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DeleteModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} loading={deleting} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/enter/exams" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Exams
          </Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{exam.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Exam Info + Question List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Exam Name Card */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 text-white font-semibold flex items-center justify-between" style={{ backgroundColor: settings.hero_bg_color_start }}>
                <span>Exam Details</span>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(true)}
                  className="text-xs text-white/70 hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
              <div className="bg-white p-5">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={loading || !name.trim()}
                    className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {exam.questions.length} question{exam.questions.length !== 1 ? "s" : ""} in this exam
                </p>
              </div>
            </div>

            {/* Current Questions */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700 flex items-center justify-between">
                <span>Questions in Exam ({exam.questions.length})</span>
              </div>
              <div className="bg-white divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {exam.questions.length === 0 ? (
                  <p className="px-6 py-12 text-center text-sm text-gray-400">
                    No questions yet. Browse questions on the right to add them.
                  </p>
                ) : (
                  exam.questions.map((eq, idx) => (
                    <div key={eq.id} className="px-5 py-4 hover:bg-gray-50 flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="text-sm text-gray-900 mb-2 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: eq.question.content }}
                        />
                        <div className="flex flex-wrap gap-1.5">
                          {eq.question.options.map((opt) => (
                            <span
                              key={opt.id}
                              className={`text-xs px-2 py-0.5 rounded ${
                                opt.index === eq.question.correctOptionIndex
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-gray-50 text-gray-500 border border-gray-100"
                              }`}
                            >
                              {optionLabels[opt.index]}. {opt.content}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveQuestion(eq.questionId)}
                        disabled={removingId === eq.questionId}
                        className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Remove question"
                      >
                        {removingId === eq.questionId ? (
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Question Browser */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm sticky top-24">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
                Browse Questions
              </div>
              <div className="bg-white p-4 space-y-3">
                {/* Group filter */}
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Question Group</option>
                  {availableGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>

                {/* Search */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Available questions list */}
                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {!selectedGroupId ? (
                    <p className="px-4 py-8 text-center text-xs text-gray-400">
                      Select a group to browse questions
                    </p>
                  ) : filteredAvailable.length === 0 ? (
                    <p className="px-4 py-8 text-center text-xs text-gray-400">
                      {searchTerm ? "No matches" : "All questions from this group are already added"}
                    </p>
                  ) : (
                    filteredAvailable.map((q) => {
                      const isAdding = addingId === q.id;
                      return (
                        <div key={q.id} className="px-4 py-3 flex items-start gap-2 hover:bg-gray-50">
                          <div className="flex-1 min-w-0">
                            <div
                              className="text-xs text-gray-700 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: q.content }}
                            />
                            <span className="text-xs text-gray-400 mt-0.5 block">
                              {q.options.length} options
                            </span>
                          </div>
                          <button
                            onClick={() => handleAddQuestion(q.id)}
                            disabled={isAdding}
                            className="flex-shrink-0 px-2.5 py-1 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                          >
                            {isAdding ? (
                              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
