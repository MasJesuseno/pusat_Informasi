"use client";

import { useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  _count?: { articles: number };
}

interface UserForm {
  email: string;
  password: string;
  name: string;
  role: string;
}

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Administrator" },
  { value: "HR", label: "HR" },
  { value: "INTERNAL", label: "Internal" },
];

const ROLE_BADGES: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-800",
  HR: "bg-blue-100 text-blue-800",
  INTERNAL: "bg-gray-100 text-gray-800",
};

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  HR: "HR",
  INTERNAL: "Internal",
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [settings, setSettings] = useState({ hero_bg_color_start: "#4f46e5", hero_bg_color_end: "#4338ca" });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserForm>({ email: "", password: "", name: "", role: "INTERNAL" });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => { if (data.settings) setSettings(data.settings); })
      .catch(() => {});
  }, []);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const openCreate = () => {
    setModalMode("create");
    setEditingUser(null);
    setForm({ email: "", password: "", name: "", role: "INTERNAL" });
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setModalMode("edit");
    setEditingUser(user);
    setForm({ email: user.email, password: "", name: user.name, role: user.role });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      if (modalMode === "create") {
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showMessage("success", "User created successfully!");
          setModalOpen(false);
          fetchUsers();
        } else {
          const data = await res.json();
          showMessage("error", data.error || "Failed to create user");
        }
      } else if (editingUser) {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          showMessage("success", "User updated successfully!");
          setModalOpen(false);
          fetchUsers();
        } else {
          const data = await res.json();
          showMessage("error", data.error || "Failed to update user");
        }
      }
    } catch {
      showMessage("error", "Network error");
    }
    setSaving(false);
  };

  const handleDelete = async (userId: number) => {
    setDeleting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showMessage("success", "User deleted successfully!");
        setDeleteConfirm(null);
        fetchUsers();
      } else {
        const data = await res.json();
        showMessage("error", data.error || "Failed to delete user");
      }
    } catch {
      showMessage("error", "Network error");
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Message */}
      {message && (
        <div
          className={
            "p-4 rounded-lg mb-6 text-sm border " +
            (message.type === "success"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200")
          }
        >
          {message.text}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <div>
            <span>User Management</span>
            <p className="text-sm text-white/70 font-normal mt-0.5">Kelola pengguna dan hak akses</p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>
        <div className="bg-white">
        {users.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-500">No users yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Articles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ROLE_BADGES[user.role] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ROLE_LABELS[user.role] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user._count?.articles ?? 0}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          onClick={() => openEdit(user)}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user.id)}
                          className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {modalMode === "create" ? "Add User" : "Edit User"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. user@kmc.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {modalMode === "edit" ? "Password (leave blank to keep current)" : "Password"}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={modalMode === "edit" ? "Leave blank to keep current" : "Min. 6 characters"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg border transition-all ${
                        form.role === opt.value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-500"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.email || (modalMode === "create" && !form.password)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Saving..." : modalMode === "create" ? "Create User" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete User</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
