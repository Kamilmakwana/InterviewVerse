import en from "@/messages/en.json";
import hi from "@/messages/hi.json";
import ta from "@/messages/ta.json";
import te from "@/messages/te.json";
import bn from "@/messages/bn.json";
import mr from "@/messages/mr.json";
import gu from "@/messages/gu.json";
import es from "@/messages/es.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import pt from "@/messages/pt.json";
import ar from "@/messages/ar.json";
import zh from "@/messages/zh.json";

export interface LocaleMeta {
  code: string;
  label: string; // English name
  native: string; // endonym
  rtl?: boolean;
  /** BCP-47 tag used for speech synthesis. */
  speech: string;
}

export const LOCALES: LocaleMeta[] = [
  { code: "en", label: "English", native: "English", speech: "en-US" },
  { code: "hi", label: "Hindi", native: "हिन्दी", speech: "hi-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", speech: "ta-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", speech: "te-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", speech: "bn-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", speech: "mr-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", speech: "gu-IN" },
  { code: "es", label: "Spanish", native: "Español", speech: "es-ES" },
  { code: "fr", label: "French", native: "Français", speech: "fr-FR" },
  { code: "de", label: "German", native: "Deutsch", speech: "de-DE" },
  { code: "pt", label: "Portuguese", native: "Português", speech: "pt-BR" },
  { code: "ar", label: "Arabic", native: "العربية", rtl: true, speech: "ar-SA" },
  { code: "zh", label: "Chinese", native: "中文", speech: "zh-CN" },
];

export const LOCALE_CODES = LOCALES.map((l) => l.code);

type Messages = typeof en;
const MESSAGES: Record<string, Messages> = {
  en, hi, ta, te, bn, mr, gu, es, fr, de, pt, ar, zh,
} as Record<string, Messages>;

export function localeMeta(code: string): LocaleMeta {
  return LOCALES.find((l) => l.code === code) ?? LOCALES[0];
}

export function isRtl(code: string): boolean {
  return !!localeMeta(code).rtl;
}

/** Resolve a dot-path like "nav.roadmap" from a locale, falling back to English. */
export function translate(locale: string, path: string): string {
  const dict = MESSAGES[locale] ?? en;
  const get = (obj: unknown): string | undefined => {
    let cur: unknown = obj;
    for (const key of path.split(".")) {
      if (cur && typeof cur === "object" && key in (cur as Record<string, unknown>)) {
        cur = (cur as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return typeof cur === "string" ? cur : undefined;
  };
  return get(dict) ?? get(en) ?? path;
}
