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
          <button onClick={switchLocale} className="lang-btn" style={{display:"flex",alignItems:"center",gap:"6px"}}>
            {locale === "en" ? (
              <><img src="/assets/logos/Al.jpg" alt="SQ" style={{width:"22px",height:"15px",objectFit:"cover",borderRadius:"2px"}} /><span>SQ</span></>
            ) : (
              <><img src="/assets/logos/Gb.jpg" alt="EN" style={{width:"22px",height:"15px",objectFit:"cover",borderRadius:"2px"}} /><span>EN</span></>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
