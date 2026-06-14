> **📖 UNTUK CODEBUFF:** Baca file ini terlebih dahulu saat memulai sesi baru.
> File ini berisi ringkasan lengkap proyek KMC agar Anda bisa langsung
> memahami konteks tanpa membaca ulang semua file.

## Struktur File Proyek

kmc-project/
├── prisma/
│   ├── schema.prisma          — Schema database (12 model + 2 join table)
│   ├── seed.ts                — Seed data
│   └── migrations/            — Migrasi database (9 migrations)
├── src/
│   ├── app/
│   │   ├── page.tsx           — Halaman utama (Home: hero + kategori + artikel terbaru)
│   │   ├── layout.tsx         — Root layout + Header + Footer
│   │   ├── not-found.tsx      — 404
│   │   ├── search/page.tsx    — Pencarian artikel (filter grup/subgroup)
│   │   ├── articles/[id]/page.tsx — Detail artikel (feedback + bookmark)
│   │   ├── enter/             — Admin panel (/enter/*)
│   │   │   ├── login/
│   │   │   ├── dashboard/     — Dashboard utama (koleksi, kategori, artikel)
│   │   │   ├── hr/dashboard/  — Dashboard khusus HR
│   │   │   ├── articles/      — CRUD artikel (list, new, edit per id)
│   │   │   ├── groups/        — CRUD grup (list, new, edit per id)
│   │   │   ├── subgroups/     — CRUD subgroup (list, new, edit per id)
│   │   │   ├── question-groups/ — CRUD kelompok soal (list, new, edit)
│   │   │   ├── questions/     — CRUD soal (list, new, edit)
│   │   │   ├── users/         — Manajemen user (list, modal create/edit, delete)
│   │   │   ├── settings/      — Site settings (hero, hover color, logo, upload)
│   │   │   ├── exams/         — CRUD ujian (list, new, edit + kelola soal)
│   │   │   ├── exam-assignments/ — Penugasan ujian (list, new, detail hasil)
│   │   │   └── my-exams/      — Ujian Saya (list, kerjakan, hasil)
│   │   └── api/               — REST API
│   │       ├── auth/          — login, me (logout)
│   │       ├── articles/      — CRUD artikel + bookmark + feedback
│   │       ├── groups/        — CRUD grup
│   │       ├── subgroups/     — CRUD subgroup
│   │       ├── question-groups/ — CRUD kelompok soal
│   │       ├── questions/     — CRUD soal
│   │       ├── users/         — GET list (ADMIN+HR), POST create (ADMIN)
│   │       ├── settings/      — GET/PUT settings + POST file upload
│   │       ├── upload/        — Upload file gambar (untuk article editor)
│   │       ├── exams/         — CRUD ujian + manage soal (question add/remove)
│   │       ├── exam-assignments/ — CRUD penugasan + submit jawaban (auto-score)
│   │       └── my-exams/      — Daftar ujian user + detail soal + hasil
│   ├── components/
│   │   ├── Header.tsx         — Navbar sticky, dropdown groups, EN/ID kanan, role-based nav
│   │   ├── ArticleCard.tsx    — Card artikel (hover warna dinamis)
│   │   ├── ArticleEditor.tsx  — Tiptap rich text editor (artikel)
│   │   ├── ArticleFeedback.tsx — Feedback helpful/not helpful
│   │   ├── BookmarkButton.tsx — Tombol bookmark artikel
│   │   ├── CategoryBox.tsx    — Card kategori (hover warna dinamis, badge internal)
│   │   ├── QuestionGroupFilter.tsx — Dropdown filter kelompok soal (support placeholder)
│   │   └── NavDropdown.tsx    — (inline di Header) Dropdown hover/click untuk nav
│   │   └── MobileSection.tsx  — (inline di Header) Accordion mobile untuk nav
│   ├── lib/
│   │   ├── db.ts              — Koneksi Prisma (via PrismaMariaDb adapter)
│   │   ├── auth.ts            — JWT + bcrypt helpers
│   │   └── settings.ts        — SiteSettings interface + getAllSettings + updateSetting
│   ├── i18n/                  — Internasionalisasi (en, id)
│   ├── middleware.ts           — Proteksi route (role-based, redirect HR)
│   └── generated/prisma/      — Prisma client (custom output path!)
├── .env                       — DATABASE_URL + JWT_SECRET
├── prisma.config.ts           — Konfigurasi Prisma 7 CLI
├── package.json
├── SUMMARY.md                 — File ini
└── AGENTS.md                  — Catatan untuk AI agent

> ⚠️ **Prisma client** digenerate ke `src/generated/prisma/` (bukan default `.prisma/client/`).
> Import: `import { prisma } from \"@/lib/db\"`

---

# KMC (Knowledge Management Center) — Ringkasan Proyek

> Dibuat: 11 Juni 2026 | Diperbarui: 14 Juni 2026
> Lokasi: D:\kmc-project
> Deployment: http://192.168.1.52 (Production server — Ubuntu 26.04 LTS)
> Cloudflare Tunnel: Terhubung
> Header Dinamis: Warna latar judul halaman mengikuti Site Settings → hero_bg_color_start
> Login Page: Logo & warna button dinamis dari Site Settings
> Stack: Next.js 16 + TypeScript + Prisma 7 + MySQL 8 + Tailwind CSS 4 + nginx 1.28 + PM2

---

## 1. Cara Menjalankan

### Development (Lokal — D:\kmc-project)
```bash
npm run dev     # http://localhost:3000
npm run build   # Production build
npm start       # Production server
npx tsx prisma/seed.ts  # Seed data ulang
npx prisma migrate deploy  # Migrasi database
```

### Production (Server 192.168.1.52 — Ubuntu 26.04)
| Layanan | Port | Keterangan |
|---------|------|------------|
| Next.js (PM2) | 3000 | Aplikasi utama, via `pm2 start npm --name kmc-project -- start` |
| nginx reverse proxy | 80 | Proxy 80 → 3000, set X-Forwarded-Proto |
| Cloudflare Tunnel | - | Tunnel ke Cloudflare (token di systemd) |
| MySQL | 3306 | Database kmc, root tanpa password (mysql_native_password) |

### SSH Akses Server
```bash
plink -ssh root@192.168.1.52
# Password: it92528!@
# Atau via pscp untuk transfer file:
pscp -pw it92528!@ file.sql root@192.168.1.52:/root/kmc-project/
```

---

## 2. Database — MySQL 8.0.30

Host: localhost:3306
Database: kmc
User: root
Password: (tanpa password)
Auth: mysql_native_password

File konfigurasi:
- `.env` — DATABASE_URL untuk Prisma CLI
- `src/lib/db.ts` — Koneksi runtime via PrismaMariaDb adapter
- `prisma/schema.prisma` — Schema dengan **12 model + 2 join table**
- Prisma client digenerate ke `src/generated/prisma/`

> Catatan: Root MySQL sudah diubah auth plugin-nya ke mysql_native_password agar kompatibel dengan @prisma/adapter-mariadb.

---

## 3. Struktur Database (Prisma Schema)

### User
- id (Int, PK), email (String, Unique), password (hash), name, role (ADMIN|HR|INTERNAL)
- Relasi: hasMany Article, hasMany ArticleCollection, hasMany ExamAssignment

### ArticleCollection (Bookmark)
- id, userId, articleId, createdAt
- Unique: [userId, articleId] — satu bookmark per user per artikel

### Group (kategori artikel)
- id, order, status (PUBLIC|INTERNAL), createdAt, updatedAt
- Relasi: hasMany SubGroup, hasMany Article, hasMany GroupTranslation

### GroupTranslation
- groupId, locale (en|id), name
- Unique: [groupId, locale]

### SubGroup (sub-kategori)
- id, groupId, order, status (PUBLIC|INTERNAL), createdAt, updatedAt
- Relasi: belongsTo Group, hasMany Article, hasMany SubGroupTranslation

### SubGroupTranslation
- subgroupId, locale, name
- Unique: [subgroupId, locale]

### Article
- id, groupId, subgroupId (nullable), status (PUBLIC|INTERNAL|DRAFT), authorId
- Relasi: belongsTo Group, SubGroup, User; hasMany ArticleTranslation, ArticleFeedback, ArticleCollection

### ArticleTranslation
- articleId, locale, title, content (HTML)
- Unique: [articleId, locale]

### ArticleFeedback
- id, articleId, helpful (Boolean), ip (String), createdAt, updatedAt
- Unique: [articleId, ip] — satu feedback per IP per artikel

### QuestionGroup (kelompok soal)
- id, order, status (PUBLIC|INTERNAL|DRAFT), createdAt, updatedAt
- Relasi: hasMany QuestionGroupTranslation, hasMany Question

### QuestionGroupTranslation
- questionGroupId, locale, name
- Unique: [questionGroupId, locale]

### Question (soal)
- id, questionGroupId, content (HTML), imageUrl (nullable), order, correctOptionIndex
- Relasi: belongsTo QuestionGroup, hasMany QuestionOption, hasMany ExamQuestion, hasMany ExamAnswer

### QuestionOption (pilihan jawaban)
- id, questionId, index (0-3), content
- Unique: [questionId, index]

### Exam (ujian)
- id, name (String), createdAt, updatedAt
- Relasi: hasMany ExamQuestion, hasMany ExamAssignment

### ExamQuestion (join table Exam ↔ Question)
- id, examId, questionId
- Unique: [examId, questionId]
- Relasi: belongsTo Exam, belongsTo Question

### ExamAssignment (penugasan ujian)
- id, examId, userId, status (PENDING|IN_PROGRESS|COMPLETED), score (Int?), startedAt, submittedAt
- Unique: [examId, userId] — satu penugasan per user per ujian
- Relasi: belongsTo Exam, belongsTo User, hasMany ExamAnswer

### ExamAnswer (jawaban user)
- id, assignmentId, questionId, selectedOptionIndex (Int?), isCorrect (Boolean?)
- Relasi: belongsTo ExamAssignment, belongsTo Question

### Setting
- key (String, PK), value (String)

---

## 4. Autentikasi & Middleware

- JWT (jsonwebtoken) — token disimpan di cookie httpOnly (key: "token")
- Bcryptjs — hash password (salt rounds: 10)
- `src/lib/auth.ts` — fungsi hashPassword, comparePassword, signToken, verifyToken, getAuthUser
- Token expires: 7 hari

### Role System (3 roles)
| Role       | Akses                                        |
|------------|----------------------------------------------|
| ADMIN      | Semua akses termasuk settings, users, exams  |
| HR         | CRUD groups, subgroups, questions, articles, exams, exam-assignments |
| INTERNAL   | Lihat artikel PUBLIC + INTERNAL, bookmark, kerjakan ujian |

### Proteksi Route (middleware.ts)
- `/enter/login` — halaman publik
- `/enter/:path*` — butuh login (kecuali login)
- `/enter/settings`, `/enter/users` — ADMIN only
- `/enter/groups`, `/enter/subgroups`, `/enter/articles/new`, `/enter/question-groups`, `/enter/questions`, `/enter/exams`, `/enter/exam-assignments` — ADMIN + HR
- `/enter/hr/dashboard` — khusus role HR
- `/enter/my-exams` — semua login (khusus INTERNAL di UI)
- `/enter` — redirect ke dashboard (atau /enter/hr/dashboard untuk HR)

### User Seed
- Admin: admin@kmc.com / admin123 (role: ADMIN)
- Internal: internal@kmc.com / internal123 (role: INTERNAL)

---

## 5. API Routes (Next.js App Router)

### Auth
| Method | Route              | Deskripsi                          | Akses    |
|--------|--------------------|------------------------------------|----------|
| POST   | /api/auth/login    | Login (email + password → cookie)  | Public   |
| GET    | /api/auth/me       | Cek user saat ini                  | Public   |
| POST   | /api/auth/me       | Logout (hapus cookie)              | Public   |

### Articles
| Method | Route                     | Deskripsi                        | Akses       |
|--------|---------------------------|----------------------------------|-------------|
| GET    | /api/articles             | List artikel (query: locale, groupId, subgroupId, status, q/search, limit) | Role-based  |
| POST   | /api/articles             | Buat artikel baru                | ADMIN       |
| GET    | /api/articles/[id]        | Detail artikel                   | Role-based  |
| PUT    | /api/articles/[id]        | Update artikel                   | ADMIN       |
| DELETE | /api/articles/[id]        | Hapus artikel                    | ADMIN       |
| POST   | /api/articles/[id]/bookmark  | Toggle bookmark               | LOGIN       |
| GET    | /api/articles/[id]/feedback  | Get feedback counts           | Public      |
| POST   | /api/articles/[id]/feedback  | Submit feedback               | Public      |

### Groups
| Method | Route              | Deskripsi                        | Akses       |
|--------|--------------------|----------------------------------|-------------|
| GET    | /api/groups        | List grup (includes subgroups)   | Role-based  |
| POST   | /api/groups        | Buat grup                        | ADMIN + HR  |
| GET    | /api/groups/[id]   | Detail grup                      | LOGIN       |
| PUT    | /api/groups/[id]   | Update grup                      | ADMIN + HR  |
| DELETE | /api/groups/[id]   | Hapus grup                       | ADMIN + HR  |

### SubGroups
| Method | Route                 | Deskripsi                        | Akses       |
|--------|-----------------------|----------------------------------|-------------|
| GET    | /api/subgroups        | List subgroup (query: groupId, locale) | Role-based |
| POST   | /api/subgroups        | Buat subgroup                    | ADMIN + HR  |
| GET    | /api/subgroups/[id]   | Detail subgroup                  | LOGIN       |
| PUT    | /api/subgroups/[id]   | Update subgroup                  | ADMIN + HR  |
| DELETE | /api/subgroups/[id]   | Hapus subgroup                   | ADMIN + HR  |

### Question Groups
| Method | Route                         | Deskripsi                     | Akses       |
|--------|-------------------------------|-------------------------------|-------------|
| GET    | /api/question-groups          | List kelompok soal            | Role-based  |
| POST   | /api/question-groups          | Buat kelompok soal            | ADMIN + HR  |
| GET    | /api/question-groups/[id]     | Detail kelompok soal          | LOGIN       |
| PUT    | /api/question-groups/[id]     | Update kelompok soal          | ADMIN + HR  |
| DELETE | /api/question-groups/[id]     | Hapus kelompok soal           | ADMIN + HR  |

### Questions
| Method | Route                   | Deskripsi                        | Akses       |
|--------|-------------------------|----------------------------------|-------------|
| GET    | /api/questions          | List soal (query: questionGroupId, locale) | Role-based |
| POST   | /api/questions          | Buat soal (dengan 4 options)     | ADMIN + HR  |
| GET    | /api/questions/[id]     | Detail soal + options            | LOGIN       |
| PUT    | /api/questions/[id]     | Update soal + options            | ADMIN + HR  |
| DELETE | /api/questions/[id]     | Hapus soal                       | ADMIN + HR  |

### Exams (Ujian)
| Method | Route                                     | Deskripsi                        | Akses       |
|--------|-------------------------------------------|----------------------------------|-------------|
| GET    | /api/exams                                | List semua ujian                 | LOGIN       |
| POST   | /api/exams                                | Buat ujian (dengan daftar soal)  | ADMIN + HR  |
| GET    | /api/exams/[id]                           | Detail ujian + soal + jawaban    | ADMIN + HR  |
| PUT    | /api/exams/[id]                           | Update nama ujian                | ADMIN + HR  |
| DELETE | /api/exams/[id]                           | Hapus ujian                      | ADMIN + HR  |
| POST   | /api/exams/[id]/questions                 | Tambah soal ke ujian             | ADMIN + HR  |
| DELETE | /api/exams/[id]/questions/[questionId]    | Hapus soal dari ujian            | ADMIN + HR  |

### Exam Assignments (Penugasan Ujian)
| Method | Route                                      | Deskripsi                        | Akses       |
|--------|--------------------------------------------|----------------------------------|-------------|
| GET    | /api/exam-assignments                      | List penugasan (filter status)   | ADMIN + HR  |
| POST   | /api/exam-assignments                      | Buat penugasan (exam + users)    | ADMIN + HR  |
| GET    | /api/exam-assignments/[id]                 | Detail penugasan + jawaban       | ADMIN + HR  |
| DELETE | /api/exam-assignments/[id]                 | Hapus penugasan                  | ADMIN + HR  |
| POST   | /api/exam-assignments/[id]/submit          | Submit jawaban (auto-score)      | OWNER       |

### My Exams (Ujian Saya)
| Method | Route                             | Deskripsi                        | Akses       |
|--------|-----------------------------------|----------------------------------|-------------|
| GET    | /api/my-exams                     | List ujian user saat ini         | LOGIN       |
| GET    | /api/my-exams/[id]                | Detail soal untuk dikerjakan     | OWNER       |
| GET    | /api/my-exams/[id]/result         | Hasil ujian (score + breakdown)  | OWNER       |

### Users
| Method | Route              | Deskripsi                        | Akses       |
|--------|--------------------|----------------------------------|-------------|
| GET    | /api/users         | List semua user                  | ADMIN + HR  |
| POST   | /api/users         | Buat user baru                   | ADMIN       |
| PUT    | /api/users/[id]    | Update user                      | ADMIN       |
| DELETE | /api/users/[id]    | Hapus user (tidak bisa sendiri)  | ADMIN       |

### Settings & Upload
| Method | Route              | Deskripsi                        | Akses       |
|--------|--------------------|----------------------------------|-------------|
| GET    | /api/settings      | Ambil semua settings             | Public      |
| PUT    | /api/settings      | Update settings                  | ADMIN       |
| POST   | /api/settings      | Upload file (logo/bg image)      | ADMIN       |
| POST   | /api/upload        | Upload gambar (untuk editor)     | ADMIN       |
| POST   | /api/parse-pdf     | Parse PDF/DOCX → HTML/text       | ADMIN + HR  |

### Access Control (Articles GET)
- PUBLIC → lihat artikel status PUBLIC saja
- INTERNAL → lihat PUBLIC + INTERNAL
- ADMIN → lihat semua (PUBLIC + INTERNAL + DRAFT)

### Access Control (Groups & SubGroups GET)
- PUBLIC → lihat status PUBLIC saja
- LOGIN → lihat PUBLIC + INTERNAL

---

## 6. Halaman (Pages)

### Public Pages
| Route               | Deskripsi                                              |
|---------------------|--------------------------------------------------------|
| /                   | Home: hero + search bar + kategori + 5 artikel terbaru + footer |
| /search             | Pencarian dengan sidebar grup/subgroup filter          |
| /articles/[id]      | Detail artikel: feedback, bookmark, breadcrumbs        |
| /not-found          | 404 custom                                             |

### Admin/Internal Pages (/enter/*)
| Route                               | Deskripsi                                    | Akses         |
|-------------------------------------|----------------------------------------------|---------------|
| /enter/login                        | Form login                                   | Public        |
| /enter/dashboard                    | Dashboard utama (koleksi, kategori, artikel)  | LOGIN         |
| /enter/hr/dashboard                 | Dashboard khusus HR                          | HR            |
| /enter/articles                     | Daftar artikel (table)                       | LOGIN         |
| /enter/articles/new                 | Form buat artikel (Tiptap editor bilingual)  | ADMIN         |
| /enter/articles/[id]/edit           | Form edit artikel                            | ADMIN         |
| /enter/groups                       | Manajemen grup (table)                       | ADMIN + HR    |
| /enter/groups/new                   | Form buat grup                               | ADMIN + HR    |
| /enter/groups/[id]/edit             | Form edit grup (name EN/ID, status, order)   | ADMIN + HR    |
| /enter/subgroups                    | Manajemen subgroup (table)                   | ADMIN + HR    |
| /enter/subgroups/new                | Form buat subgroup                           | ADMIN + HR    |
| /enter/subgroups/[id]/edit          | Form edit subgroup                           | ADMIN + HR    |
| /enter/question-groups              | Daftar kelompok soal (table)                 | LOGIN         |
| /enter/question-groups/new          | Form buat kelompok soal                      | ADMIN + HR    |
| /enter/question-groups/[id]/edit    | Form edit kelompok soal                      | ADMIN + HR    |
| /enter/questions                    | Daftar soal per kelompok (filter dropdown)   | LOGIN         |
| /enter/questions/new                | Form buat soal (Tiptap editor + 4 options)   | ADMIN + HR    |
| /enter/questions/[id]/edit          | Form edit soal                               | ADMIN + HR    |
| /enter/users                        | Manajemen user (CRUD modal)                  | ADMIN         |
| /enter/settings                     | Site settings (hero, logo, hover color)      | ADMIN         |
| **/enter/exams**                    | **Daftar ujian (table)**                     | **ADMIN+HR**  |
| **/enter/exams/new**                | **Buat ujian (nama + pilih soal per grup)**  | **ADMIN+HR**  |
| **/enter/exams/[id]/edit**          | **Edit ujian (nama + kelola soal 2 kolom)**  | **ADMIN+HR**  |
| **/enter/exam-assignments**         | **Daftar penugasan ujian (table)**           | **ADMIN+HR**  |
| **/enter/exam-assignments/new**     | **Buat penugasan (pilih exam + user)**       | **ADMIN+HR**  |
| **/enter/exam-assignments/[id]**    | **Detail hasil ujian user (per-soal)**       | **ADMIN+HR**  |
| **/enter/my-exams**                 | **Daftar ujian user (Ujian Saya)**           | **LOGIN**     |
| **/enter/my-exams/[id]**            | **Kerjakan ujian (navigasi soal)**           | **OWNER**     |
| **/enter/my-exams/[id]/result**     | **Hasil ujian (score + breakdown)**          | **OWNER**     |

---

## 7. Komponen

| Komponen                    | Path                              | Deskripsi                                          |
|-----------------------------|-----------------------------------|----------------------------------------------------|
| Header                      | src/components/Header.tsx         | Navbar sticky, dropdown groups (Content/Question Bank/Admin/My Exams), EN/ID kanan, mobile accordion |
| ArticleCard                 | src/components/ArticleCard.tsx    | Card artikel dengan hover color dinamis             |
| ArticleEditor               | src/components/ArticleEditor.tsx  | Rich text editor (Tiptap) dengan toolbar lengkap    |
| ArticleFeedback             | src/components/ArticleFeedback.tsx| Feedback helpful/not helpful + progress bar         |
| BookmarkButton              | src/components/BookmarkButton.tsx | Tombol save/bookmark dengan loading state            |
| CategoryBox                 | src/components/CategoryBox.tsx    | Card kategori hover dinamis, badge INTERNAL          |
| QuestionGroupFilter         | src/components/QuestionGroupFilter.tsx | Dropdown filter kelompok soal (support placeholder) |
| DocumentUploader            | src/components/DocumentUploader.tsx    | Upload & parse PDF/DOCX (drag & drop, pratinjau)    |

---

## 8. Navigasi (Header.tsx)

Menu dikelompokkan dalam dropdown untuk mengurangi panjang navbar:

**Desktop (ADMIN):** Logo | Home | Search | **Content ▼** | **Question Bank ▼** | **Admin ▼** | [EN|ID] | User | Logout
**Desktop (HR):** Logo | Home | Search | **Content ▼** | **Question Bank ▼** | [EN|ID] | User | Logout
**Desktop (INTERNAL):** Logo | Home | Search | **My Exams ▼** | [EN|ID] | User | Logout

### Dropdown Content (ADMIN+HR)
- Articles (Artikel)
- Groups (Grup)
- Sub Groups (Sub Grup)

### Dropdown Question Bank (ADMIN+HR)
- Q. Groups (Kelompok Soal)
- Questions (Soal)
- Exams (Ujian)
- Exam Assignments (Penugasan Ujian)

### Dropdown My Exams (INTERNAL only)
- My Exams (Ujian Saya)

### Dropdown Admin (ADMIN only)
- Users (Pengguna)
- Settings (Pengaturan)

---

## 9. Internasionalisasi (i18n)

Dua bahasa: English (en) dan Indonesian (id)

- `src/i18n/en.ts` — Terjemahan Inggris
- `src/i18n/id.ts` — Terjemahan Indonesia
- `src/i18n/index.ts` — Helper getTranslations, getLocaleFromCookie, t()

Locale disimpan di cookie (key: "locale"). Default: "en".
Switcher bahasa di Header component (EN/ID buttons) — diposisikan paling kanan.

Selain i18n files, beberapa halaman juga punya inline translation dictionary:
- Halaman Questions, Exams, Exam Assignments, My Exams
- Header navigation labels

---

## 10. CSS / Styling

- Tailwind CSS 4 (via @tailwindcss/postcss)
- File: `src/app/globals.css`
- Warna utama: Indigo (indigo-600, indigo-700)
- Background: gray-50
- Full responsive (desktop + mobile)
- Hover effects dinamis menggunakan `<style>` tag dengan CSS variables
  (warna hover bisa diubah dari settings -> hover_category_color)
- **Header judul halaman dinamis** — semua 15+ halaman `/enter/*` menggunakan `hero_bg_color_start`
  dari Site Settings sebagai warna background judul (solid atau gradient), bukan hardcoded blue

---

## 11. Fitur-fitur Detail

### Exam (Ujian) — ADMIN + HR
- Buat ujian dengan nama + pilih soal dari berbagai kelompok soal
- Edit ujian: layout dua kolom (kiri: daftar soal + hapus, kanan: browser soal + tambah)
- Navigasi: Question Bank dropdown → Exams

### Exam Assignment (Penugasan Ujian) — ADMIN + HR
- Pilih ujian + pilih user INTERNAL yang akan ditugaskan
- Lihat daftar penugasan (status, score, user)
- Detail penugasan: lihat jawaban user per-soal dengan koreksi (hijau = benar, merah = salah)
- Navigasi: Question Bank dropdown → Exam Assignments

### My Exams (Ujian Saya) — INTERNAL
- Lihat daftar ujian yang ditugaskan (status pending/completed)
- Kerjakan ujian: navigasi antar soal (tombol Previous/Next + navigation dots)
- Progress bar & indikator soal yang sudah dijawab
- Submit jawaban → auto-calculate score
- Lihat hasil: score + breakdown per soal (hijau = jawaban benar, merah = jawaban salah)

### Other Features
- Article Feedback — rating helpful/not helpful per IP
- Bookmark — simpan artikel untuk user login
- Question Bank — kelompok soal bilingual + soal pilihan ganda dengan 4 opsi + gambar
- Rich Text Editor (Tiptap) — bold, italic, headings, lists, link, image upload

---

## 12. Konfigurasi Penting

### .env
```env
DATABASE_URL="mysql://root@localhost:3306/kmc"
JWT_SECRET="kmc-super-secret-key-change-in-production-2024"
```

### next.config.ts
- `serverExternalPackages: ["pdf-parse"]` — native module PDF parsing

### tsconfig.json
- Path alias: @/* → ./src/*
- Strict mode enabled
- Module: ESNext, Resolution: bundler
- JSX: react-jsx

### prisma.config.ts (Prisma 7)
- Config untuk Prisma CLI
- Membaca DATABASE_URL dari .env

### Middleware (src/middleware.ts)
- Matcher: /enter/:path*
- Role-based access control (ADMIN, HR, INTERNAL)
- Catatan: Deprecated di Next.js 16, perlu migrasi ke "proxy" file convention

---

## 13. Dependencies (package.json)

### Runtime
| Package                      | Version   | Kegunaan                              |
|------------------------------|-----------|---------------------------------------|
| next                         | 16.2.9    | Framework                             |
| react / react-dom            | 19.2.4    | UI library                            |
| @prisma/client               | 7.8.0     | ORM                                   |
| @prisma/adapter-mariadb      | 7.8.0     | Database adapter                      |
| mariadb                      | 3.5.3     | MariaDB driver (MySQL 8 compatible)   |
| mysql2                       | 3.22.5    | Alternatif driver                     |
| bcryptjs                     | 3.0.3     | Hash password                         |
| jsonwebtoken                 | 9.0.3     | JWT auth                              |
| @tiptap/react                | 3.26.1    | Rich text editor                      |
| @tiptap/starter-kit          | 3.26.1    | Tiptap starter extensions             |
| @tiptap/extension-image      | 3.26.1    | Image insertion                       |
| @tiptap/extension-link       | 3.26.1    | Link insertion                        |
| @tiptap/extension-placeholder| 3.26.1    | Placeholder text                      |
| @tiptap/pm                   | 3.26.1    | ProseMirror engine                    |
| pdf-parse                    | ^2.4.5    | PDF text extraction (server-side)    |
| mammoth                      | ^3.0.0    | Word .docx → HTML conversion         |

### Dev
| Package                      | Version   |
|------------------------------|-----------|
| typescript                   | ^5        |
| tailwindcss                  | ^4        |
| @tailwindcss/postcss         | ^4        |
| eslint                       | ^9        |
| eslint-config-next           | 16.2.9    |
| @types/node                  | ^20       |
| @types/react                 | ^19       |
| @types/react-dom             | ^19       |
| @types/jsonwebtoken          | ^9.0.10   |

---

## 14. Settings System (Key-Value Database)

Settings disimpan di database (model Setting: key String @id, value String).

### SiteSettings Interface (src/lib/settings.ts)
- `site_title` — Judul site (browser tab)
- `site_logo` — URL logo
- `hero_title_en/id` — Judul hero per bahasa
- `hero_subtitle_en/id` — Subtitle hero per bahasa
- `hero_bg_color_start` — Warna gradient awal (hex) — **juga digunakan sebagai background judul** di semua halaman `/enter/*`
- `hero_bg_color_end` — Warna gradient akhir (hex) — digunakan di halaman edit/create dengan efek gradient
- `hero_bg_image` — URL gambar background hero (upload atau paste URL)
- `hover_category_color` — Warna efek hover kartu kategori & artikel (default: #4f46e5)

### Settings Page
- Lokasi: `/enter/settings` (ADMIN only)
- Upload gambar untuk logo & hero background
- Color picker untuk gradient hero dan hover color
- Preview live hero section
- Rekomendasi ukuran background image: 1920 x 600 px (max. 5MB)

---

## 15. Known Issues / Gotchas

1. **@prisma/adapter-mariadb tidak bisa connect ke MySQL 8.0.30**
   - Penyebab: MySQL 8 pakai caching_sha2_password, MariaDB driver tidak kompatibel
   - Solusi: `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''`

2. **PrismaMariaDb constructor expects PoolConfig, not Pool instance**
   - Salah: `const pool = mariadb.createPool({...}); new PrismaMariaDb(pool);`
   - Benar: `new PrismaMariaDb({host, user, port, database, ...});`

3. **Build error: regex literal dengan // dikira comment**
   - Hindari `//` di template literal, pakai string parsing biasa

4. **Middleware deprecated di Next.js 16**
   - Perlu migrasi ke "proxy" file convention

5. **PrismaClient singleton menyimpan instansi lama setelah migration**
   - Setelah `prisma migrate dev`, restart dev server agar PrismaClient memuat model baru

9. **Kolom content di ArticleTranslation VARCHAR(191) terlalu kecil**
   - Penyebab: Default Prisma `String` = `VARCHAR(191)` (max 191 karakter)
   - HTML dari mammoth (Word .docx) bisa puluhan ribu karakter → error simpan
   - Solusi: `content String @db.LongText` di Prisma schema + ALTER TABLE manual

10. **Upload file resmi hanya di Edit/New Article (PDF + DOCX)**
   - Input Method toggle: Manual ↔ Upload Document
   - PDF via `pdf-parse` library (class-based API `PDFParse({data: buffer})`)
   - DOCX via `mammoth` library (konversi langsung ke HTML)
   - Component: `DocumentUploader.tsx` (drag & drop, preview)
   - Endpoint: `POST /api/parse-pdf` (deteksi otomatis PDF/DOCX)
   - Limit: 10MB per file

6. **MySQL case-sensitive table names di Linux** (Sudah diperbaiki)
   - Migrasi `20260612091621_add_status_groups_subgroups` menggunakan `group` lowercase
   - Linux MySQL case-sensitive → error karena tabel bernama `Group` (kapital)
   - Fix: ubah `group` → `Group`, `subgroup` → `SubGroup` di migration.sql

7. **Cookie secure flag blocking login/logout via HTTP** (Sudah diperbaiki)
   - Login & logout API set `secure: process.env.NODE_ENV === "production"`
   - Browser tolak cookie secure di koneksi HTTP → login/logout tidak berfungsi
   - Fix: ganti ke `secure: request.headers.get("x-forwarded-proto") === "https"`

8. **Menu tidak muncul setelah login** (Sudah diperbaiki)
   - Header di root layout, tidak re-mount saat `router.push()` (client-side nav)
   - `sessionStorage` menyimpan data user setelah login
   - `window.location.href` untuk full page reload agar Header re-mount

---

## 16. Catatan untuk Pengembangan Selanjutnya

- [ ] Migrasi middleware ke file proxy (Next.js 16 deprecation)
- [ ] Fitur dark mode
- [ ] Role management yang lebih granular
- [x] Upload & parse PDF file ke editor artikel (pdf-parse)
- [x] Upload & parse Word (.docx) file ke editor artikel (mammoth.js)
- [x] Fix kolom content VARCHAR(191) → LONGTEXT di ArticleTranslation
- [ ] Upload gambar/file untuk artikel (sudah ada endpoint, perlu integrasi)
- [ ] Rate limiting API
- [ ] Unit tests
- [x] Deploy ke production server (192.168.1.52 — Ubuntu 26.04)
- [ ] Export soal ke PDF/excel
- [ ] Quiz/try-out interaktif untuk soal
- [ ] Halaman publik untuk mengerjakan ujian
- [ ] Setup HTTPS/SSL via Cloudflare
