import { en, type Translations } from "./en";
import { id } from "./id";

const translations: Record<string, Translations> = { en, id };

export type Locale = "en" | "id";

export function getTranslations(locale: string): Translations {
  return translations[locale] || en;
}

export function getLocaleFromCookie(cookieHeader?: string | null): Locale {
  if (!cookieHeader) return "en";
  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "locale") return (value === "id" ? "id" : "en");
  }
  return "en";
}

export function t(key: string, locale: Locale, params?: Record<string, string>): string {
  const keys = key.split(".");
  let value: any = translations[locale] || en;
  for (const k of keys) {
    value = value?.[k];
  }
  if (!value) return key;
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_: string, p: string) => params[p] || `{${p}}`);
  }
  return value;
}
