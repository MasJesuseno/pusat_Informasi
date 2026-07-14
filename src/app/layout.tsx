import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import FooterWrapper from "@/components/FooterWrapper";
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
        <Header siteTitle={settings.site_title} logoUrl={settings.site_logo} heroBgColorStart={settings.hero_bg_color_start} headerBtnCaption={settings.header_btn_caption} headerBtnLink={settings.header_btn_link} />
        <main className="flex-1">
          {children}
        </main>
        <FooterWrapper heroBgColorStart={settings.hero_bg_color_start} locale={locale} />
      </body>
    </html>
  );
}
