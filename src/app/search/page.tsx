import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { getAllSettings } from "@/lib/settings";

interface SearchPageProps {
  searchParams: Promise<{ q?: string; groupId?: string; subgroupId?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const params = await searchParams;
  const query = params.q || "";
  const groupId = params.groupId;
  const subgroupId = params.subgroupId;

  const where: any = { status: "PUBLIC" };
  if (groupId) where.groupId = parseInt(groupId);
  if (subgroupId) where.subgroupId = parseInt(subgroupId);
  if (query) {
    where.translations = {
      some: {
        locale,
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
        ],
      },
    };
  }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      translations: { where: { locale } },
      group: { include: { translations: { where: { locale } } } },
      subgroup: { include: { translations: { where: { locale } } } },
    },
  });

  const groups = await prisma.group.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
      subgroups: { orderBy: { order: "asc" }, include: { translations: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string, p?: Record<string, string>) => {
    const translations: Record<string, any> = {
      en: {
        title: "Search Results",
        noResults: `No results found for "${query}"`,
        resultCount: `${articles.length} result(s) found`,
        searchPlaceholder: "Search articles...",
        allGroups: "All Groups",
      },
      id: {
        title: "Hasil Pencarian",
        noResults: `Tidak ditemukan hasil untuk "${query}"`,
        resultCount: `${articles.length} hasil ditemukan`,
        searchPlaceholder: "Cari artikel...",
        allGroups: "Semua Grup",
      },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Groups */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="sticky top-20 overflow-hidden rounded-lg border border-gray-200">
            <div
              className="px-4 py-3 text-white font-semibold"
              style={{ backgroundColor: settings.hero_bg_color_start }}
            >
              {t("allGroups")}
            </div>
            <div className="bg-white p-3 space-y-1">
              <Link
                href="/search"
                className={`block px-3 py-2 text-sm rounded-md ${!groupId ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
              >
                {t("allGroups")}
              </Link>
              {groups.map(group => {
                const groupName = group.translations.find(t => t.locale === locale)?.name || group.translations[0]?.name || "";
                return (
                  <div key={group.id}>
                    <Link
                      href={`/search?groupId=${group.id}`}
                      className={`block px-3 py-2 text-sm rounded-md ${groupId === String(group.id) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      {groupName}
                    </Link>
                    {group.subgroups.map(sg => {
                      const sgName = sg.translations.find(t => t.locale === locale)?.name || sg.translations[0]?.name || "";
                      return (
                        <Link
                          key={sg.id}
                          href={`/search?groupId=${group.id}&subgroupId=${sg.id}`}
                          className={`block pl-6 pr-3 py-1.5 text-xs rounded-md ${subgroupId === String(sg.id) ? "bg-indigo-50 text-indigo-700 font-medium" : "text-gray-500 hover:bg-gray-50"}`}
                        >
                          {sgName}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <form action="/search" method="GET" className="mb-6">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder={t("searchPlaceholder")}
                className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-base"
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Results Section */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div
              className="px-5 py-3 text-white font-semibold flex items-center justify-between"
              style={{ backgroundColor: settings.hero_bg_color_start }}
            >
              <span>{t("title")}</span>
              <span className="text-sm text-white/80 font-normal">{articles.length} {locale === "id" ? "hasil" : "result(s)"}</span>
            </div>
            <div className="bg-white p-4">
              {articles.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">{t("noResults")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {articles.map(article => {
                    const title = article.translations[0]?.title || "";
                    const content = article.translations[0]?.content || "";
                    const groupName = article.group.translations[0]?.name || "";
                    const subgroupName = article.subgroup?.translations[0]?.name || null;
                    const date = new Date(article.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    });
                    return (
                      <Link key={article.id} href={`/articles/${article.id}`} className="block group">
                        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                            <span className="bg-gray-100 px-2 py-0.5 rounded">{groupName}</span>
                            {subgroupName && <><span>/</span><span>{subgroupName}</span></>}
                          </div>
                          <h3 className="text-base font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {content.replace(/<[^>]*>/g, "").substring(0, 200)}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">{date}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
