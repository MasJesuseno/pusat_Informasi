"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{type:"success"|"error";text:string}|null>(null);
  const [settings, setSettings] = useState({
    site_title: "Knowledge Management Center",
    site_logo: "",
    hero_title_en: "Knowledge Management Center",
    hero_title_id: "Pusat Manajemen Pengetahuan",
    hero_subtitle_en: "Find answers and information quickly and easily",
    hero_subtitle_id: "Temukan jawaban dan informasi dengan cepat dan mudah",
    hero_bg_color_start: "#4f46e5",
    hero_bg_color_end: "#1e1b4b",
    hero_bg_image: "",
    hover_category_color: "#4f46e5",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Settings saved successfully!" });
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    }
    setSaving(false);
  };

  const handleUpload = async (field: string, file: File) => {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(prev => ({ ...prev, [field]: data.url }));
        setMessage({ type: "success", text: "File uploaded successfully!" });
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: data.error || "Upload failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed - network error" });
    }
    setUploading(false);
  };

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Message */}
      {message && (
        <div className={"p-4 rounded-lg mb-6 text-sm " + (message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200")}>
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 mb-8">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <span>Site Settings</span>
          <button onClick={handleSave} disabled={saving}
            className="px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 disabled:opacity-50 transition-colors">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
        <div className="bg-white p-6">
          <div className="space-y-8">
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Title (Browser Tab)</label>
              <input type="text" value={settings.site_title} onChange={e => update("site_title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              <div className="flex items-center space-x-4">
                {settings.site_logo ? (
                  <img src={settings.site_logo} alt="Logo" className="h-12 w-12 object-contain rounded border border-gray-200" />
                ) : (
                  <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">KMC</div>
                )}
                <label className={"px-4 py-2 border text-sm rounded-lg cursor-pointer transition-colors " + (uploading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 hover:bg-gray-50")}>
                  {uploading ? "Uploading..." : "Upload Logo"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading}
                    onChange={e => { const f = e.target.files?.[0]; if (f && !uploading) handleUpload("site_logo", f); }} />
                </label>
                {settings.site_logo && (
                  <button onClick={() => update("site_logo", "")} className="text-sm text-red-600 hover:text-red-700">Remove</button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
              <input type="text" value={settings.hero_title_en} onChange={e => update("hero_title_en", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title (Indonesian)</label>
              <input type="text" value={settings.hero_title_id} onChange={e => update("hero_title_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (English)</label>
              <input type="text" value={settings.hero_subtitle_en} onChange={e => update("hero_subtitle_en", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle (Indonesian)</label>
              <input type="text" value={settings.hero_subtitle_id} onChange={e => update("hero_subtitle_id", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color (Start)</label>
              <div className="flex space-x-2">
                <input type="color" value={settings.hero_bg_color_start} onChange={e => update("hero_bg_color_start", e.target.value)}
                  className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                <input type="text" value={settings.hero_bg_color_start} onChange={e => update("hero_bg_color_start", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color (End)</label>
              <div className="flex space-x-2">
                <input type="color" value={settings.hero_bg_color_end} onChange={e => update("hero_bg_color_end", e.target.value)}
                  className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
                <input type="text" value={settings.hero_bg_color_end} onChange={e => update("hero_bg_color_end", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image (optional)</label>
            <p className="text-xs text-gray-400 mb-3">Recommended size: <strong>1920 x 600 px</strong> (landscape, max. 5MB)</p>
            {settings.hero_bg_image && (
              <div className="mb-2">
                <img src={settings.hero_bg_image} alt="Hero BG" className="h-32 w-full object-cover rounded-lg border border-gray-200" />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <label className={"px-4 py-2 border text-sm rounded-lg cursor-pointer transition-colors " + (uploading ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white border-gray-300 hover:bg-gray-50")}>
                {uploading ? "Uploading..." : (settings.hero_bg_image ? "Change Image" : "Upload Image")}
                <input type="file" accept="image/*" className="hidden" disabled={uploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f && !uploading) handleUpload("hero_bg_image", f); }} />
              </label>
              {settings.hero_bg_image && (
                <button onClick={() => update("hero_bg_image", "")} className="text-sm text-red-600 hover:text-red-700">Remove Image</button>
              )}
              <input type="text" value={settings.hero_bg_image} onChange={e => update("hero_bg_image", e.target.value)}
                placeholder="Or paste image URL..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="text-white rounded-lg p-8 text-center"
              style={{
                background: settings.hero_bg_image
                  ? `linear-gradient(to bottom right, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end}), url(${settings.hero_bg_image})`
                  : `linear-gradient(to bottom right, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end})`,
                backgroundSize: "cover",
                backgroundBlendMode: "overlay",
              }}>
              <h3 className="text-xl font-bold mb-2">{settings.hero_title_en}</h3>
              <p className="text-sm opacity-80">{settings.hero_subtitle_en}</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hover Kategori</h2>
          <p className="text-sm text-gray-500 mb-4">Sesuaikan warna efek hover pada kartu kategori dan artikel.</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warna Hover</label>
            <div className="flex space-x-2">
              <input type="color" value={settings.hover_category_color} onChange={e => update("hover_category_color", e.target.value)}
                className="h-10 w-12 rounded border border-gray-300 cursor-pointer" />
              <input type="text" value={settings.hover_category_color} onChange={e => update("hover_category_color", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </section>
      </div>
        </div>
      </div>
    </div>
  );
}