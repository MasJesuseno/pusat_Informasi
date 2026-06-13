import { cookies } from "next/headers";
import Link from "next/link";
import { getAllSettings } from "@/lib/settings";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">
        {num}
      </span>
      <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
      💡 {children}
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
      ⚠️ {children}
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function NavCard({ href, label, desc }: { href: string; label: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all group"
    >
      <div className="font-medium text-indigo-600 group-hover:text-indigo-700">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </Link>
  );
}

export default async function GuidePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const settings = await getAllSettings();

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      en: {
        title: "User Guide",
        subtitle: "Complete guide for using the Knowledge Management Center",
        public: "For Public Users",
        publicDesc: "Browse and search articles without logging in",
        internal: "For Internal Users",
        internalDesc: "Logged-in users with access to internal content and exams",
        hr: "For HR Users",
        hrDesc: "Content managers who create and organize articles and exams",
        admin: "For Administrators",
        adminDesc: "Full system administrators with all access rights",
        quickLinks: "Quick Links",
        overview: "Overview",
        features: "Key Features",
        steps: "Step-by-Step Guide",
        tips: "Tips & Notes",
      },
      id: {
        title: "Panduan Pengguna",
        subtitle: "Panduan lengkap penggunaan Pusat Informasi",
        public: "Untuk Pengguna Publik",
        publicDesc: "Melihat dan mencari artikel tanpa login",
        internal: "Untuk Pengguna Internal",
        internalDesc: "Pengguna yang sudah login dengan akses ke konten internal dan ujian",
        hr: "Untuk Pengguna HR",
        hrDesc: "Pengelola konten yang membuat dan mengatur artikel serta ujian",
        admin: "Untuk Administrator",
        adminDesc: "Administrator sistem dengan semua hak akses",
        quickLinks: "Link Cepat",
        overview: "Gambaran Umum",
        features: "Fitur Utama",
        steps: "Panduan Langkah demi Langkah",
        tips: "Tips & Catatan",
      },
    };
    return dict[locale]?.[key] || dict["en"]?.[key] || key;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="text-white" style={{ background: `linear-gradient(to bottom right, ${settings.hero_bg_color_start}, ${settings.hero_bg_color_end || settings.hero_bg_color_start})` }}>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t("title")}</h1>
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          <NavCard href="#public" label={t("public")} desc={t("publicDesc")} />
          <NavCard href="#internal" label={t("internal")} desc={t("internalDesc")} />
          <NavCard href="#hr" label={t("hr")} desc={t("hrDesc")} />
          <NavCard href="#admin" label={t("admin")} desc={t("adminDesc")} />
        </div>

        {/* ==================== PUBLIC ==================== */}
        <section id="public" className="mb-12 scroll-mt-20">
          <SectionCard title={locale === "id" ? "👤 Panduan Pengguna Publik" : "👤 Public User Guide"}>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                {locale === "id"
                  ? "Pengguna publik dapat mengakses halaman utama, mencari artikel, dan membaca konten publik tanpa perlu login."
                  : "Public users can access the homepage, search articles, and read public content without logging in."}
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("features")}</h3>
            <FeatureList items={
              locale === "id" ? [
                "Melihat hero section dengan informasi utama",
                "Menelusuri kategori artikel (Groups & Sub Groups)",
                "Mencari artikel menggunakan kata kunci",
                "Membaca artikel publik secara lengkap",
                "Memberikan feedback (membantu / tidak membantu) pada artikel",
                "Filter artikel berdasarkan grup dan sub grup di halaman pencarian",
              ] : [
                "View hero section with main information",
                "Browse article categories (Groups & Sub Groups)",
                "Search articles using keywords",
                "Read public articles in full",
                "Give feedback (helpful / not helpful) on articles",
                "Filter articles by group and subgroup on the search page",
              ]
            } />

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("steps")}</h3>
            <div className="space-y-3">
              <Step num={1}>
                {locale === "id"
                  ? "Buka halaman utama. Hero section menampilkan judul dan deskripsi utama."
                  : "Open the homepage. The hero section displays the main title and description."}
              </Step>
              <Step num={2}>
                {locale === "id"
                  ? "Gunakan bilah pencarian untuk mencari artikel berdasarkan kata kunci."
                  : "Use the search bar to find articles by keywords."}
              </Step>
              <Step num={3}>
                {locale === "id"
                  ? "Klik kategori untuk melihat artikel dalam grup tertentu."
                  : "Click a category to view articles in a specific group."}
              </Step>
              <Step num={4}>
                {locale === "id"
                  ? "Klik judul artikel untuk membaca konten lengkap. Beri feedback di bagian bawah artikel."
                  : "Click an article title to read the full content. Give feedback at the bottom of the article."}
              </Step>
            </div>

            <Tip>
              {locale === "id"
                ? "Semua fitur publik bisa diakses tanpa login. Beberapa artikel internal mungkin tidak terlihat."
                : "All public features are accessible without logging in. Some internal articles may not be visible."}
            </Tip>
          </SectionCard>
        </section>

        {/* ==================== INTERNAL ==================== */}
        <section id="internal" className="mb-12 scroll-mt-20">
          <SectionCard title={locale === "id" ? "🔐 Panduan Pengguna Internal" : "🔐 Internal User Guide"}>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                {locale === "id"
                  ? "Pengguna Internal adalah staf yang sudah memiliki akun login. Selain akses publik, pengguna internal bisa melihat konten internal, menyimpan artikel, dan mengerjakan ujian."
                  : "Internal users are staff with login accounts. In addition to public access, internal users can view internal content, bookmark articles, and take exams."}
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("features")}</h3>
            <FeatureList items={
              locale === "id" ? [
                "Login dengan email dan password",
                "Melihat artikel PUBLIC + INTERNAL",
                "Menyimpan/bookmark artikel favorit",
                "Mengerjakan ujian yang ditugaskan",
                "Melihat hasil dan riwayat ujian",
                "Dashboard personal dengan ringkasan aktivitas",
              ] : [
                "Login with email and password",
                "View PUBLIC + INTERNAL articles",
                "Bookmark favorite articles",
                "Take assigned exams",
                "View exam results and history",
                "Personal dashboard with activity summary",
              ]
            } />

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("steps")}</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {locale === "id" ? "Login & Dashboard" : "Login & Dashboard"}
              </p>
              <Step num={1}>
                {locale === "id"
                  ? "Buka halaman /enter/login. Masukkan email dan password yang didaftarkan oleh Admin."
                  : "Go to /enter/login. Enter your registered email and password provided by Admin."}
              </Step>
              <Step num={2}>
                {locale === "id"
                  ? "Setelah login, Anda akan diarahkan ke Dashboard yang menampilkan ringkasan artikel terbaru, bookmark, dan statistik."
                  : "After login, you'll be redirected to the Dashboard showing recent articles, bookmarks, and statistics."}
              </Step>
              <Step num={3}>
                {locale === "id"
                  ? "Navigasi menu: Home, Search, Content (Articles), My Exams."
                  : "Navigation menu: Home, Search, Content (Articles), My Exams."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Bookmark Artikel" : "Bookmark Articles"}
              </p>
              <Step num={4}>
                {locale === "id"
                  ? "Buka artikel yang ingin disimpan, klik ikon bookmark (simpan) di bagian atas/akhir artikel."
                  : "Open the article you want to save, click the bookmark icon at the top/bottom of the article."}
              </Step>
              <Step num={5}>
                {locale === "id"
                  ? "Artikel yang di-bookmark akan muncul di dashboard Anda."
                  : "Bookmarked articles will appear on your dashboard."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Mengerjakan Ujian" : "Taking Exams"}
              </p>
              <Step num={6}>
                {locale === "id"
                  ? "Buka menu My Exams untuk melihat daftar ujian yang ditugaskan kepada Anda."
                  : "Open the My Exams menu to see exams assigned to you."}
              </Step>
              <Step num={7}>
                {locale === "id"
                  ? "Klik ujian yang berstatus PENDING untuk mulai mengerjakan. Jawab soal pilihan ganda yang tersedia."
                  : "Click an exam with PENDING status to start. Answer the multiple-choice questions."}
              </Step>
              <Step num={8}>
                {locale === "id"
                  ? "Navigasi antar soal menggunakan tombol Previous/Next atau klik dot navigasi. Setelah selesai, klik Submit."
                  : "Navigate between questions using Previous/Next buttons or click navigation dots. When done, click Submit."}
              </Step>
              <Step num={9}>
                {locale === "id"
                  ? "Hasil ujian akan langsung muncul dengan skor dan breakdown jawaban benar/salah."
                  : "Exam results will appear immediately with score and correct/incorrect breakdown."}
              </Step>
            </div>

            <Tip>
              {locale === "id"
                ? "Pastikan koneksi internet stabil saat mengerjakan ujian. Jawaban tidak bisa diubah setelah di-submit."
                : "Make sure your internet connection is stable while taking exams. Answers cannot be changed after submission."}
            </Tip>
          </SectionCard>
        </section>

        {/* ==================== HR ==================== */}
        <section id="hr" className="mb-12 scroll-mt-20">
          <SectionCard title={locale === "id" ? "📋 Panduan Pengguna HR" : "📋 HR User Guide"}>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                {locale === "id"
                  ? "HR adalah pengelola konten yang bertanggung jawab membuat dan mengatur artikel, grup, soal, ujian, dan penugasan."
                  : "HR is a content manager responsible for creating and managing articles, groups, questions, exams, and assignments."}
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("features")}</h3>
            <FeatureList items={
              locale === "id" ? [
                "CRUD Grup & Sub Grup (nama bilingual, urutan, status)",
                "CRUD Artikel (editor rich text, bilingual, upload gambar)",
                "CRUD Kelompok Soal & Soal (4 opsi pilihan ganda)",
                "CRUD Ujian (pilih soal dari berbagai kelompok)",
                "Penugasan Ujian ke pengguna Internal",
                "Lihat hasil ujian per pengguna (detail per-soal)",
                "Dashboard khusus HR dengan ringkasan",
              ] : [
                "CRUD Groups & Sub Groups (bilingual names, order, status)",
                "CRUD Articles (rich text editor, bilingual, image upload)",
                "CRUD Question Groups & Questions (4 multiple choice options)",
                "CRUD Exams (select questions from various groups)",
                "Assign exams to Internal users",
                "View exam results per user (per-question detail)",
                "Dedicated HR dashboard with summary",
              ]
            } />

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("steps")}</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {locale === "id" ? "Mengelola Grup & Sub Grup" : "Managing Groups & Sub Groups"}
              </p>
              <Step num={1}>
                {locale === "id"
                  ? "Buka menu Content → Groups. Klik 'Create Group' untuk membuat grup baru."
                  : "Open menu Content → Groups. Click 'Create Group' to create a new group."}
              </Step>
              <Step num={2}>
                {locale === "id"
                  ? "Isi nama grup dalam Bahasa Inggris dan Indonesia, atur urutan tampilan, dan pilih status (PUBLIC/INTERNAL)."
                  : "Fill in the group name in English and Indonesian, set display order, and choose status (PUBLIC/INTERNAL)."}
              </Step>
              <Step num={3}>
                {locale === "id"
                  ? "Untuk sub grup, buka Content → Sub Groups. Pilih parent grup dan isi nama bilingual."
                  : "For sub groups, open Content → Sub Groups. Select parent group and fill in bilingual names."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Membuat Artikel" : "Creating Articles"}
              </p>
              <Step num={4}>
                {locale === "id"
                  ? "Buka Content → Articles → Create Article. Pilih grup, sub grup (opsional), dan status."
                  : "Open Content → Articles → Create Article. Select group, subgroup (optional), and status."}
              </Step>
              <Step num={5}>
                {locale === "id"
                  ? "Tulis judul dan konten dalam Bahasa Inggris dan Indonesia menggunakan Rich Text Editor (Tiptap)."
                  : "Write title and content in English and Indonesian using the Rich Text Editor (Tiptap)."}
              </Step>
              <Step num={6}>
                {locale === "id"
                  ? "Gunakan toolbar editor untuk format teks (bold, italic, heading, list, link). Untuk gambar, upload via tombol image."
                  : "Use the editor toolbar for text formatting (bold, italic, heading, list, link). For images, upload via the image button."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Mengelola Bank Soal" : "Managing Question Bank"}
              </p>
              <Step num={7}>
                {locale === "id"
                  ? "Buka Question Bank → Q. Groups untuk membuat kelompok soal. Atur nama bilingual dan status."
                  : "Open Question Bank → Q. Groups to create question groups. Set bilingual names and status."}
              </Step>
              <Step num={8}>
                {locale === "id"
                  ? "Buka Questions untuk menambah soal. Pilih kelompok soal, tulis konten soal (bisa dengan gambar), dan tentukan 4 opsi jawaban dengan satu jawaban benar."
                  : "Open Questions to add questions. Select question group, write question content (can include images), and specify 4 answer options with one correct answer."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Membuat Ujian & Penugasan" : "Creating Exams & Assignments"}
              </p>
              <Step num={9}>
                {locale === "id"
                  ? "Buka Question Bank → Exams → Create Exam. Beri nama ujian dan pilih soal-soal yang akan dimasukkan."
                  : "Open Question Bank → Exams → Create Exam. Name the exam and select questions to include."}
              </Step>
              <Step num={10}>
                {locale === "id"
                  ? "Buka Question Bank → Exam Assignments → Create Assignment. Pilih ujian yang sudah dibuat dan pilih user Internal yang akan ditugaskan."
                  : "Open Question Bank → Exam Assignments → Create Assignment. Select the exam and choose Internal users to assign."}
              </Step>
            </div>

            <Tip>
              {locale === "id"
                ? "Gunakan status DRAFT untuk artikel/soal yang masih dalam proses. Hanya ADMIN dan HR yang bisa melihat konten DRAFT."
                : "Use DRAFT status for articles/questions still in progress. Only ADMIN and HR can view DRAFT content."}
            </Tip>
          </SectionCard>
        </section>

        {/* ==================== ADMIN ==================== */}
        <section id="admin" className="mb-12 scroll-mt-20">
          <SectionCard title={locale === "id" ? "⚙️ Panduan Administrator" : "⚙️ Administrator Guide"}>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600">
                {locale === "id"
                  ? "Administrator memiliki semua akses yang dimiliki HR, ditambah kemampuan mengelola pengguna dan pengaturan sistem."
                  : "Administrators have all HR access plus user management and system settings capabilities."}
              </p>
            </div>

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("features")}</h3>
            <FeatureList items={
              locale === "id" ? [
                "Semua fitur yang dimiliki HR",
                "CRUD pengguna (Admin, HR, Internal)",
                "Atur role dan hak akses pengguna",
                "Konfigurasi pengaturan situs (logo, warna, hero)",
                "Upload logo dan gambar background",
              ] : [
                "All HR features",
                "CRUD users (Admin, HR, Internal)",
                "Manage user roles and access rights",
                "Configure site settings (logo, colors, hero)",
                "Upload logo and background images",
              ]
            } />

            <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">{t("steps")}</h3>
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {locale === "id" ? "Mengelola Pengguna" : "Managing Users"}
              </p>
              <Step num={1}>
                {locale === "id"
                  ? "Buka Admin → Users. Lihat daftar semua pengguna yang terdaftar."
                  : "Open Admin → Users. View the list of all registered users."}
              </Step>
              <Step num={2}>
                {locale === "id"
                  ? "Klik 'Create User' untuk menambah pengguna baru. Isi nama, email, password, dan pilih role."
                  : "Click 'Create User' to add a new user. Fill in name, email, password, and select role."}
              </Step>
              <Step num={3}>
                {locale === "id"
                  ? "Klik ikon edit untuk mengubah data pengguna yang sudah ada, atau klik ikon hapus untuk menghapus."
                  : "Click the edit icon to modify existing user data, or click the delete icon to remove."}
              </Step>

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-2">
                {locale === "id" ? "Pengaturan Situs" : "Site Settings"}
              </p>
              <Step num={4}>
                {locale === "id"
                  ? "Buka Admin → Settings. Halaman ini berisi semua konfigurasi tampilan situs."
                  : "Open Admin → Settings. This page contains all site appearance configurations."}
              </Step>
              <Step num={5}>
                {locale === "id"
                  ? "Upload logo situs dan gambar background hero. Ukuran maksimal 5MB."
                  : "Upload site logo and hero background image. Maximum size 5MB."}
              </Step>
              <Step num={6}>
                {locale === "id"
                  ? "Atur warna gradient hero (start & end), warna hover kategori, dan judul/subtitle bilingual."
                  : "Set hero gradient colors (start & end), category hover color, and bilingual titles/subtitles."}
              </Step>
              <Step num={7}>
                {locale === "id"
                  ? "Perubahan akan langsung terlihat setelah disimpan."
                  : "Changes will be visible immediately after saving."}
              </Step>
            </div>

            <Warning>
              {locale === "id"
                ? "Hanya ADMIN yang bisa mengakses halaman Settings dan Users. Berhati-hatilah saat menghapus pengguna karena data terkait juga akan terhapus."
                : "Only ADMIN can access Settings and Users pages. Be careful when deleting users as related data will also be deleted."}
            </Warning>
          </SectionCard>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <SectionCard title={locale === "id" ? "🔗 Link Cepat" : "🔗 Quick Links"}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <NavCard href="/" label={locale === "id" ? "Beranda" : "Home"} desc={locale === "id" ? "Halaman utama publik" : "Public homepage"} />
              <NavCard href="/search" label={locale === "id" ? "Cari" : "Search"} desc={locale === "id" ? "Cari artikel" : "Search articles"} />
              <NavCard href="/enter/login" label={locale === "id" ? "Login" : "Login"} desc={locale === "id" ? "Masuk ke akun" : "Sign in to your account"} />
              <NavCard href="/enter/dashboard" label={locale === "id" ? "Dasbor" : "Dashboard"} desc={locale === "id" ? "Dashboard pengguna" : "User dashboard"} />
              <NavCard href="/enter/settings" label={locale === "id" ? "Pengaturan" : "Settings"} desc={locale === "id" ? "Pengaturan situs (ADMIN)" : "Site settings (ADMIN)"} />
              <NavCard href="/enter/users" label={locale === "id" ? "Pengguna" : "Users"} desc={locale === "id" ? "Manajemen pengguna (ADMIN)" : "User management (ADMIN)"} />
            </div>
          </SectionCard>
        </section>
      </div>
    </div>
  );
}
