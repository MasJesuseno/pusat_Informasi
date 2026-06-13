import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import { getAllSettings } from "@/lib/settings";

const inter = Inter({
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAllSettings();
  return {
    title: settings.site_title,
    description: "Pusat Manajemen Pengetahuan - Knowledge Management Center",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const settings = await getAllSettings();

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-gray-50 flex flex-col`}>
        <Header siteTitle={settings.site_title} logoUrl={settings.site_logo} heroBgColorStart={settings.hero_bg_color_start} />
        <main className="flex-1">
          {children}
        </main>
        <footer
          className="w-full text-white text-xs"
          style={{ backgroundColor: settings.hero_bg_color_start }}
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[1cm]">
            <span>Pusat Informasi &copy; 2026</span>
            <Link
              href="/guide"
              className="hover:underline hover:text-white/80 transition-colors"
            >
              {locale === "id" ? "Panduan" : "Guide"}
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
