import { cookies } from "next/headers";
import { getAllSettings } from "@/lib/settings";
import AdminSidebar from "@/components/AdminSidebar";

export default async function EnterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "en";
  const settings = await getAllSettings();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar
        siteTitle={settings.site_title}
        logoUrl={settings.site_logo}
        heroBgColorStart={settings.hero_bg_color_start}
      />

      {/* Main content area */}
      <div className="flex-1 sidebar-content-area transition-all duration-300">
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
