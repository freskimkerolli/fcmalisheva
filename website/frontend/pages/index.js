import Link from "next/link";
import { useTranslation } from "../hooks/useTranslation";

export default function Home() {
  const { t } = useTranslation();

  const announcements = [
    { id: 1, ...t("home.announcements.a1") },
    { id: 2, ...t("home.announcements.a2") },
    { id: 3, ...t("home.announcements.a3") },
  ];

  return (
    <>
      <section className="upcoming-match-section">
        <div className="match-header">
          <span className="competition-badge">
            {t("home.competition")} - {t("home.matchday")}
          </span>
          <span className="stadium-info">{t("home.stadium")}</span>
        </div>
        <div className="match-container">
          <div className="team team-home">
            <img src="/assets/MalishevaLogo.png" alt={t("home.homeTeam")} />
            <h3>{t("home.homeTeam")}</h3>
          </div>
          <div className="match-details">
            <p className="match-date">{t("home.date")}</p>
            <p className="match-time">{t("home.time")}</p>
          </div>
          <div className="team team-away">
            <img src="/assets/MalishevaLogo.png" alt={t("home.awayTeam")} />
            <h3>{t("home.awayTeam")}</h3>
          </div>
        </div>
        <Link href="/" className="button tickets-btn">
          🎫 {t("home.buyTickets")}
        </Link>
      </section>

      <section className="announcements-section">
        <h2 className="section-title">{t("home.latestNews")}</h2>
        <div className="announcements-grid">
          {announcements.map((a) => (
            <article key={a.id} className="announcement-card">
              <div className="announcement-header">
                <span className="category-badge">{a.category}</span>
                <span className="announcement-date">{a.date}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              <a href="#" className="read-more">{t("home.readMore")}</a>
            </article>
          ))}
        </div>
      </section>

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
