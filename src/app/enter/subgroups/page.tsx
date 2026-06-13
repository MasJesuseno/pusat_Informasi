import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";

function StatusBadge({ status, locale }: { status: string; locale: string }) {
  const colors: Record<string, string> = {
    PUBLIC: "bg-emerald-50 text-emerald-700 border-emerald-200",
    INTERNAL: "bg-amber-50 text-amber-700 border-amber-200",
  };

  const labels: Record<string, Record<string, string>> = {
    en: { PUBLIC: "Public", INTERNAL: "Internal" },
    id: { PUBLIC: "Publik", INTERNAL: "Internal" },
  };

  const dotColors: Record<string, string> = {
    PUBLIC: "bg-emerald-500",
    INTERNAL: "bg-amber-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[status] || "bg-gray-400"}`} />
      {labels[locale]?.[status] || labels["en"]?.[status] || status}
    </span>
  );
}

export default async function SubGroupsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("locale")?.value || "en";

  if (!token) redirect("/enter/login");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    if (payload.role !== "ADMIN" && payload.role !== "HR") redirect("/enter/dashboard");
  } catch {
    redirect("/enter/login");
  }

  const subgroups = await prisma.subGroup.findMany({
    orderBy: [{ groupId: "asc" }, { order: "asc" }],
    include: {
      translations: true,
      group: { include: { translations: true } },
      _count: { select: { articles: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Sub Groups",
        create: "Create Sub Group",
        name: "Name",
        status: "Status",
        group: "Parent Group",
        order: "Order",
        articles: "Articles",
        noSubgroups: "No subgroups yet",
        actions: "Actions",
        edit: "Edit",
        startMessage: "Get started by creating your first sub group.",
      },
      id: {
        title: "Sub Grup",
        create: "Buat Sub Grup",
        name: "Nama",
        status: "Status",
        group: "Grup Induk",
        order: "Urutan",
        articles: "Artikel",
        noSubgroups: "Belum ada sub grup",
        actions: "Aksi",
        edit: "Edit",
        startMessage: "Mulai dengan membuat sub grup pertama Anda.",
      },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div
          className="px-6 py-4 text-white flex items-center justify-between"
          style={{
            background: settings.hero_bg_color_start
              ? `linear-gradient(135deg, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end || settings.hero_bg_color_start})`
              : "linear-gradient(135deg, #4f46e5, #4338ca)",
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold">{t("title")}</h1>
              <p className="text-sm text-white/70">{subgroups.length} sub group{subgroups.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Link
            href="/enter/subgroups/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 text-white text-sm font-medium rounded-lg hover:bg-white/25 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("create")}
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white">
          {subgroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-900 font-medium mb-1">{t("noSubgroups")}</p>
              <p className="text-sm text-gray-500 mb-6">{t("startMessage")}</p>
              <Link
                href="/enter/subgroups/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t("create")}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("name")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t("status")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        {t("group")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                        {t("order")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t("articles")}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subgroups.map(sg => {
                    const nameEn = sg.translations.find(t => t.locale === "en")?.name || "";
                    const nameId = sg.translations.find(t => t.locale === "id")?.name || "";
                    const groupName = sg.group.translations.find(t => t.locale === "en")?.name || "";
                    return (
                      <tr key={sg.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-100 transition-colors">
                              <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{nameEn}</div>
                              {nameId && <div className="text-xs text-gray-400">{nameId}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={sg.status} locale={locale} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            {groupName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center justify-center w-7 h-6 rounded-md bg-gray-50 text-xs font-medium text-gray-600 border border-gray-100">
                            {sg.order}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {sg._count.articles}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/enter/subgroups/${sg.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {t("edit")}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
