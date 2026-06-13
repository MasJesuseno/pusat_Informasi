"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGroupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nameEn: "",
    nameId: "",
    order: "0",
    status: "PUBLIC",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, order: parseInt(formData.order) || 0 }),
      });

      if (res.ok) {
        router.push("/enter/groups");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create group");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Group</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name (English)</label>
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
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
          <div className="flex gap-4 mt-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="PUBLIC"
                checked={formData.status === "PUBLIC"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-2 text-sm text-gray-700">Public</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="INTERNAL"
                checked={formData.status === "INTERNAL"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
              />
              <span className="ml-2 text-sm text-gray-700">Internal</span>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">Public: visible to everyone. Internal: requires login.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order / Urutan</label>
          <input
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/enter/groups")}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
