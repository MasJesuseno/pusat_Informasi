"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Exam {
  id: number;
  name: string;
  _count: { questions: number };
}

export default function NewExamAssignmentPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | "">("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => setExams(data.exams || []))
      .catch(() => {});
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        // Only show INTERNAL users
        const internalUsers = (data.users || []).filter((u: User) => u.role === "INTERNAL");
        setUsers(internalUsers);
      })
      .catch(() => {});
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || selectedUserIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/exam-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId: selectedExamId, userIds: selectedUserIds }),
      });
      if (res.ok) {
        router.push("/enter/exam-assignments");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedExam = exams.find((e) => e.id === selectedExamId);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: settings.hero_bg_color_start }}>
          New Exam Assignment
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 space-y-6">
            {/* Select Exam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam *</label>
              <select
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Choose an exam...</option>
                {exams.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex._count.questions} questions)
                  </option>
                ))}
              </select>
              {selectedExam && (
                <p className="text-xs text-gray-400 mt-1">
                  {selectedExam._count.questions} questions will be assigned
                </p>
              )}
            </div>

            {/* Select Users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Internal Users * ({selectedUserIds.length} selected)
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-64 overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-400">
                    {searchTerm ? "No users match your search" : "No internal users found"}
                  </p>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelected = selectedUserIds.includes(u.id);
                    return (
                      <div
                        key={u.id}
                        className={`px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                          isSelected ? "bg-indigo-50" : ""
                        }`}
                        onClick={() => toggleUser(u.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleUser(u.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                        <span className="text-xs text-gray-400 capitalize">{u.role.toLowerCase()}</span>
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
                disabled={loading || !selectedExamId || selectedUserIds.length === 0}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : `Assign to ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? "s" : ""}`}
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
