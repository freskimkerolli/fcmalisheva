import { useEffect, useState } from "react";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Footer() {
  const { t } = useTranslation();
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/sponsors`)
      .then((r) => r.json())
      .then((data) => setSponsors(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Left: Club Logo */}
        <div className="footer-section footer-left">
          <img
            src="/assets/MalishevaLogo.png"
            alt="FC Malisheva"
            className="footer-logo"
          />
        </div>

        {/* Center: Copyright & Sponsors */}
        <div className="footer-section footer-center">
          <div className="footer-copyright">
            <p>{t("footer.rights")}</p>
            <p className="footer-contact">{t("footer.contact")}</p>
          </div>
          <div className="footer-sponsors">
            <p className="sponsors-label">{t("footer.partners")}</p>
            <div className="sponsors-grid">
              {sponsors.map((sponsor) => (
                <a
                  key={sponsor.id}
                  href={sponsor.website_url || "#"}
                  target={sponsor.website_url && sponsor.website_url !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  className="sponsor-link"
                  title={sponsor.name}
                  style={{ width: "70px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff" }}
                >
                  <img
                    src={sponsor.logo_path}
                    alt={sponsor.name}
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Social Links */}
        <div className="footer-section footer-right">
          <div className="social-links">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              title="Facebook"
              style={{background:"#1877F2", border:"none", color:"#fff"}}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              title="Instagram"
              style={{background:"radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)", border:"none", color:"#fff"}}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
