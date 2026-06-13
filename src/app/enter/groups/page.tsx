import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";

export default async function GroupsPage() {
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

  const groups = await prisma.group.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
      _count: { select: { articles: true, subgroups: true } },
    },
  });

  const settings = await getAllSettings();

  const statusColors: Record<string, string> = {
    PUBLIC: "bg-green-100 text-green-800",
    INTERNAL: "bg-yellow-100 text-yellow-800",
  };

  const statusLabels: Record<string, Record<string, string>> = {
    en: { PUBLIC: "Public", INTERNAL: "Internal" },
    id: { PUBLIC: "Publik", INTERNAL: "Internal" },
  };

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: { title: "Groups", create: "Create Group", name: "Name", status: "Status", order: "Order", articles: "Articles", subgroups: "Sub Groups", noGroups: "No groups yet", actions: "Actions" },
      id: { title: "Grup", create: "Buat Grup", name: "Nama", status: "Status", order: "Urutan", articles: "Artikel", subgroups: "Sub Grup", noGroups: "Belum ada grup", actions: "Aksi" },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <span>{t("title")}</span>
          <Link href="/enter/groups/new" className="inline-flex items-center px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {t("create")}
          </Link>
        </div>
        <div className="bg-white">
        {groups.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-500">{t("noGroups")}</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("name")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("order")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("subgroups")}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("articles")}</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map(g => {
                const nameEn = g.translations.find(t => t.locale === "en")?.name || "";
                const nameId = g.translations.find(t => t.locale === "id")?.name || "";
                return (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{nameEn}</div>
                      <div className="text-xs text-gray-500">{nameId}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[g.status] || "bg-gray-100"}`}>
                        {statusLabels[locale]?.[g.status] || g.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g.order}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g._count.subgroups}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{g._count.articles}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/enter/groups/${g.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-700">
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      </div>
    </div>
  );
}
