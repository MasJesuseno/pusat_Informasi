# KMC (Knowledge Management Center)

Aplikasi manajemen pengetahuan berbasis web — Next.js 16 + TypeScript + Prisma 7 + MySQL.

---

## Panduan Commit & Push ke GitHub

### 1. Cek perubahan

```bash
git status
```

### 2. Stage & Commit semua perubahan

```bash
git add -A
git commit -m "feat: deskripsi perubahan yang dilakukan"
```

> **Tips commit message:**
> - `feat:` — fitur baru (contoh: `feat: tambah halaman laporan`)
> - `fix:` — perbaikan bug (contoh: `fix: perbaiki error login`)
> - `style:` — perubahan CSS/tampilan (contoh: `style: ubah warna header`)
> - `refactor:` — perubahan kode tanpa ubah fungsi
> - `docs:` — perubahan dokumentasi

### 3. Push ke GitHub

```bash
git push
```

> GitHub akan otomatis minta login via browser (Git Credential Manager).\
> Username: `MasJesuseno`\
> Token sudah tersimpan, jika diminta ulang pakai Personal Access Token.

---

## Cheatsheet Cepat

### Lokal

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan development server (localhost:3000) |
| `npm run build` | Build production |
| `npm start` | Jalankan production server |
| `git status` | Cek perubahan |
| `git add -A && git commit -m "pesan"` | Commit |
| `git push` | Push ke GitHub |
| `git pull` | Tarik update dari GitHub |
| `npx tsx prisma/seed.ts` | Seed data ulang |
| `npx prisma migrate deploy` | Jalankan migrasi database |
| `npx prisma migrate dev --name nama_migrasi` | Buat migrasi baru |

---

## Troubleshooting

### ❌ Build error: "Another next build process is already running"

```bash
pkill -f "next build"
# Lalu build ulang
npm run build
```

### ❌ Git push minta password

Gunakan Personal Access Token sebagai password:\
Buka https://github.com/settings/tokens → Generate classic token (centang repo).

### ❌ Jika Ada Perubahan Database (Migrasi)

> ⚠️ **PENTING:** Jangan jalankan `prisma migrate dev` di server!\
> Gunakan `prisma migrate deploy` untuk menjalankan migrasi yang sudah ada.

Untuk membuat migrasi baru, lakukan di **lokal** dulu:

```bash
npx prisma migrate dev --name nama_migrasi
```

Lalu commit file migrasi yang tergenerate ke GitHub.
