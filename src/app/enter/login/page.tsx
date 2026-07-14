"use client";

import { useState, useEffect, useCallback } from "react";

interface LoginSettings {
  site_title: string;
  site_logo: string;
  hero_bg_color_start: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [settings, setSettings] = useState<LoginSettings | null>(null);
  const [gsiReady, setGsiReady] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(data => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setGoogleLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Google sign-in failed");
        return;
      }

      if (data.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
        const role = data.user?.role;
        window.location.href = role === "HR" ? "/enter/hr/dashboard" : "/enter/dashboard";
      }
    } catch {
      setError("An error occurred during Google sign-in");
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  // Initialize Google Identity Services
  useEffect(() => {
    // Load GIS script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: (response: { credential?: string }) => {
            if (response.credential) {
              handleGoogleCredential(response.credential);
            }
          },
        });
        setGsiReady(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: GIS script is loaded once, no need to remove
    };
  }, [handleGoogleCredential]);

  // Render Google button once GIS is ready
  useEffect(() => {
    if (gsiReady && window.google?.accounts?.id) {
      const buttonDiv = document.getElementById("google-signin-button");
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "center",
        });
      }
    }
  }, [gsiReady]);

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
        sessionStorage.setItem("user", JSON.stringify(data.user));
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
    <>
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

            {/* Google Sign-In Button */}
            <div className="mb-4">
              <div id="google-signin-button" className="w-full flex justify-center min-h-[40px]"></div>
              {googleLoading && (
                <p className="text-sm text-gray-500 text-center mt-2">Connecting to Google...</p>
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">atau masuk dengan email</span>
              </div>
            </div>

            {/* Email/Password Form */}
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
                className="w-full py-2.5 px-4 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed login-btn"
                style={{ backgroundColor: bgColor }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .login-btn:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px ${bgColor}44;
        }
        .login-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
}
