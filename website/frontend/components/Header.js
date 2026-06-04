import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

export default function Header() {
  const { t, locale, switchLocale } = useTranslation();

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src="/assets/MalishevaLogo.png"
            alt="FC Malisheva"
            className="logo"
          />
          <span className="site-title">FC Malisheva</span>
        </div>

        <nav className="nav-menu">
          <Link href="/">{t("nav.home")}</Link>
          <Link href="/team">{t("nav.team")}</Link>
          <Link href="/staff">{t("nav.staff")}</Link>
          <Link href="/results">{t("nav.results")}</Link>
          <Link href="/history">{t("nav.history")}</Link>
          <Link href="/gallery">{t("nav.gallery")}</Link>
          <Link href="/shop">{t("nav.shop")}</Link>
        </nav>

        <div className="header-spacer">
          <button onClick={switchLocale} className="lang-btn">
            {locale === "sq" ? "🇬🇧 EN" : "🇦🇱 SQ"}
          </button>
        </div>
      </div>
    </header>
  );
}
