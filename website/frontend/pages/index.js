import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

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
          /* ── UCL Layout ── */
          <section
            className="upcoming-match-section ucl-section"
            style={{ background:"#0a0a0a", border:"1px solid rgba(255,255,255,0.1)", position:"relative", overflow:"hidden", minHeight:"280px", padding:"24px 28px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}
          >
            {/* UCL logo — watermark qendër */}
            <img
              src="/assets/logos/UECL-Logo.png"
              alt="UECL"
              style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", height:"220px", width:"auto", objectFit:"contain", mixBlendMode:"screen", pointerEvents:"none", opacity:0.18 }}
            />

            {/* Rreshti i sipërm: info majtas · stadium djathtas */}
            <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:"3px" }}>{t("home.nextMatch")}</div>
                <div style={{ fontSize:"0.88rem", fontWeight:700, color:"#fff", textTransform:"uppercase", letterSpacing:"0.08em" }}>UEFA Conference League</div>
                {match.matchday && <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.5)", marginTop:"3px" }}>{match.matchday}</div>}
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.45)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"3px" }}>Stadium</div>
                <div style={{ fontSize:"0.82rem", fontWeight:600, color:"#fff", textTransform:"uppercase" }}>{match.stadium}</div>
              </div>
            </div>

            {/* Qendra: logot e ekipeve */}
            <div style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:"32px", padding:"16px 0" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                <img src={match.home_logo || "/assets/MalishevaLogo.png"} alt={match.home_team} style={{ width:"80px", height:"80px", objectFit:"contain" }} />
                <span style={{ color:"#fff", fontSize:"0.88rem", fontWeight:600, textAlign:"center" }}>{match.home_team}</span>
              </div>
              <span style={{ color:"rgba(255,255,255,0.35)", fontWeight:700, fontSize:"1.5rem" }}>vs</span>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
                <img src={match.away_logo || "/assets/MalishevaLogo.png"} alt={match.away_team} style={{ width:"80px", height:"80px", objectFit:"contain" }} />
                <span style={{ color:"#fff", fontSize:"0.88rem", fontWeight:600, textAlign:"center" }}>{match.away_team}</span>
              </div>
            </div>

            {/* Rreshti i poshtëm: data majtas · bileta djathtas */}
            <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <p style={{ color:"var(--accent)", margin:0, fontSize:"0.9rem", fontWeight:600 }}>
                {match.match_date}{match.match_time ? ` · ${match.match_time}` : ""}
              </p>
              <a href={match.ticket_url || "#"} className="button tickets-btn" style={{ margin:0 }}>
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
