import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import jwt from "jsonwebtoken";

export default async function QuestionGroupsPage() {
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

  const groups = await prisma.questionGroup.findMany({
    orderBy: { order: "asc" },
    include: {
      translations: { where: { locale } },
      _count: { select: { questions: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "Question Groups",
        create: "Create Group",
        name: "Name",
        questions: "Questions",
        status: "Status",
        actions: "Actions",
        noGroups: "No question groups yet",
        edit: "Edit",
        delete: "Delete",
        viewQuestions: "View Questions",
      },
      id: {
        title: "Kelompok Soal",
        create: "Buat Kelompok",
        name: "Nama",
        questions: "Soal",
        status: "Status",
        actions: "Aksi",
        noGroups: "Belum ada kelompok soal",
        edit: "Edit",
        delete: "Hapus",
        viewQuestions: "Lihat Soal",
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <span>{t("title")}</span>
          {isAdmin && (
            <Link
              href="/enter/question-groups/new"
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
          {groups.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500">{t("noGroups")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("name")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t("questions")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groups.map((group) => (
                    <tr key={group.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/enter/questions?questionGroupId=${group.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {group.translations[0]?.name || "Untitled"}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[group.status] || "bg-gray-100"}`}>
                          {group.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{group._count.questions}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-3">
                          <Link
                            href={`/enter/questions?questionGroupId=${group.id}`}
                            className="text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            {t("viewQuestions")}
                          </Link>
                          {isAdmin && (
                            <Link
                              href={`/enter/question-groups/${group.id}/edit`}
                              className="text-sm text-gray-600 hover:text-gray-900"
                            >
                              {t("edit")}
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
