import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Home() {
  const { t, locale } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/announcements`).then((r) => r.json()).then((data) => setAnnouncements(data)).catch(() => {});
    fetch(`${API_URL}/upcoming-match`).then((r) => r.json()).then((data) => setMatch(data)).catch(() => {});
  }, []);

  return (
    <>
      {/* Upcoming Match */}
      {match && (
        <section
          className="upcoming-match-section"
          style={{
            position:"relative", overflow:"hidden",
            ...(match.competition?.toLowerCase().includes("conference") ? {
              background:"#0a0a0a",
              border:"1px solid rgba(255,255,255,0.1)",
            } : {}),
          }}
        >
          {match.competition?.toLowerCase().includes("conference") && (
            <img
              src="/assets/logos/UECL-Logo.png"
              alt="UECL"
              style={{
                position:"absolute", bottom:"14px", left:"14px",
                height:"140px", width:"auto",
                objectFit:"contain",
                mixBlendMode:"screen",
                pointerEvents:"none",
              }}
            />
          )}
          {(() => {
            const dark = match.competition?.toLowerCase().includes("conference");
            const txt = dark ? {color:"#fff"} : undefined;
            const muted = dark ? {color:"#fff"} : undefined;
            return (
              <>
                <div className="match-header">
                  <span className="competition-badge" style={dark ? {color:"#fff"} : undefined}>{t("home.nextMatch")}</span>
                  {dark ? (
                    <span style={{fontSize:"0.85rem", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:"#fff"}}>
                      UEFA Conference League
                    </span>
                  ) : (
                    <img src="/assets/logos/albi-mall-superliga.d81b909e28ccd58241ed.png" alt="Albi Mall Superliga" style={{height:"60px", width:"auto", objectFit:"contain"}} />
                  )}
                  <span className="stadium-info" style={dark ? {color:"#fff"} : {color:"var(--accent)"}}>{match.stadium}</span>
                </div>
                <div className="match-container">
                  <div className="team team-home">
                    <img src={match.home_logo || "/assets/MalishevaLogo.png"} alt={match.home_team} />
                    <h3 style={txt}>{match.home_team}</h3>
                  </div>
                  <div className="match-details">
                    <p className="match-date" style={dark ? {color:"#fff"} : {color:"var(--accent)"}}>{match.match_date}</p>
                    <p className="match-time" style={txt}>{match.match_time}</p>
                  </div>
                  <div className="team team-away">
                    <img src={match.away_logo || "/assets/MalishevaLogo.png"} alt={match.away_team} />
                    <h3 style={txt}>{match.away_team}</h3>
                  </div>
                </div>
                <a href={match.ticket_url || "#"} className="button tickets-btn">
                  🎫 {t("home.buyTickets")}
                </a>
              </>
            );
          })()}
        </section>
      )}

      {/* Announcements */}
      <section className="announcements-section">
        <h2 className="section-title">{t("home.latestNews")}</h2>
        <div className="announcements-grid">
          {announcements.map((a) => (
            <article key={a.id} className="announcement-card">
              <div className="announcement-header">
                <span className="category-badge">
                  {locale === "en" ? (a.category_en || a.category) : a.category}
                </span>
                <span className="announcement-date">{a.date_display}</span>
              </div>
              <h3>{locale === "en" ? (a.title_en || a.title) : a.title}</h3>
              <p>{locale === "en" ? (a.content_en || a.content) : a.content}</p>
              <a href="#" className="read-more">{t("home.readMore")}</a>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links-section">
        <div className="quick-links-grid">
          <Link href="/team" className="quick-link-card">
            <h3>👥 {t("home.quickLinks.team")}</h3>
            <p>{t("home.quickLinks.teamSub")}</p>
          </Link>
          <Link href="/staff" className="quick-link-card">
            <h3>🏆 {t("home.quickLinks.staff")}</h3>
            <p>{t("home.quickLinks.staffSub")}</p>
          </Link>
          <Link href="/gallery" className="quick-link-card">
            <h3>📸 {t("home.quickLinks.gallery")}</h3>
            <p>{t("home.quickLinks.gallerySub")}</p>
          </Link>
          <Link href="/shop" className="quick-link-card">
            <h3>🛍️ {t("home.quickLinks.shop")}</h3>
            <p>{t("home.quickLinks.shopSub")}</p>
          </Link>
        </div>
      </section>
    </>
  );
}
