import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import ArticleFeedback from "@/components/ArticleFeedback";
import BookmarkButton from "@/components/BookmarkButton";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const token = cookieStore.get("token")?.value;
  const { id } = await params;

  let userRole = "PUBLIC";
  if (token) {
    try {
      
      const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { role: string };
      userRole = payload.role;
    } catch {}
  }

  const article = await prisma.article.findUnique({
    where: { id: parseInt(id) },
    include: {
      translations: true,
      group: { include: { translations: true } },
      subgroup: { include: { translations: true } },
      author: { select: { name: true } },
    },
  });

  if (!article) notFound();

  // Access control
  if (article.status === "DRAFT" && userRole !== "ADMIN") notFound();
  if (article.status === "INTERNAL" && userRole === "PUBLIC") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9.364-7.364A9 9 0 1112 3a9 9 0 017.364 4.636z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {locale === "id" ? "Login Diperlukan" : "Login Required"}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === "id" 
              ? "Artikel ini hanya dapat diakses oleh pengguna internal. Silakan login terlebih dahulu."
              : "This article is only accessible by internal users. Please login first."
            }
          </p>
          <Link
            href="/enter/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {locale === "id" ? "Masuk" : "Login"}
          </Link>
        </div>
      </div>
    );
  }

  const title = article.translations.find(t => t.locale === locale)?.title || article.translations[0]?.title || "";
  const content = article.translations.find(t => t.locale === locale)?.content || article.translations[0]?.content || "";
  const groupName = article.group.translations.find(t => t.locale === locale)?.name || article.group.translations[0]?.name || "";
  const subgroupName = article.subgroup?.translations.find(t => t.locale === locale)?.name || null;

  // Feedback counts
  const feedbackCounts = await prisma.articleFeedback.groupBy({
    by: ["helpful"],
    where: { articleId: article.id },
    _count: true,
  });

  const helpfulCount = feedbackCounts.find((f) => f.helpful)?._count || 0;
  const notHelpfulCount = feedbackCounts.find((f) => !f.helpful)?._count || 0;

  // Get client IP for user's existing vote
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  const userFeedback = await prisma.articleFeedback.findUnique({
    where: { articleId_ip: { articleId: article.id, ip } },
  });

  // Check if article is bookmarked by current user
  let isBookmarked = false;
  if (token && userRole !== "PUBLIC") {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number };
      const bookmark = await prisma.articleCollection.findUnique({
        where: { userId_articleId: { userId: payload.userId, articleId: article.id } },
      });
      isBookmarked = !!bookmark;
    } catch {}
  }

  const updatedDate = new Date(article.updatedAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const settings = await getAllSettings();

  const homeHref = userRole !== "PUBLIC" ? "/enter/dashboard" : "/";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="overflow-hidden rounded-lg border border-gray-200">
        {/* Colored Header Strip */}
        <div
          className="px-6 py-4 text-white space-y-2"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          {/* Back to Home */}
          <Link href={homeHref} className="inline-flex items-center text-sm text-white/70 hover:text-white transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {locale === "id" ? "Kembali ke Beranda" : "Back to Home"}
          </Link>

          <div className="flex items-center flex-wrap gap-2">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm">
              <Link href={`/search?groupId=${article.groupId}`} className="text-white/80 hover:text-white font-medium transition-colors">
                {groupName}
              </Link>
              {subgroupName && article.subgroupId && (
                <>
                  <span className="text-white/50">/</span>
                  <Link href={`/search?groupId=${article.groupId}&subgroupId=${article.subgroupId}`} className="text-white/80 hover:text-white transition-colors">
                    {subgroupName}
                  </Link>
                </>
              )}
            </div>

            {/* Status Badge */}
            {article.status !== "PUBLIC" && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                article.status === "INTERNAL" ? "bg-yellow-400/20 text-yellow-200" : "bg-gray-400/20 text-gray-200"
              }`}>
                {article.status === "INTERNAL" 
                  ? (locale === "id" ? "Internal" : "Internal")
                  : (locale === "id" ? "Draf" : "Draft")
                }
              </span>
            )}
          </div>
        </div>

        {/* White Card Body */}
        <div className="bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {userRole !== "PUBLIC" && (
              <BookmarkButton articleId={article.id} initialBookmarked={isBookmarked} />
            )}
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-8">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{locale === "id" ? "Oleh" : "By"} {article.author.name}</span>
            <span className="mx-2">·</span>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{locale === "id" ? "Terakhir diperbarui" : "Last updated"}: {updatedDate}</span>
          </div>

          <div
            className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-indigo-600 prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{
              __html: content.includes("<") && content.includes(">")
                ? content
                : content.split("\n").filter(Boolean).map(p => `<p class="mb-4 text-gray-700 leading-relaxed">${p}</p>`).join(""),
            }}
          />

          <ArticleFeedback
            articleId={article.id}
            initialHelpful={helpfulCount}
            initialNotHelpful={notHelpfulCount}
            initialUserVote={userFeedback?.helpful ?? null}
            locale={locale}
          />
        </div>
      </article>
    </div>
  );
}
