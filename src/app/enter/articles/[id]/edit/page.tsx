"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ArticleEditor from "@/components/ArticleEditor";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [groups, setGroups] = useState<any[]>([]);
  const [subgroups, setSubgroups] = useState<any[]>([]);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });
  const [formData, setFormData] = useState({
    titleEn: "",
    titleId: "",
    contentEn: "",
    contentId: "",
    groupId: "",
    subgroupId: "",
    status: "DRAFT",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [groupsRes, articleRes, settingsRes] = await Promise.all([
        fetch("/api/groups?locale=en"),
        fetch(`/api/articles/${id}?locale=en`),
        fetch("/api/settings"),
      ]);
      const groupsData = await groupsRes.json();
      const articleData = await articleRes.json();
      
      const settingsData = await settingsRes.json();
      if (settingsData.settings) setSettings(settingsData.settings);
      setGroups(groupsData.groups);
      
      if (articleData.article) {
        const a = articleData.article;
        setFormData({
          titleEn: a.titleEn || "",
          titleId: a.titleId || "",
          contentEn: a.contentEn || "",
          contentId: a.contentId || "",
          groupId: String(a.groupId),
          subgroupId: a.subgroupId ? String(a.subgroupId) : "",
          status: a.status,
        });
        
        // Load subgroups for the group
        if (a.groupId) {
          const sgRes = await fetch(`/api/subgroups?groupId=${a.groupId}&locale=en`);
          const sgData = await sgRes.json();
          setSubgroups(sgData.subgroups);
        }
      }
      setFetching(false);
    }
    loadData();
  }, [id]);

  const loadSubgroups = async (groupId: string) => {
    if (!groupId) {
      setSubgroups([]);
      return;
    }
    const res = await fetch(`/api/subgroups?groupId=${groupId}&locale=en`);
    const data = await res.json();
    setSubgroups(data.subgroups);
  };

  const handleSubmit = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status }),
      });

      if (res.ok) {
        router.push("/enter/articles");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update article");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/enter/articles");
      }
    } catch {
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="max-w-4xl mx-auto px-4 py-8"><p className="text-gray-500">Loading...</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="px-5 py-3 text-white font-semibold flex items-center justify-between" style={{ backgroundColor: settings.hero_bg_color_start }}>
          <span>Edit Article</span>
          <button onClick={handleDelete} className="text-sm text-white/70 hover:text-white transition-colors">
            Delete
          </button>
        </div>
        <div className="bg-white p-6 space-y-6">
        {/* Group Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
          <select
            value={formData.groupId}
            onChange={(e) => {
              setFormData({ ...formData, groupId: e.target.value, subgroupId: "" });
              loadSubgroups(e.target.value);
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Group</option>
            {groups.map((g: any) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
        </div>

        {/* Subgroup Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sub Group (optional)</label>
          <select
            value={formData.subgroupId}
            onChange={(e) => setFormData({ ...formData, subgroupId: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">None</option>
            {subgroups.map((sg: any) => (
              <option key={sg.id} value={sg.id}>{sg.name}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLIC">Public</option>
            <option value="INTERNAL">Internal</option>
          </select>
        </div>

        {/* English Fields */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">English</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
              <ArticleEditor
                value={formData.contentEn}
                onChange={(html) => setFormData({ ...formData, contentEn: html })}
                placeholder="Write article content in English..."
              />
            </div>
          </div>
        </div>

        {/* Indonesian Fields */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Indonesia</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Judul (Indonesia)</label>
              <input
                type="text"
                value={formData.titleId}
                onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konten (Indonesia)</label>
              <ArticleEditor
                value={formData.contentId}
                onChange={(html) => setFormData({ ...formData, contentId: html })}
                placeholder="Tulis konten artikel dalam Bahasa Indonesia..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 pt-6 flex flex-wrap gap-3">
          <button
            onClick={() =>
              handleSubmit(formData.status)}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => handleSubmit("PUBLIC")}
            disabled={loading}
            className="px-6 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Publish as Public
          </button>
          <button
            onClick={() => handleSubmit("INTERNAL")}
            disabled={loading}
            className="px-6 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50"
          >
            Publish as Internal
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
