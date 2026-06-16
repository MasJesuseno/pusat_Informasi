import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getAllSettings } from "@/lib/settings";

export default async function MyCollectionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("locale")?.value || "en";

  if (!token) redirect("/enter/login");

  let payload: { userId: number } | null = null;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number };
  } catch {
    redirect("/enter/login");
  }

  const userId = payload!.userId;

  // Fetch all user's bookmarked articles (collections)
  const collections = await prisma.articleCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      article: {
        include: {
          translations: { where: { locale } },
          group: { include: { translations: { where: { locale } } } },
        },
      },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "My Collection",
        subtitle: "Your bookmarked articles",
        empty: "No saved articles yet. Open an article and click Save to bookmark it.",
        emptyHint: "Browse articles to find something interesting",
        browse: "Browse Articles",
        group: "Group",
        saved: "Saved",
      },
      id: {
        title: "Koleksiku",
        subtitle: "Artikel yang kamu simpan",
        empty: "Belum ada artikel tersimpan. Buka artikel dan klik Save untuk menyimpannya.",
        emptyHint: "Jelajahi artikel untuk menemukan yang menarik",
        browse: "Jelajahi Artikel",
        group: "Grup",
        saved: "Disimpan",
      },
    };
    return dict[locale]?.[key] || dict.en?.[key] || key;
  };

  return (
    <>
      {/* Header Banner */}
      <div
        className="w-full text-white"
        style={{ backgroundColor: settings.hero_bg_color_start }}
      >
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <div>
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-white/80 text-sm mt-0.5">{t("subtitle")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {collections.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-gray-500 mb-2">{t("empty")}</p>
            <p className="text-sm text-gray-400 mb-6">{t("emptyHint")}</p>
            <Link
              href="/search"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:opacity-90"
              style={{ backgroundColor: settings.hero_bg_color_start }}
            >
              {t("browse")}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {collections.map((item) => {
                const articleTitle = item.article.translations[0]?.title || "";
                const groupName = item.article.group?.translations[0]?.name || "";
                return (
                  <Link
                    key={item.id}
                    href={`/articles/${item.articleId}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: settings.hero_bg_color_start + "15" }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: settings.hero_bg_color_start }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {articleTitle}
                        </p>
                        {groupName && (
                          <p className="text-xs text-gray-400 mt-0.5">{groupName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {collections.length > 0 && (
          <p className="text-xs text-gray-400 text-center mt-4">
            {collections.length} {locale === "id" ? "artikel tersimpan" : "saved articles"}
          </p>
        )}
      </div>
    </>
  );
}
