"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  href: string;
  icon: string;
}

interface MenuGroup {
  label: string;
  icon: string;
  items: MenuItem[];
  roles?: ("ADMIN" | "HR" | "INTERNAL")[];
}

function SidebarIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    dashboard: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    content: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    articles: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    groups: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    subgroups: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    "question-bank": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    "q-groups": (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    questions: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    exams: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    assignments: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    "my-exams": (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    admin: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    users: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    settings: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    collection: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    search: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    logout: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    ),
    collapse: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      </svg>
    ),
    expand: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      </svg>
    ),
    chevronDown: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  };

  return icons[icon] || null;
}

export default function AdminSidebar({
  siteTitle = "KMC",
  logoUrl,
  heroBgColorStart = "#4f46e5",
}: {
  siteTitle?: string;
  logoUrl?: string;
  heroBgColorStart?: string;
}) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [locale, setLocale] = useState("en");
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["content", "questionBank"]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    const cookies = document.cookie.split(";");
    const localeCookie = cookies.find(c => c.trim().startsWith("locale="));
    if (localeCookie) {
      setLocale(localeCookie.split("=")[1]);
    }

    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {}
    }

    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.user) {
          setUser(data.user);
          sessionStorage.setItem("user", JSON.stringify(data.user));
        } else {
          sessionStorage.removeItem("user");
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Don't render sidebar on login page
  if (pathname === "/enter/login") {
    return null;
  }

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setUser(null);
    sessionStorage.removeItem("user");
    window.location.href = "/";
  };

  const initials = siteTitle.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase() || "KMC";

  const toggleGroup = (name: string) => {
    setExpandedGroups(prev =>
      prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]
    );
  };

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        dashboard: "Dashboard",
        content: "Content",
        articles: "Articles",
        groups: "Groups",
        subGroups: "Sub Groups",
        questionBank: "Question Bank",
        qGroups: "Q. Groups",
        questions: "Questions",
        exams: "Exams",
        assignments: "Exam Assign.",
        myExams: "My Exams",
        admin: "Admin",
        users: "Users",
        settings: "Settings",
        myCollection: "My Collection",
        search: "Search",
        logout: "Logout",
        collapse: "Collapse",
      },
      id: {
        dashboard: "Dashboard",
        content: "Konten",
        articles: "Artikel",
        groups: "Grup",
        subGroups: "Sub Grup",
        questionBank: "Bank Soal",
        qGroups: "Kel. Soal",
        questions: "Soal",
        exams: "Ujian",
        assignments: "Penugasan",
        myExams: "Ujian Saya",
        admin: "Admin",
        users: "Pengguna",
        settings: "Pengaturan",
        myCollection: "Koleksiku",
        search: "Cari",
        logout: "Keluar",
        collapse: "Ciutkan",
      },
    };
    return dict[locale]?.[key] || dict.en?.[key] || key;
  };

  const isActive = (href: string) => {
    if (href === "/enter/dashboard") {
      return pathname === "/enter/dashboard";
    }
    return pathname?.startsWith(href);
  };

  const isExactActive = (href: string) => {
    return pathname === href;
  };

  const menuGroups: MenuGroup[] = [
    {
      label: "content",
      icon: "content",
      items: [                    { label: "groups", href: "/enter/groups", icon: "groups" },
                        { label: "subGroups", href: "/enter/subgroups", icon: "subgroups" },
                        { label: "articles", href: "/enter/articles", icon: "articles" },
                      ],
                      roles: ["ADMIN", "HR"],
    },
    {
      label: "questionBank",
      icon: "question-bank",
      items: [
        { label: "qGroups", href: "/enter/question-groups", icon: "q-groups" },
        { label: "questions", href: "/enter/questions", icon: "questions" },
        { label: "exams", href: "/enter/exams", icon: "exams" },
        { label: "assignments", href: "/enter/exam-assignments", icon: "assignments" },
      ],
      roles: ["ADMIN", "HR"],
    },
    {
      label: "myExams",
      icon: "my-exams",
      items: [
        { label: "myExams", href: "/enter/my-exams", icon: "my-exams" },
      ],
      roles: ["INTERNAL"],
    },
    {
      label: "admin",
      icon: "admin",
      items: [
        { label: "users", href: "/enter/users", icon: "users" },
        { label: "settings", href: "/enter/settings", icon: "settings" },
      ],
      roles: ["ADMIN"],
    },
  ];

  const singleLinks: { label: string; href: string; icon: string; roles?: ("ADMIN" | "HR" | "INTERNAL")[]; external?: boolean }[] = [
    { label: "dashboard", href: "/enter/dashboard", icon: "dashboard" },
    { label: "myCollection", href: "/enter/my-collection", icon: "collection" },
    { label: "search", href: "/search", icon: "search", external: true },
  ];

  const userRole = user?.role || "";

  const showGroup = (group: MenuGroup) => {
    if (!group.roles) return true;
    return group.roles.includes(userRole as any);
  };

  const showLink = (link: typeof singleLinks[0]) => {
    if (!link.roles) return true;
    return link.roles.includes(userRole as any);
  };

  return (
    <>
      {/* Dynamic spacer for content area */}
      <style>{`
        .sidebar-content-area {
          margin-left: ${collapsed ? "4rem" : "16rem"};
        }
        @media (max-width: 767px) {
          .sidebar-content-area {
            margin-left: 0;
          }
        }
      `}</style>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-50 w-12 h-12 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 hover:shadow-xl transition-all"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Logo + Toggle */}
        <div className={`flex items-center border-b border-gray-200 h-16 ${collapsed ? "justify-center" : "justify-between"} px-3`}>
          {!collapsed && (
            <Link href="/enter/dashboard" className="flex items-center space-x-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="h-8 w-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: heroBgColorStart }}>
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              <span className="text-base font-semibold text-gray-900 truncate max-w-[120px]">
                {siteTitle === "Knowledge Management Center" ? "KMC" : siteTitle}
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/enter/dashboard">
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="h-8 w-8 object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: heroBgColorStart }}>
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title={t("collapse")}
          >
            <SidebarIcon icon={collapsed ? "expand" : "collapse"} />
          </button>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {/* Single links */}
          {singleLinks.map(link => {
            if (!showLink(link)) return null;
            const active = isExactActive(link.href);
            const linkClasses = `
              flex items-center rounded-lg transition-all duration-200 group
              ${collapsed ? "justify-center w-12 h-10 mx-auto" : "px-3 py-2.5 space-x-3"}
              ${active
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `;
            const iconMarkup = (
              <>
                <span className={active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600 transition-colors"}>
                  <SidebarIcon icon={link.icon} />
                </span>
                {!collapsed && <span className="text-sm truncate">{t(link.label)}</span>}
              </>
            );
            if (link.external) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClasses}
                  title={collapsed ? t(link.label) : undefined}
                >
                  {iconMarkup}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={linkClasses}
                title={collapsed ? t(link.label) : undefined}
              >
                {iconMarkup}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="border-t border-gray-100 my-2" />

          {/* Group menus */}
          {menuGroups.map(group => {
            if (!showGroup(group)) return null;
            const isExpanded = expandedGroups.includes(group.label);
            const groupActive = group.items.some(item => isActive(item.href));

            return (
              <div key={group.label}>
                {/* Group header */}
                <button
                  onClick={() => !collapsed && toggleGroup(group.label)}
                  className={`
                    w-full flex items-center rounded-lg transition-all duration-200 group
                    ${collapsed ? "justify-center w-12 h-10 mx-auto" : "px-3 py-2.5 space-x-3"}
                    ${groupActive
                      ? "bg-green-600 text-white font-medium shadow-sm"
                      : "bg-gray-50/80 text-gray-700 hover:bg-green-50 hover:text-green-700"
                    }
                  `}
                  title={collapsed ? t(group.label) : undefined}
                >
                  <span className={groupActive ? "text-white" : "text-gray-400 group-hover:text-green-600 transition-colors"}>
                    <SidebarIcon icon={group.icon} />
                  </span>
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">{t(group.label)}</span>
                      <span className={groupActive ? "text-white/70" : "text-gray-400"}>
                        <SidebarIcon icon="chevronDown" />
                      </span>
                    </>
                  )}
                </button>

                {/* Sub-items */}
                {(!collapsed && isExpanded) && (
                  <div className="ml-2 mt-1 space-y-0.5 bg-white rounded-lg p-1.5 border border-gray-200 shadow-sm">
                    {group.items.map(item => {
                      const itemActive = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`
                            flex items-center space-x-3 rounded-md transition-all duration-200
                            ${collapsed ? "justify-center w-12 h-10 mx-auto" : "px-3 py-2"}
                            ${itemActive
                              ? "bg-gray-100 text-gray-800 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }
                          `}
                        >
                          <span className={`${itemActive ? "text-gray-700" : "text-gray-400"} transition-colors`}>
                            <SidebarIcon icon={item.icon} />
                          </span>
                          {!collapsed && <span className="text-sm truncate">{t(item.label)}</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="border-t border-gray-200 p-3">
          {user ? (
            <>
              {!collapsed && (
                <div className="flex items-center space-x-3 mb-2 px-1">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: heroBgColorStart }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center rounded-lg transition-all duration-200 text-gray-500 hover:text-red-600 hover:bg-red-50 group
                  ${collapsed ? "justify-center w-12 h-10 mx-auto" : "px-3 py-2.5 space-x-3"}
                `}
                title={collapsed ? t("logout") : undefined}
              >
                <span className="group-hover:text-red-500 transition-colors">
                  <SidebarIcon icon="logout" />
                </span>
                {!collapsed && <span className="text-sm">{t("logout")}</span>}
              </button>
            </>
          ) : (
            <Link
              href="/enter/login"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {!collapsed && <span>Sign In</span>}
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
