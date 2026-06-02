import Link from "next/link";

export default function Home() {
  const announcements = [
    {
      id: 1,
      title: "Fitorja e madhe ndaj Prishtinës",
      date: "1 qershor 2026",
      content:
        "FC Malisheva fitoi me rezultatin 3-1 ndaj Prishtinës në ndeshjen e fundit.",
      category: "Ndeshje",
    },
    {
      id: 2,
      title: "Lojtari i javës: Albin Rama",
      date: "31 maj 2026",
      content:
        "Albin Rama u emërua lojtari i javës pas performancës së tij të jashtëzakonshme.",
      category: "Tima",
    },
    {
      id: 3,
      title: "Përgatitje për ndeshjen e Conference League",
      date: "30 maj 2026",
      content:
        "Ekipi përgatitet për ndeshjen e rëndësishme të Conference League këtë javë.",
      category: "Kampionat",
    },
  ];

  const upcomingMatch = {
    competition: "Superliga",
    matchday: "Dita 8",
    stadium: "Stadiumi Zahir Pajazitaj",
    homeTeam: "FC Malisheva",
    awayTeam: "Drita Gjilanë",
    date: "5 qershor 2026",
    time: "19:00",
    homeImage: "/assets/MalishevaLogo.png",
    awayImage: "/assets/MalishevaLogo.png",
  };

  return (
    <>
      {/* Upcoming Match Section */}
      <section className="upcoming-match-section">
        <div className="match-header">
          <span className="competition-badge">
            {upcomingMatch.competition} - {upcomingMatch.matchday}
          </span>
          <span className="stadium-info">{upcomingMatch.stadium}</span>
        </div>
        <div className="match-container">
          <div className="team team-home">
            <img src={upcomingMatch.homeImage} alt={upcomingMatch.homeTeam} />
            <h3>{upcomingMatch.homeTeam}</h3>
          </div>
          <div className="match-details">
            <p className="match-date">{upcomingMatch.date}</p>
            <p className="match-time">{upcomingMatch.time}</p>
          </div>
          <div className="team team-away">
            <img src={upcomingMatch.awayImage} alt={upcomingMatch.awayTeam} />
            <h3>{upcomingMatch.awayTeam}</h3>
          </div>
        </div>
        <Link href="/" className="button tickets-btn">
          🎫 Bli Bileta
        </Link>
      </section>

      {/* Announcements Section */}
      <section className="announcements-section">
        <h2 className="section-title">Njoftime të Fundit</h2>
        <div className="announcements-grid">
          {announcements.map((announcement) => (
            <article key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <span className="category-badge">{announcement.category}</span>
                <span className="announcement-date">{announcement.date}</span>
              </div>
              <h3>{announcement.title}</h3>
              <p>{announcement.content}</p>
              <a href="#" className="read-more">
                Lexo më shumë →
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links-section">
        <div className="quick-links-grid">
          <Link href="/team" className="quick-link-card">
            <h3>👥 Ekipi</h3>
            <p>Shiko lojtarët dhe stafiun</p>
          </Link>
          <Link href="/staff" className="quick-link-card">
            <h3>🏆 Stafi</h3>
            <p>Menaxheri dhe stafi teknik</p>
          </Link>
          <Link href="/gallery" className="quick-link-card">
            <h3>📸 Galeria</h3>
            <p>Fotot nga ndeshjeve</p>
          </Link>
          <Link href="/shop" className="quick-link-card">
            <h3>🛍️ Shop</h3>
            <p>Fanella dhe produkte</p>
          </Link>
        </div>
      </section>
    </>
  );
}
