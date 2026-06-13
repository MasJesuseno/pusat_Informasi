import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { getAllSettings } from "@/lib/settings";
import { verifyToken } from "@/lib/auth";
import CategoryBox from "@/components/CategoryBox";
import ArticleCard from "@/components/ArticleCard";

async function getData(locale: string, userRole: string) {
  // Filter groups based on auth status
  const groupWhere: any = {};
  if (userRole === "PUBLIC") {
    groupWhere.status = "PUBLIC";
  }

  const groups = await prisma.group.findMany({
    where: groupWhere,
    orderBy: { order: "asc" },
    include: {
      translations: true,
    },
  });

  const articles = await prisma.article.findMany({
    where: { status: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: {
      translations: { where: { locale } },
    },
  });

  return { groups, articles };
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";

  // Determine user role
  const token = cookieStore.get("token")?.value;
  let userRole = "PUBLIC";
  if (token) {
    const payload = verifyToken(token);
    if (payload) userRole = payload.role;
  }

  const { groups, articles } = await getData(locale, userRole);
  const settings = await getAllSettings();

  const heroTitle = locale === "id" ? settings.hero_title_id : settings.hero_title_en;
  const heroSubtitle = locale === "id" ? settings.hero_subtitle_id : settings.hero_subtitle_en;

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        searchPlaceholder: "Search articles...",
        browseTitle: "Browse by Category",
        recentArticles: "Recent Articles",
        noArticles: "No articles found",
        viewAll: "View All",
      },
      id: {
        searchPlaceholder: "Cari artikel...",
        browseTitle: "Kategori Informasi",
        recentArticles: "Artikel Terbaru",
        noArticles: "Tidak ada artikel ditemukan",
        viewAll: "Lihat Semua",
      },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  const heroBgStyle = settings.hero_bg_image
    ? `linear-gradient(to bottom right, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end}), url(${settings.hero_bg_image})`
    : `linear-gradient(to bottom right, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end})`;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="text-white"
        style={{
          background: heroBgStyle,
          backgroundSize: "cover",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heroTitle}</h1>
          <p className="text-lg opacity-80 mb-8">{heroSubtitle}</p>
          
          {/* Search Bar */}
          <form action={`/search`} method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="q"
                placeholder={t("searchPlaceholder")}
                className="w-full px-5 py-4 pr-12 rounded-xl text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 text-base"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Groups Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div
          className="rounded-t-lg px-5 py-3 text-white font-semibold text-lg"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          {t("browseTitle")}
        </div>
        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {groups.map(group => (
              <CategoryBox key={group.id} group={group} locale={locale} hoverColor={settings.hover_category_color} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      {articles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div
            className="rounded-t-lg px-5 py-3 text-white font-semibold text-lg flex items-center justify-between"
            style={{ backgroundColor: settings.hero_bg_color_start }}
          >
            <span>{t("recentArticles")}</span>
            <Link href="/search" className="text-sm text-white/80 hover:text-white transition-colors">
              {t("viewAll")} &rarr;
            </Link>
          </div>
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {articles.map(article => {
                const articleTitle = article.translations[0]?.title || "";
                return (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={articleTitle}
                    hoverColor={settings.hover_category_color}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
