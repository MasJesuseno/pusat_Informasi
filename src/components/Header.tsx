"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  siteTitle?: string;
  logoUrl?: string;
  heroBgColorStart?: string;
}

function ChevronDown({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

interface DropdownItem {
  label: string;
  href: string;
}

function NavDropdown({
  label,
  items,
  isOpen,
  onToggle,
  onClose,
}: {
  label: string;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div className="relative" onMouseLeave={onClose}>
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <>
          <div className="absolute top-full left-0 w-full h-2" />
          <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                onClick={onClose}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function MobileSection({
  label,
  items,
  defaultOpen = false,
  onItemClick,
}: {
  label: string;
  items: DropdownItem[];
  defaultOpen?: boolean;
  onItemClick?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pl-4 space-y-1 pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50"
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ siteTitle = "KMC", logoUrl, heroBgColorStart = "#4f46e5" }: HeaderProps) {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [locale, setLocale] = useState("en");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const localeCookie = cookies.find(c => c.trim().startsWith("locale="));
    if (localeCookie) {
      setLocale(localeCookie.split("=")[1]);
    }

    fetch("/api/auth/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  const switchLocale = (newLocale: string) => {
    setLocale(newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  const isInEnter = pathname?.startsWith("/enter");

  const initials = siteTitle.split(" ").map(w => w[0]).join("").substring(0, 3).toUpperCase() || "KMC";

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => prev === name ? null : name);
  };

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        home: "Home",
        search: "Search",
        content: "Content",
        questionBank: "Question Bank",
        examAssignment: "Exam Assignments",
        myExams: "My Exams",
        admin: "Admin",
        logout: "Logout",
        donate: "Donate",
      },
      id: {
        home: "Beranda",
        search: "Cari",
        content: "Konten",
        questionBank: "Bank Soal",
        examAssignment: "Penugasan Ujian",
        myExams: "Ujian Saya",
        admin: "Admin",
        logout: "Keluar",
        donate: "Donasi",
      },
    };
    return dict[locale]?.[key] || dict.en?.[key] || key;
  };

  const contentLinks: DropdownItem[] = [
    { label: locale === "id" ? "Artikel" : "Articles", href: "/enter/articles" },
    { label: locale === "id" ? "Grup" : "Groups", href: "/enter/groups" },
    { label: locale === "id" ? "Sub Grup" : "Sub Groups", href: "/enter/subgroups" },
  ];

  const questionLinks: DropdownItem[] = [
    { label: locale === "id" ? "Kelompok Soal" : "Q. Groups", href: "/enter/question-groups" },
    { label: locale === "id" ? "Soal" : "Questions", href: "/enter/questions" },
    { label: locale === "id" ? "Ujian" : "Exams", href: "/enter/exams" },
    { label: locale === "id" ? "Penugasan Ujian" : "Exam Assignments", href: "/enter/exam-assignments" },
  ];

  const myExamLinks: DropdownItem[] = [
    { label: locale === "id" ? "Ujian Saya" : "My Exams", href: "/enter/my-exams" },
  ];

  const adminLinks: DropdownItem[] = [
    { label: locale === "id" ? "Pengguna" : "Users", href: "/enter/users" },
    { label: locale === "id" ? "Pengaturan" : "Settings", href: "/enter/settings" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href={user ? "/enter/dashboard" : "/"} className="flex items-center space-x-2">
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} className="h-8 w-8 object-contain" />
              ) : (
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{initials}</span>
                </div>
              )}
              <span className="text-lg font-semibold text-gray-900">
                {siteTitle === "Knowledge Management Center" ? "KMC" : siteTitle}
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {(!isInEnter || user) && (
              <>
                <Link
                  href={user ? "/enter/dashboard" : "/"}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t("home")}
                </Link>
                <Link
                  href="/search"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {t("search")}
                </Link>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-1">
                <NavDropdown
                  label={t("content")}
                  items={contentLinks}
                  isOpen={openDropdown === "content"}
                  onToggle={() => toggleDropdown("content")}
                  onClose={() => setOpenDropdown(null)}
                />

                <NavDropdown
                  label={t("questionBank")}
                  items={questionLinks}
                  isOpen={openDropdown === "questionBank"}
                  onToggle={() => toggleDropdown("questionBank")}
                  onClose={() => setOpenDropdown(null)}
                />

                {user.role === "INTERNAL" && (
                  <NavDropdown
                    label={t("myExams")}
                    items={myExamLinks}
                    isOpen={openDropdown === "myExams"}
                    onToggle={() => toggleDropdown("myExams")}
                    onClose={() => setOpenDropdown(null)}
                  />
                )}

                {user.role === "ADMIN" && (
                  <NavDropdown
                    label={t("admin")}
                    items={adminLinks}
                    isOpen={openDropdown === "admin"}
                    onToggle={() => toggleDropdown("admin")}
                    onClose={() => setOpenDropdown(null)}
                  />
                )}
              </div>
            )}
          </nav>

          {/* Right section: Lang switcher + User */}
          <div className="flex items-center space-x-3">
            {/* Language switcher */}
            <div className="flex items-center space-x-1 border border-gray-200 rounded-lg p-0.5">
              <button
                onClick={() => switchLocale("en")}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  locale === "en"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLocale("id")}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  locale === "id"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ID
              </button>
            </div>

            {/* Desktop user area */}
            {user && (
              <div className="hidden md:flex items-center space-x-3">
                <span className="text-sm text-gray-500">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            )}

            {!user && !isInEnter && (
              <a
                href="https://digital.dompetdhuafa.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: heroBgColorStart }}
              >
                {t("donate")}
              </a>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-gray-100 pt-2">
            {(!isInEnter || user) && (
              <>
                <Link
                  href={user ? "/enter/dashboard" : "/"}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("home")}
                </Link>
                <Link
                  href="/search"
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {t("search")}
                </Link>
              </>
            )}
            {user && (
              <>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <MobileSection label={t("content")} items={contentLinks} defaultOpen onItemClick={() => setMobileOpen(false)} />
                  <MobileSection label={t("questionBank")} items={questionLinks} onItemClick={() => setMobileOpen(false)} />
                  {user.role === "INTERNAL" && <MobileSection label={t("myExams")} items={myExamLinks} onItemClick={() => setMobileOpen(false)} />}
                  {user.role === "ADMIN" && <MobileSection label={t("admin")} items={adminLinks} onItemClick={() => setMobileOpen(false)} />}
                </div>
                <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
                  <div className="px-3 flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                  >
                    {t("logout")}
                  </button>
                </div>
              </>
            )}
            {!user && !isInEnter && (
              <a
                href="https://digital.dompetdhuafa.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm font-medium text-white rounded-md text-center"
                style={{ backgroundColor: heroBgColorStart }}
              >
                {t("donate")}
              </a>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
