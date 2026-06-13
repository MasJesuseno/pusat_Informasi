import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getAllSettings } from "@/lib/settings";
import CategoryBox from "@/components/CategoryBox";
import ArticleCard from "@/components/ArticleCard";

export default async function HrDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("locale")?.value || "en";

  if (!token) redirect("/enter/login");

  let payload: { userId: number; role: string } | null = null;
  let user: { name: string; email: string; role: string } | null = null;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number; role: string };
    if (payload.role !== "HR") redirect("/enter/dashboard");
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { name: true, email: true, role: true },
    });
    user = dbUser;
  } catch {
    redirect("/enter/login");
  }

  const userId = payload!.userId;

  // Fetch user's bookmarked articles (collections)
  const collections = await prisma.articleCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      article: {
        include: {
          translations: { where: { locale } },
        },
      },
    },
  });

  // Fetch all groups including INTERNAL
  const groups = await prisma.group.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: true,
    },
  });

  // Fetch recent articles (PUBLIC + INTERNAL)
  const allRecentArticles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      translations: { where: { locale } },
    },
  });

  const settings = await getAllSettings();

  return (
    <>
      {/* Hero Banner */}
      <div
        className="w-full text-white"
        style={{ backgroundColor: settings.hero_bg_color_start }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {locale === "id" ? "Selamat Datang" : "Welcome"}, {user?.name}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {locale === "id" ? "Manajemen Sumber Daya Manusia" : "Human Resources Management"}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/15 rounded-lg px-4 py-2 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-sm font-medium">HR</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Groups Section */}
        {groups.length > 0 && (
          <section className="mb-8">
            <div
              className="rounded-t-lg px-5 py-3 text-white font-semibold"
              style={{ backgroundColor: settings.hero_bg_color_start }}
            >
              {locale === "id" ? "Kategori Informasi" : "Browse by Category"}
            </div>
            <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {groups.map(group => (
                  <CategoryBox key={group.id} group={group} locale={locale} hoverColor={settings.hover_category_color} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* My Collection */}
        <section className="mb-8">
          <div
            className="rounded-t-lg px-5 py-3 text-white font-semibold flex items-center gap-2"
            style={{ backgroundColor: settings.hero_bg_color_start }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {locale === "id" ? "Koleksiku" : "My Collection"}
          </div>
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg overflow-hidden">
            {collections.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <p className="text-sm text-gray-500">
                  {locale === "id"
                    ? "Belum ada artikel tersimpan. Buka artikel dan klik Save untuk menyimpannya."
                    : "No saved articles yet. Open an article and click Save to bookmark it."
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {collections.map(item => {
                  const articleTitle = item.article.translations[0]?.title || "";
                  return (
                    <Link
                      key={item.id}
                      href={`/articles/${item.articleId}`}
                      className="flex items-center justify-between px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900 truncate">{articleTitle}</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Recent Articles */}
        <section className="mb-8">
          <div
            className="rounded-t-lg px-5 py-3 text-white font-semibold flex items-center justify-between"
            style={{ backgroundColor: settings.hero_bg_color_start }}
          >
            <span>{locale === "id" ? "Artikel Terbaru" : "Recent Articles"}</span>
            <Link href="/enter/articles" className="text-sm text-white/80 hover:text-white transition-colors">
              &rarr; {locale === "id" ? "Lihat Semua" : "View All"}
            </Link>
          </div>
          <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-4 space-y-2">
            {allRecentArticles.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">{locale === "id" ? "Belum ada artikel" : "No articles yet"}</p>
            ) : (
              allRecentArticles.map(article => {
                const articleTitle = article.translations[0]?.title || "";
                return (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={articleTitle}
                    hoverColor={settings.hover_category_color}
                  />
                );
              })
            )}
          </div>
        </section>
      </div>
    </>
  );
}
