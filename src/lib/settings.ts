import { prisma } from "./db";
import { cache } from "react";

export interface SiteSettings {
  site_title: string;
  site_logo: string;
  hero_title_en: string;
  hero_title_id: string;
  hero_subtitle_en: string;
  hero_subtitle_id: string;
  hero_bg_color_start: string;
  hero_bg_color_end: string;
  hero_bg_image: string;
  hover_category_color: string;
  header_btn_caption: string;
  header_btn_link: string;
}

export const defaultSettings: SiteSettings = {
  site_title: "Knowledge Management Center",
  site_logo: "",
  hero_title_en: "Knowledge Management Center",
  hero_title_id: "Pusat Manajemen Pengetahuan",
  hero_subtitle_en: "Find answers and information quickly and easily",
  hero_subtitle_id: "Temukan jawaban dan informasi dengan cepat dan mudah",
  hero_bg_color_start: "#4f46e5",
  hero_bg_color_end: "#1e1b4b",
  hero_bg_image: "",
  hover_category_color: "#4f46e5",
  header_btn_caption: "Donasi",
  header_btn_link: "https://digital.dompetdhuafa.org/",
};

export const getAllSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row.key] = row.value;
    }
    return { ...defaultSettings, ...map } as SiteSettings;
  } catch {
    return defaultSettings;
  }
});

export async function updateSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
