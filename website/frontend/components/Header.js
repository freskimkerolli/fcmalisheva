import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

export default function Header() {
  const { t, locale, switchLocale } = useTranslation();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" onClick={close}>
          <img src="/assets/MalishevaLogo.png" alt="FC Malisheva" className="logo" />
          <span className="site-title">FC Malisheva</span>
        </Link>

        <nav className={`nav-menu${open ? " nav-open" : ""}`}>
          <Link href="/"       onClick={close}>{t("nav.home")}</Link>
          <Link href="/team"   onClick={close}>{t("nav.team")}</Link>
          <Link href="/staff"  onClick={close}>{t("nav.staff")}</Link>
          <Link href="/results" onClick={close}>{t("nav.results")}</Link>
          <Link href="/history" onClick={close}>{t("nav.history")}</Link>
          <Link href="/gallery" onClick={close}>{t("nav.gallery")}</Link>
          <Link href="/shop"   onClick={close}>{t("nav.shop")}</Link>
        </nav>

        <div className="header-spacer">
          <button onClick={switchLocale} className="lang-btn" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {locale === "en" ? (
              <><img src="/assets/logos/Al.jpg" alt="SQ" style={{ width: "22px", height: "15px", objectFit: "cover", borderRadius: "2px" }} /><span>SQ</span></>
            ) : (
              <><img src="/assets/logos/Gb.jpg" alt="EN" style={{ width: "22px", height: "15px", objectFit: "cover", borderRadius: "2px" }} /><span>EN</span></>
            )}
          </button>
          <button className="burger-btn" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {open && <div className="nav-overlay" onClick={close} />}
    </header>
  );
}
