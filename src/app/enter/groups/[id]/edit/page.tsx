"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// ─── Delete Confirmation Modal ───────────────────────────────────────────────
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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Delete Group</h3>
            <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-sm text-red-700">
            All subgroups and articles in this group will also be deleted.
          </p>
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
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast Notification ──────────────────────────────────────────────────────
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
          <svg className="w-5 h-5 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// ─── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PUBLIC: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERNAL: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "PUBLIC" ? "bg-emerald-500" : "bg-amber-500"}`} />
      {status === "PUBLIC" ? "Public" : "Internal"}
    </span>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function EditGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    nameEn: "",
    nameId: "",
    order: "0",
    status: "PUBLIC",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/groups/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        if (data.group) {
          setFormData({
            nameEn: data.group.translations?.find((t: any) => t.locale === "en")?.name || "",
            nameId: data.group.translations?.find((t: any) => t.locale === "id")?.name || "",
            order: String(data.group.order ?? 0),
            status: data.group.status || "PUBLIC",
          });
        }
      } catch {
        setToast({ message: "Failed to load group data", type: "error" });
      } finally {
        setFetching(false);
      }
    }
    loadData();
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: formData.nameEn,
          nameId: formData.nameId,
          order: parseInt(formData.order) || 0,
          status: formData.status,
        }),
      });

      if (res.ok) {
        setToast({ message: "Group updated successfully!", type: "success" });
        setTimeout(() => router.push("/enter/groups"), 600);
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Failed to update group", type: "error" });
      }
    } catch {
      setToast({ message: "An error occurred while saving", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/groups/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteModalOpen(false);
        setToast({ message: "Group deleted successfully", type: "success" });
        setTimeout(() => router.push("/enter/groups"), 600);
      } else {
        const data = await res.json();
        setToast({ message: data.error || "Failed to delete group", type: "error" });
        setDeleting(false);
        setDeleteModalOpen(false);
      }
    } catch {
      setToast({ message: "Failed to delete group", type: "error" });
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // ─── Loading Skeleton ──────────────────────────────────────────────────────
  if (fetching) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-14 bg-gray-200" />
          <div className="p-6 space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-11 bg-gray-100 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/enter/groups" className="hover:text-indigo-600 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Groups
          </Link>
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Edit Group</span>
        </nav>

        {/* Main Card */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header */}
          <div
            className="px-6 py-4 text-white flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end})` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Edit Group</h1>
                <p className="text-sm text-white/70">{formData.nameEn || formData.nameId || "Untitled"}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              aria-label="Delete this group"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/80 text-sm font-medium rounded-lg hover:bg-white/20 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 space-y-7">
            {/* Name (English + Indonesian) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Name (English) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Technical Documentation"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nama (Indonesia) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={formData.nameId}
                    onChange={(e) => setFormData({ ...formData, nameId: e.target.value })}
                    placeholder="Contoh: Dokumentasi Teknis"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Status & Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Status Toggle — accessible radiogroup */}
              <fieldset>
                <legend className="block text-sm font-semibold text-gray-700 mb-1.5">Visibility</legend>
                <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-0.5 border border-gray-200" role="radiogroup" aria-label="Visibility">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={formData.status === "PUBLIC"}
                    aria-label="Public — visible to everyone"
                    onClick={() => setFormData({ ...formData, status: "PUBLIC" })}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      formData.status === "PUBLIC"
                        ? "bg-white text-emerald-700 shadow-sm border border-emerald-200"
                        : "text-gray-500 hover:text-gray-700 border border-transparent"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.status === "PUBLIC" ? "bg-emerald-500" : "bg-gray-300"}`} />
                    Public
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={formData.status === "INTERNAL"}
                    aria-label="Internal — requires login"
                    onClick={() => setFormData({ ...formData, status: "INTERNAL" })}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      formData.status === "INTERNAL"
                        ? "bg-white text-amber-700 shadow-sm border border-amber-200"
                        : "text-gray-500 hover:text-gray-700 border border-transparent"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.status === "INTERNAL" ? "bg-amber-500" : "bg-gray-300"}`} />
                    Internal
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  <StatusBadge status={formData.status} /> &mdash;{" "}
                  {formData.status === "PUBLIC"
                    ? "Visible to everyone"
                    : "Requires login to view"}
                </p>
              </fieldset>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order / Urutan</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-shadow"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Lower numbers appear first</p>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/enter/groups")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
