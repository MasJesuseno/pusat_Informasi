# KMC (Knowledge Management Center)

Aplikasi manajemen pengetahuan berbasis web — Next.js 16 + TypeScript + Prisma 7 + MySQL.

**Live:** http://192.168.1.52

---

## Panduan Update Aplikasi (GitHub → Server)

Panduan ini untuk melakukan update kode dari lokal ke server production.

### 📌 Alur Singkat

```
Lokal (Windows) → Commit → Push ke GitHub → Server (Ubuntu) → Pull → Build → Restart
```

---

## Langkah 1: Commit & Push ke GitHub (Lokal)

### 1a. Cek perubahan

```bash
cd D:\kmc-project
git status
```

### 1b. Stage & Commit semua perubahan

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

### 1c. Push ke GitHub

```bash
git push
```

> GitHub akan otomatis minta login via browser (Git Credential Manager).\
> Username: `MasJesuseno`\
> Token sudah tersimpan, jika diminta ulang pakai Personal Access Token.

---

## Langkah 2: Deploy ke Server (192.168.1.52)

### 2a. SSH ke server

Via **plink** (PuTTY command line):

```bash
plink -ssh -pw "it92528!@" root@192.168.1.52
```

Atau pakai cmd satu baris untuk langsung jalanin perintah:

```bash
plink -ssh -batch -pw "it92528!@" root@192.168.1.52 "cd /root/kmc-project && git pull && npm install && npx prisma generate && npm run build && pm2 restart kmc-project"
```

### 2b. Atau jalankan step by step di server

```bash
# 1. Masuk ke folder project
cd /root/kmc-project

# 2. Tarik update terbaru dari GitHub
git pull origin master

# 3. Install dependency baru (jika ada)
npm install

# 4. Generate ulang Prisma client (jika ada perubahan schema)
npx prisma generate

# 5. Build ulang aplikasi (Next.js)
npm run build

# 6. Restart aplikasi di PM2
pm2 restart kmc-project
```

### 2c. Verifikasi

Cek apakah aplikasi berjalan normal:

```bash
# Cek status PM2
pm2 list

# Cek HTTP response (harus 200)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/

# Lihat log realtime (opsional)
pm2 logs kmc-project --lines 20
```

---

## Langkah 3: Jika Ada Perubahan Database (Migrasi)

Jika ada perubahan di `prisma/schema.prisma`, jalankan migrasi:

```bash
# Di server
cd /root/kmc-project

# Jalankan migrasi
npx prisma migrate deploy

# Generate ulang client
npx prisma generate

# Build & restart
npm run build
pm2 restart kmc-project
```

> ⚠️ **PENTING:** Jangan jalankan `prisma migrate dev` di server!\
> Gunakan `prisma migrate deploy` untuk menjalankan migrasi yang sudah ada.

Untuk membuat migrasi baru, lakukan di **lokal** dulu:

```bash
# Di lokal (Windows)
cd D:\kmc-project
npx prisma migrate dev --name nama_migrasi
```

Lalu commit file migrasi yang tergenerate ke GitHub, dan jalankan `prisma migrate deploy` di server.

---

## Cheatsheet Cepat

### Lokal (Windows — D:\kmc-project)

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Jalankan development server (localhost:3000) |
| `npm run build` | Build production |
| `git status` | Cek perubahan |
| `git add -A && git commit -m "pesan"` | Commit |
| `git push` | Push ke GitHub |
| `git pull` | Tarik update dari GitHub |

### Server (192.168.1.52 — root/kmc-project)

| Perintah | Fungsi |
|----------|--------|
| `pm2 list` | Cek status aplikasi |
| `pm2 restart kmc-project` | Restart aplikasi |
| `pm2 logs kmc-project` | Lihat log |
| `pm2 stop kmc-project` | Hentikan aplikasi |
| `pm2 start npm --name kmc-project -- start` | Start ulang dari awal |

### SSH/Transfer File

| Perintah | Fungsi |
|----------|--------|
| `plink -ssh -pw "it92528!@" root@192.168.1.52` | SSH interactive |
| `pscp -pw "it92528!@" file.txt root@192.168.1.52:/root/` | Upload file |
| `pscp -pw "it92528!@" root@192.168.1.52:/root/file.txt .` | Download file |

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

### ❌ PM2 error setelah deploy

```bash
pm2 logs kmc-project --lines 50
# Cek error log lengkap
cat /root/.pm2/logs/kmc-project-error.log
```

### ❌ Aplikasi error 502 / hang

```bash
# Restart paksa
pm2 delete kmc-project
cd /root/kmc-project && npm run build
pm2 start npm --name kmc-project -- start
# Reload nginx juga
nginx -s reload
```
