import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
  const settings = await getAllSettings();

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-gray-50 flex flex-col`}>
        <Header siteTitle={settings.site_title} logoUrl={settings.site_logo} heroBgColorStart={settings.hero_bg_color_start} />
        <main className="flex-1">
          {children}
        </main>
        <footer
          className="w-full flex items-center justify-center text-white text-xs"
          style={{ height: "1cm", backgroundColor: settings.hero_bg_color_start }}
        >
          Pusat Informasi : @2026
        </footer>
      </body>
    </html>
  );
}
