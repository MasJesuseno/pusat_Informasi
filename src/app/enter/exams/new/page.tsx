"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  content: string;
  order: number;
  options: { id: number; index: number; content: string }[];
  questionGroup: { id: number; translations: { locale: string; name: string }[] };
}

interface QuestionGroup {
  id: number;
  name: string;
}

export default function NewExamPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchingQuestions, setFetchingQuestions] = useState(false);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  useEffect(() => {
    fetch("/api/question-groups?locale=en")
      .then((r) => r.json())
      .then((data) => setGroups(data.groups || []))
      .catch(() => {});
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedGroupId) {
      setQuestions([]);
      return;
    }
    setFetchingQuestions(true);
    fetch(`/api/questions?questionGroupId=${selectedGroupId}&locale=en`)
      .then((r) => r.json())
      .then((data) => setQuestions(data.questions || []))
      .catch(() => {})
      .finally(() => setFetchingQuestions(false));
  }, [selectedGroupId]);

  const toggleQuestion = (qId: number) => {
    setSelectedIds((prev) =>
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), questionIds: selectedIds }),
      });
      if (res.ok) {
        router.push("/enter/exams");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create exam");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: settings.hero_bg_color_start }}>
          Create Exam
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 space-y-6">
            {/* Exam Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midterm Assessment"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Question Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Questions ({selectedIds.length} selected)
              </label>

              {/* Group Filter */}
              <div className="flex items-center gap-3 mb-4">
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : "")}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Question Group</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Questions List */}
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {!selectedGroupId ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-400">
                    Select a question group to browse questions
                  </p>
                ) : fetchingQuestions ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-400">Loading questions...</p>
                ) : filteredQuestions.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-400">
                    {searchTerm ? "No questions match your search" : "No questions in this group"}
                  </p>
                ) : (
                  filteredQuestions.map((q) => {
                    const isSelected = selectedIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`px-4 py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-indigo-50" : ""
                        }`}
                        onClick={() => toggleQuestion(q.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleQuestion(q.id)}
                          className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-sm text-gray-900 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: q.content }}
                          />
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">
                              {q.options.length} options
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-gray-200 pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : `Save (${selectedIds.length} questions)`}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
