export default function Footer() {
  const sponsors = [
    { name: "Sponsor 1", logo: "/assets/MalishevaLogo.png" },
    { name: "Sponsor 2", logo: "/assets/MalishevaLogo.png" },
    { name: "Sponsor 3", logo: "/assets/MalishevaLogo.png" },
  ];

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
            <p>© 2026 FC Malisheva. Të gjitha të drejtat e rezervuara.</p>
            <p className="footer-contact">Kontakt: info@fcmalisheva.com</p>
          </div>
          <div className="footer-sponsors">
            <p className="sponsors-label">Partnerët Zyrtar:</p>
            <div className="sponsors-grid">
              {sponsors.map((sponsor, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="sponsor-link"
                  title={sponsor.name}
                >
                  <img src={sponsor.logo} alt={sponsor.name} />
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
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="social-icon"
              title="Instagram"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.588.227-.9.45-1.084.636-.363.365-.594.87-.722 1.5-.06.3-.12.63-.159 1.05-.039.417-.045.541-.045 1.594s.006 1.177.041 1.594c.039.42.098.75.159 1.05.128.63.36 1.135.722 1.5.184.186.496.41 1.084.636.788.267 1.658.468 2.936.528 1.28.057 1.687.072 4.947.072s3.667-.015 4.947-.072c1.278-.06 2.148-.261 2.936-.528.588-.227.9-.45 1.084-.636.363-.365.594-.87.722-1.5.06-.3.12-.63.159-1.05.039-.417.045-.541.045-1.594s-.006-1.177-.041-1.594c-.039-.42-.098-.75-.159-1.05-.128-.63-.36-1.135-.722-1.5-.184-.186-.496-.41-1.084-.636-.788-.267-1.658-.468-2.936-.528C15.667.015 15.26 0 12 0m0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.81.24 2.228.4.56.217.96.477 1.382.896.419.42.679.822.896 1.381.16.418.346 1.057.4 2.228.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.24 1.81-.4 2.228-.217.56-.477.96-.896 1.382-.42.419-.822.679-1.381.896-.418.16-1.057.346-2.228.4-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.81-.24-2.228-.4-.56-.217-.96-.477-1.382-.896-.419-.42-.679-.822-.896-1.381-.16-.418-.346-1.057-.4-2.228-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.24-1.81.4-2.228.217-.56.477-.96.896-1.382.42-.419.822-.679 1.381-.896.418-.16 1.057-.346 2.228-.4 1.264-.061 1.646-.07 4.849-.07" />
                <circle cx="12" cy="12" r="3.333" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
