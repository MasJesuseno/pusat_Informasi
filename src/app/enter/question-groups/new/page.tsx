"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewQuestionGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ nameEn: "", nameId: "", order: 0, status: "PUBLIC" });
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/question-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/enter/question-groups");
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

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="px-5 py-3 text-white font-semibold" style={{ backgroundColor: settings.hero_bg_color_start }}>
          Create Question Group
        </div>
        <form onSubmit={handleSubmit}>
          <div className="bg-white p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama (Indonesia)</label>
              <input
                type="text"
                value={formData.nameId}
                onChange={(e) => setFormData({ ...formData, nameId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="PUBLIC">Public</option>
                <option value="INTERNAL">Internal</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
            <div className="border-t border-gray-200 pt-4 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
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
