import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import jwt from "jsonwebtoken";
import QuestionGroupFilter from "@/components/QuestionGroupFilter";

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ questionGroupId?: string }>;
}) {
  const { questionGroupId } = await searchParams;
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

  const isAdmin = userRole === "ADMIN" || userRole === "HR";

  // Get all groups for the filter dropdown (always needed)
  const allGroups = await prisma.questionGroup.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });

  // Fetch group + questions only if a group is selected
  let group: { id: number; translations: { name: string }[] } | null = null;
  let questions: {
    id: number;
    content: string;
    imageUrl: string | null;
    correctOptionIndex: number;
    order: number;
    options: { id: number; index: number; content: string }[];
  }[] = [];

  if (questionGroupId) {
    const groupId = Number(questionGroupId);
    group = await prisma.questionGroup.findUnique({
      where: { id: groupId },
      include: { translations: { where: { locale } } },
    });

    if (group) {
      questions = await prisma.question.findMany({
        where: { questionGroupId: groupId },
        orderBy: { order: "asc" },
        include: {
          options: { orderBy: { index: "asc" } },
        },
      });
    }
  }

  const settings = await getAllSettings();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Questions",
        create: "Create Question",
        noQuestions: "No questions in this group yet",
        question: "Question",
        options: "Options",
        correctAnswer: "Correct Answer",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
        selectGroup: "Select Group",
        backToGroups: "Back to Groups",
      },
      id: {
        title: "Daftar Soal",
        create: "Buat Soal",
        noQuestions: "Belum ada soal di kelompok ini",
        question: "Soal",
        options: "Pilihan",
        correctAnswer: "Kunci Jawaban",
        actions: "Aksi",
        edit: "Edit",
        delete: "Hapus",
        selectGroup: "Pilih Kelompok",
        backToGroups: "Kembali ke Kelompok",
      },
    };
    return translations[locale]?.[key] || translations["en"]?.[key] || key;
  };

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Group filter bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/enter/question-groups"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t("backToGroups")}
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">{t("selectGroup")}:</span>
          <QuestionGroupFilter
            groups={allGroups.map((g) => ({
              id: g.id,
              name: g.translations[0]?.name || "Untitled",
            }))}
            currentGroupId={group?.id}
            placeholder={locale === "id" ? "Pilih Kelompok Soal" : "Select a Question Group"}
          />
        </div>
        {isAdmin && group && (
          <Link
            href={`/enter/questions/new?questionGroupId=${group.id}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t("create")}
          </Link>
        )}
      </div>

      {!group ? (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="px-6 py-16 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {locale === "id" ? "Pilih Kelompok Soal" : "Select a Question Group"}
            </h3>
            <p className="text-sm text-gray-400">
              {locale === "id"
                ? "Gunakan dropdown di atas untuk memilih kelompok soal dan melihat daftar soalnya."
                : "Use the dropdown above to select a question group and view its questions."}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <div
            className="px-5 py-3 text-white font-semibold"
            style={{ backgroundColor: settings.hero_bg_color_start }}
          >
            {group.translations[0]?.name || "Untitled"} — {t("title")}
          </div>
          <div className="bg-white divide-y divide-gray-100">
            {questions.length === 0 ? (
              <p className="px-6 py-12 text-center text-gray-500">{t("noQuestions")}</p>
            ) : (
              questions.map((question, idx) => (
                <div key={question.id} className="px-6 py-5 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-gray-400">#{question.id}</span>
                      </div>
                      <div
                        className="text-sm text-gray-900 mb-3 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: question.content }}
                      />
                      {question.imageUrl && (
                        <img
                          src={question.imageUrl}
                          alt="Question image"
                          className="max-h-40 rounded-lg border border-gray-200 mb-3"
                        />
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {question.options.map((opt) => (
                          <div
                            key={opt.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                              opt.index === question.correctOptionIndex
                                ? "bg-green-50 border border-green-200 text-green-800"
                                : "bg-gray-50 border border-gray-100 text-gray-700"
                            }`}
                          >
                            <span className="font-bold text-xs w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-200">
                              {optionLabels[opt.index]}
                            </span>
                            <span className="truncate">{opt.content}</span>
                            {opt.index === question.correctOptionIndex && (
                              <svg className="w-4 h-4 text-green-600 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    {isAdmin && (
                      <Link
                        href={`/enter/questions/${question.id}/edit`}
                        className="flex-shrink-0 text-sm text-indigo-600 hover:text-indigo-700"
                      >
                        {t("edit")}
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
