import { prisma } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSettings } from "@/lib/settings";
import jwt from "jsonwebtoken";

export default async function MyExamsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const locale = cookieStore.get("locale")?.value || "en";

  if (!token) redirect("/enter/login");

  let userId = 0;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "kmc-secret-key") as { userId: number };
    userId = payload.userId;
  } catch {
    redirect("/enter/login");
  }

  const assignments = await prisma.examAssignment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      exam: { select: { id: true, name: true } },
    },
  });

  const settings = await getAllSettings();

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "My Exams",
        exam: "Exam",
        status: "Status",
        score: "Score",
        assigned: "Assigned",
        actions: "Actions",
        noData: "No exams assigned to you yet",
        take: "Take Exam",
        viewResult: "View Result",
        pending: "Pending",
        in_progress: "In Progress",
        completed: "Completed",
      },
      id: {
        title: "Ujian Saya",
        exam: "Ujian",
        status: "Status",
        score: "Nilai",
        assigned: "Ditugaskan",
        actions: "Aksi",
        noData: "Belum ada ujian yang ditugaskan",
        take: "Kerjakan",
        viewResult: "Lihat Hasil",
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div
          className="px-5 py-3 text-white font-semibold"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          {t("title")}
        </div>
        <div className="bg-white">
          {assignments.length === 0 ? (
            <p className="px-6 py-12 text-center text-gray-500">{t("noData")}</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {assignments.map((a) => (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{a.exam.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[a.status] || ""}`}>
                        {t(a.status.toLowerCase())}
                      </span>
                      {a.status === "COMPLETED" && (
                        <span className={`text-sm font-semibold ${a.score! >= 70 ? "text-green-600" : "text-red-600"}`}>
                          {a.score}/100
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(a.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {a.status === "COMPLETED" ? (
                      <Link
                        href={`/enter/my-exams/${a.id}/result`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        {t("viewResult")}
                      </Link>
                    ) : (
                      <Link
                        href={`/enter/my-exams/${a.id}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        {t("take")}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
