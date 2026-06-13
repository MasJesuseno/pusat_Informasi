import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import jwt from "jsonwebtoken";

export default async function ExamAssignmentsPage() {
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

  const assignments = await prisma.examAssignment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      exam: { select: { id: true, name: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "Exam Assignments",
        create: "New Assignment",
        exam: "Exam",
        user: "User",
        status: "Status",
        score: "Score",
        date: "Date",
        actions: "Actions",
        noData: "No assignments yet",
        view: "View",
        delete: "Delete",
        pending: "Pending",
        in_progress: "In Progress",
        completed: "Completed",
      },
      id: {
        title: "Penugasan Ujian",
        create: "Buat Penugasan",
        exam: "Ujian",
        user: "Peserta",
        status: "Status",
        score: "Nilai",
        date: "Tanggal",
        actions: "Aksi",
        noData: "Belum ada penugasan",
        view: "Lihat",
        delete: "Hapus",
        pending: "Menunggu",
        in_progress: "Sedang Dikerjakan",
        completed: "Selesai",
      },
    };
    return dict[locale]?.[key] || dict.en?.[key] || key;
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold flex items-center justify-between"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <span>{t("title")}</span>
          {isAdmin && (
            <Link
              href="/enter/exam-assignments/new"
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
          {assignments.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500">{t("noData")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("exam")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("user")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("status")}</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">{t("score")}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t("date")}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {assignments.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.exam.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{a.user.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[a.status] || ""}`}>
                          {t(a.status.toLowerCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-semibold">
                        {a.status === "COMPLETED" ? (
                          <span className={a.score! >= 70 ? "text-green-600" : "text-red-600"}>
                            {a.score}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(a.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/enter/exam-assignments/${a.id}`}
                          className="text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          {t("view")}
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
