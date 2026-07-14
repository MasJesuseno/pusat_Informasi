import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: 'localhost',
  user: 'root',
  database: 'kmc',
  port: 3306,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding MySQL...");

  const adminPw = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kmc.com" },
    update: {},
    create: { email: "admin@kmc.com", password: adminPw, name: "Admin KMC", role: "ADMIN" },
  });
  console.log("Admin user created");

  const intPw = await bcrypt.hash("internal123", 10);
  await prisma.user.upsert({
    where: { email: "internal@kmc.com" },
    update: {},
    create: { email: "internal@kmc.com", password: intPw, name: "Internal User", role: "INTERNAL" },
  });
  console.log("Internal user created");

  const hrPw = await bcrypt.hash("hr123", 10);
  await prisma.user.upsert({
    where: { email: "hr@kmc.com" },
    update: {},
    create: { email: "hr@kmc.com", password: hrPw, name: "HR User", role: "HR" },
  });
  console.log("HR user created");

  const g1 = await prisma.group.create({
    data: { order: 1, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Getting Started" }, { locale: "id", name: "Memulai" }] } },
  });
  const g2 = await prisma.group.create({
    data: { order: 2, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Account and Billing" }, { locale: "id", name: "Akun dan Tagihan" }] } },
  });
  const g3 = await prisma.group.create({
    data: { order: 3, status: "INTERNAL", translations: { create: [{ locale: "en", name: "Features and Guides" }, { locale: "id", name: "Fitur dan Panduan" }] } },
  });
  const g4 = await prisma.group.create({
    data: { order: 4, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Troubleshooting" }, { locale: "id", name: "Pemecahan Masalah" }] } },
  });

  const s1 = await prisma.subGroup.create({
    data: { groupId: g1.id, order: 1, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Quick Start" }, { locale: "id", name: "Mulai Cepat" }] } },
  });
  const s2 = await prisma.subGroup.create({
    data: { groupId: g1.id, order: 2, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Account Setup" }, { locale: "id", name: "Pengaturan Akun" }] } },
  });
  const s3 = await prisma.subGroup.create({
    data: { groupId: g2.id, order: 1, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Subscription Plans" }, { locale: "id", name: "Paket Langganan" }] } },
  });
  const s4 = await prisma.subGroup.create({
    data: { groupId: g3.id, order: 1, status: "INTERNAL", translations: { create: [{ locale: "en", name: "Core Features" }, { locale: "id", name: "Fitur Utama" }] } },
  });
  const s5 = await prisma.subGroup.create({
    data: { groupId: g4.id, order: 1, status: "PUBLIC", translations: { create: [{ locale: "en", name: "Common Issues" }, { locale: "id", name: "Masalah Umum" }] } },
  });

  async function createArticle(gid: number, sgid: number | null, status: string, enTitle: string, enContent: string, idTitle: string, idContent: string) {
    await prisma.article.create({
      data: {
        groupId: gid, subgroupId: sgid, status, authorId: admin.id,
        translations: { create: [{ locale: "en", title: enTitle, content: enContent }, { locale: "id", title: idTitle, content: idContent }] },
      },
    });
  }

  await createArticle(g1.id, s1.id, "PUBLIC", "Welcome to Knowledge Management Center", "Welcome! This platform helps you find information.", "Selamat Datang di Pusat Manajemen Pengetahuan", "Selamat datang! Platform ini membantu Anda menemukan informasi.");
  await createArticle(g1.id, s1.id, "PUBLIC", "How to Search for Articles", "Use the search bar at the top to find articles.", "Cara Mencari Artikel", "Gunakan bilah pencarian di bagian atas untuk mencari artikel.");
  await createArticle(g1.id, s2.id, "PUBLIC", "Creating Your Account", "Click Login and select Create Account.", "Membuat Akun Anda", "Klik Masuk dan pilih Buat Akun.");
  await createArticle(g2.id, s3.id, "PUBLIC", "Available Subscription Plans", "We offer Basic, Pro, and Enterprise plans.", "Paket Langganan Tersedia", "Kami menawarkan paket Dasar, Pro, dan Enterprise.");
  await createArticle(g3.id, s4.id, "INTERNAL", "Internal Workflow Guidelines", "Internal guidelines for team members.", "Panduan Alur Kerja Internal", "Panduan internal untuk anggota tim.");
  await createArticle(g4.id, s5.id, "PUBLIC", "Troubleshooting Login Issues", "Steps to resolve login problems.", "Pemecahan Masalah Login", "Langkah-langkah mengatasi masalah login.");
  await createArticle(g4.id, s5.id, "DRAFT", "Upcoming Feature: Dark Mode", "Dark mode feature coming soon!", "Fitur Mendatang: Mode Gelap", "Fitur mode gelap akan segera hadir!");

  

  // Seed default settings
  const defaultSettings = [
    { key: 'site_title', value: 'Knowledge Management Center' },
    { key: 'site_logo', value: '' },
    { key: 'hero_title_en', value: 'Knowledge Management Center' },
    { key: 'hero_title_id', value: 'Pusat Manajemen Pengetahuan' },
    { key: 'hero_subtitle_en', value: 'Find answers and information quickly and easily' },
    { key: 'hero_subtitle_id', value: 'Temukan jawaban dan informasi dengan cepat dan mudah' },
    { key: 'hero_bg_color_start', value: '#4f46e5' },
    { key: 'hero_bg_color_end', value: '#1e1b4b' },
    { key: 'hero_bg_image', value: '' },
    { key: 'header_btn_caption', value: 'Donasi' },
    { key: 'header_btn_link', value: 'https://digital.dompetdhuafa.org/' },
  ];
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('Default settings seeded');

  console.log("Seed completed!");
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
