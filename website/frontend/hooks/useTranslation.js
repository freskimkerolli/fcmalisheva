import { useRouter } from "next/router";
import sq from "../locales/sq.json";
import en from "../locales/en.json";

const translations = { sq, en };

export function useTranslation() {
  const { locale, locales, defaultLocale, push, pathname, query, asPath } = useRouter();
  const current = translations[locale] || translations.sq;

  function t(key) {
    const keys = key.split(".");
    let val = current;
    for (const k of keys) {
      val = val?.[k];
      if (val === undefined) return key;
    }
    return val;
  }

  function switchLocale() {
    const next = locale === "sq" ? "en" : "sq";
    push({ pathname, query }, asPath, { locale: next });
  }

  return { t, locale, switchLocale };
}
