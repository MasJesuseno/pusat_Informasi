"use client";

import { useState, useEffect } from "react";

interface LoginSettings {
  site_title: string;
  site_logo: string;
  hero_bg_color_start: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<LoginSettings | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const bgColor = settings?.hero_bg_color_start || "#4f46e5";
  const siteTitle = settings?.site_title || "Knowledge Management Center";
  const logoUrl = settings?.site_logo || "";
  const initials = siteTitle.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase() || "KMC";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        // Save user to sessionStorage for immediate header update
        sessionStorage.setItem("user", JSON.stringify(data.user));
        // Full page reload to re-mount Header with sessionStorage data
        const role = data.user?.role;
        window.location.href = role === "HR" ? "/enter/hr/dashboard" : "/enter/dashboard";
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 overflow-hidden"
              style={{ backgroundColor: bgColor }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="w-10 h-10 object-contain" />
              ) : (
                <span className="text-white text-lg font-bold">{initials}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{siteTitle}</h1>
            <p className="text-gray-500 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="admin@kmc.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: bgColor }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(0.9)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
