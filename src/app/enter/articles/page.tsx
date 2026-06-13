import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";

export default async function ArticlesIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("locale")?.value || "en";

  if (!token) redirect("/enter/login");

  let userRole = "";
  try {
    
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
    userRole = payload.role;
  } catch {
    redirect("/enter/login");
  }

  const isAdmin = userRole === "ADMIN";

  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      translations: { where: { locale } },
      group: { include: { translations: { where: { locale } } } },
      subgroup: { include: { translations: { where: { locale } } } },
      author: { select: { name: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Articles",
        create: "Create Article",
        status: "Status",
        group: "Group",
        subgroup: "Sub Group",
        author: "Author",
        actions: "Actions",
        noArticles: "No articles yet",
        edit: "Edit",
        delete: "Delete",
      },
      id: {
        title: "Artikel",
        create: "Buat Artikel",
        status: "Status",
        group: "Grup",
        subgroup: "Sub Grup",
        author: "Penulis",
        actions: "Aksi",
        noArticles: "Belum ada artikel",
        edit: "Edit",
        delete: "Hapus",
      },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  const statusColors: Record<string, string> = {
    PUBLIC: "bg-green-100 text-green-800",
    INTERNAL: "bg-yellow-100 text-yellow-800",
    DRAFT: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <span>{t("title")}</span>
          {isAdmin && (
            <Link
              href="/enter/articles/new"
              className="inline-flex items-center px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-md hover:bg-white/30 transition-colors"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("create")}
            </Link>
          )}
        </div>
        <div className="bg-white">
        {articles.length === 0 ? (
          <p className="px-6 py-12 text-center text-gray-500">{t("noArticles")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("group")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("subgroup")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("author")}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.map(article => {
                  const title = article.translations[0]?.title || "";
                  const groupName = article.group.translations[0]?.name || "";
                  return (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link href={`/articles/${article.id}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">
                          {title}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[article.status] || "bg-gray-100"}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{groupName}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{article.subgroup?.translations[0]?.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{article.author.name}</td>
                      <td className="px-6 py-4 text-right">
                        {isAdmin && (
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/enter/articles/${article.id}/edit`}
                              className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                              {t("edit")}
                            </Link>
                          </div>
                        )}
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
