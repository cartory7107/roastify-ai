import { create } from "zustand";
import { translations } from "./translations";

export type Language = "en" | "bn" | "es" | "fr" | "de" | "it" | "pt" | "hi" | "ur" | "zh" | "ja" | "ko" | "ar" | "tr" | "ru" | "nl";

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "bn", label: "বাংলা", flag: "🇧🇩" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ur", label: "اردو", flag: "🇵🇰" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
];

// RTL languages
export const RTL_LANGUAGES: Language[] = ["ar", "ur"];

// Map browser locale prefixes to our language codes
const BROWSER_LOCALE_MAP: Record<string, Language> = {
  en: "en", bn: "bn", es: "es", fr: "fr", de: "de", it: "it", pt: "pt",
  hi: "hi", ur: "ur", zh: "zh", ja: "ja", ko: "ko", ar: "ar", tr: "tr",
  ru: "ru", nl: "nl",
};

function detectBrowserLanguage(): Language {
  try {
    const stored = localStorage.getItem("roastify-lang");
    if (stored && LANGUAGES.some((l) => l.code === stored)) return stored as Language;
    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && BROWSER_LOCALE_MAP[browserLang]) return BROWSER_LOCALE_MAP[browserLang];
  } catch {}
  return "en";
}

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  language: detectBrowserLanguage(),
  setLanguage: (language) => {
    try { localStorage.setItem("roastify-lang", language); } catch {}
    set({ language });
  },
  t: (key: string) => {
    const lang = get().language;
    return translations[lang]?.[key] || translations.en[key] || key;
  },
}));
