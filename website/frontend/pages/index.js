import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://fcmalisheva-production.up.railway.app/api";

export default function Home() {
  const { t, locale } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [match, setMatch] = useState(null);
  const [selectedAnn, setSelectedAnn] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/announcements`).then((r) => r.json()).then((data) => setAnnouncements(data)).catch(() => {});
    fetch(`${API_URL}/upcoming-match`).then((r) => r.json()).then((data) => setMatch(data)).catch(() => {});
  }, []);

  return (
    <>
      {/* Upcoming Match */}
      {match && (
        match.competition?.toLowerCase().includes("conference") ? (
          /* ── UCL Layout: logo poshtë majtas, ndeshja lart djathtas ── */
          <section
            className="upcoming-match-section ucl-section"
            style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.1)", position:"relative", overflow:"hidden", minHeight:"260px" }}
          >
            {/* UCL logo — poshtë majtas */}
            <img
              src="/assets/logos/UECL-Logo.png"
              alt="UECL"
              className="uecl-corner-logo"
              style={{ position:"absolute", bottom:"14px", left:"14px", height:"190px", width:"auto", objectFit:"contain", mixBlendMode:"screen", pointerEvents:"none" }}
            />

            {/* Ndeshja — lart djathtas */}
            <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"10px" }}>
              {/* Header */}
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.5)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"2px" }}>{t("home.nextMatch")}</div>
                <div style={{ fontSize:"0.82rem", fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.08em" }}>UEFA Conference League</div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.55)", textTransform:"uppercase", letterSpacing:"0.06em", marginTop:"2px" }}>{match.stadium}</div>
              </div>

              {/* Ekipet */}
              <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
                  <img src={match.home_logo || "/assets/MalishevaLogo.png"} alt={match.home_team} style={{ width:"60px", height:"60px", objectFit:"contain" }} />
                  <span style={{ color:"#fff", fontSize:"0.85rem", fontWeight:600, textAlign:"center" }}>{match.home_team}</span>
                </div>
                <span style={{ color:"rgba(255,255,255,0.5)", fontWeight:700, fontSize:"1rem" }}>vs</span>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px" }}>
                  <img src={match.away_logo || "/assets/MalishevaLogo.png"} alt={match.away_team} style={{ width:"60px", height:"60px", objectFit:"contain" }} />
                  <span style={{ color:"#fff", fontSize:"0.85rem", fontWeight:600, textAlign:"center" }}>{match.away_team}</span>
                </div>
              </div>

              {/* Data & ora */}
              <p style={{ color:"var(--accent)", margin:0, fontSize:"0.9rem", fontWeight:600 }}>
                {match.match_date}{match.match_time ? ` · ${match.match_time}` : ""}
              </p>

              {/* Bileta */}
              <a href={match.ticket_url || "#"} className="button tickets-btn" style={{ marginTop:"2px" }}>
                🎫 {t("home.buyTickets")}
              </a>
            </div>
          </section>
        ) : (
          /* ── Layout standard (Superliga etj.) ── */
          <section className="upcoming-match-section">
            <div className="match-header">
              <span className="competition-badge">{t("home.nextMatch")}</span>
              <img src="/assets/logos/albi-mall-superliga.d81b909e28ccd58241ed.png" alt="Albi Mall Superliga" style={{height:"60px", width:"auto", objectFit:"contain"}} />
              <span className="stadium-info" style={{color:"var(--accent)"}}>{match.stadium}</span>
            </div>
            <div className="match-container">
              <div className="team team-home">
                <img src={match.home_logo || "/assets/MalishevaLogo.png"} alt={match.home_team} />
                <h3>{match.home_team}</h3>
              </div>
              <div className="match-details">
                <p className="match-date" style={{color:"var(--accent)"}}>{match.match_date}</p>
                <p className="match-time">{match.match_time}</p>
              </div>
              <div className="team team-away">
                <img src={match.away_logo || "/assets/MalishevaLogo.png"} alt={match.away_team} />
                <h3>{match.away_team}</h3>
              </div>
            </div>
            <a href={match.ticket_url || "#"} className="button tickets-btn">
              🎫 {t("home.buyTickets")}
            </a>
          </section>
        )
      )}

      {/* Announcements */}
      <section className="announcements-section">
        <h2 className="section-title">{t("home.latestNews")}</h2>
        <div className="announcements-grid">
          {announcements.map((a) => {
            const content = locale === "en" ? (a.content_en || a.content) : a.content;
            const preview = content && content.length > 120 ? content.slice(0, 120).trimEnd() + "…" : content;
            return (
              <article key={a.id} className="announcement-card">
                <div className="announcement-header">
                  <span className="category-badge">
                    {locale === "en" ? (a.category_en || a.category) : a.category}
                  </span>
                  <span className="announcement-date">{a.date_display}</span>
                </div>
                <h3>{locale === "en" ? (a.title_en || a.title) : a.title}</h3>
                <p>{preview}</p>
                <button className="read-more" onClick={() => setSelectedAnn(a)}>
                  {t("home.readMore")}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Modal njoftim i plotë */}
      {selectedAnn && (
        <div className="ann-overlay" onClick={() => setSelectedAnn(null)}>
          <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ann-modal-head">
              <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
                <span className="category-badge">
                  {locale === "en" ? (selectedAnn.category_en || selectedAnn.category) : selectedAnn.category}
                </span>
                <span className="announcement-date">{selectedAnn.date_display}</span>
              </div>
              <button className="ann-close" onClick={() => setSelectedAnn(null)} aria-label={t("home.close")}>✕</button>
            </div>
            <h2 className="ann-modal-title">
              {locale === "en" ? (selectedAnn.title_en || selectedAnn.title) : selectedAnn.title}
            </h2>
            <p className="ann-modal-body">
              {locale === "en" ? (selectedAnn.content_en || selectedAnn.content) : selectedAnn.content}
            </p>
          </div>
        </div>
      )}

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
