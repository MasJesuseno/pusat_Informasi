"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function FooterWrapper({
  heroBgColorStart = "#4f46e5",
  locale = "en",
}: {
  heroBgColorStart?: string;
  locale?: string;
}) {
  const pathname = usePathname();

  // Hide footer on enter pages
  if (pathname?.startsWith("/enter")) {
    return null;
  }

  return (
    <footer
      className="w-full text-white text-xs"
      style={{ backgroundColor: heroBgColorStart }}
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
  );
}
