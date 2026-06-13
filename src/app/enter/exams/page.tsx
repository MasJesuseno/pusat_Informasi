import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import jwt from "jsonwebtoken";

export default async function ExamsPage() {
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

  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "Exams",
        create: "Create Exam",
        name: "Name",
        questions: "Questions",
        createdAt: "Created",
        actions: "Actions",
        noExams: "No exams yet",
        edit: "Edit",
        delete: "Delete",
      },
      id: {
        title: "Ujian",
        create: "Buat Ujian",
        name: "Nama",
        questions: "Soal",
        createdAt: "Dibuat",
        actions: "Aksi",
        noExams: "Belum ada ujian",
        edit: "Edit",
        delete: "Hapus",
      },
    };
    return dict[locale]?.[key] || dict.en?.[key] || key;
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
              href="/enter/exams/new"
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
          {exams.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500">{t("noExams")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("name")}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t("questions")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("createdAt")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/enter/exams/${exam.id}/edit`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {exam.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{exam._count.questions}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(exam.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/enter/exams/${exam.id}/edit`}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          {t("edit")}
                        </Link>
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
