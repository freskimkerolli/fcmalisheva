import { useEffect, useState } from "react";
import axios from "axios";

import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const LOGOS = {
  "FC Malisheva":   "/assets/logos/Malisheva.png",
  "Drita":          "/assets/logos/dritafc.png",
  "Ballkani":       "/assets/logos/FCBallkani.png",
  "Gjilani":        "/assets/logos/1755278076133_SC_Gjilani_logo.png",
  "Prishtina":      "/assets/logos/FCPrishtina.png",
  "Drenica":        "/assets/logos/FCDrenica.jpeg",
  "Ferizaj":        "/assets/logos/FCFerizaji.png",
  "Dukagjini":      "/assets/logos/KfDukagjini.png",
  "Llapi":          "/assets/logos/KfLlapi.png",
  "Prishtina e Re": "/assets/logos/1755278204474_PRISHTINA_E_RE.png",
};

function TeamBadge({ name, label }) {
  const logo = LOGOS[name];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", minWidth: "80px" }}>
      {logo ? (
        <img
          src={logo}
          alt={name}
          style={{ width: "48px", height: "48px", objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      ) : (
        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280" }}>
          {name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <span style={{ fontSize: "0.82rem", fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{name}</span>
      <span style={{ fontSize: "0.68rem", color: "#9ca3af" }}>{label}</span>
    </div>
  );
}

function getResult(score, isHome) {
  if (!score) return null;
  const [a, b] = score.split("-").map(Number);
  const mal = isHome !== false ? a : b;
  const opp = isHome !== false ? b : a;
  if (mal > opp) return { label: "F", color: "#16a34a", bg: "#dcfce7" };
  if (mal === opp) return { label: "B", color: "#d97706", bg: "#fef3c7" };
  return { label: "H", color: "#dc2626", bg: "#fee2e2" };
}

export default function Results() {
  const { t } = useTranslation();
  const [data, setData] = useState({ matches: [], table: [] });

  useEffect(() => {
    axios.get(`${API_URL}/results`).then((r) => setData({
      matches: (r.data.matches || []).slice(0, 5),
      table: r.data.table || [],
    }));
  }, []);

  return (
    <>
      <section style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
        <img
          src="/assets/logos/albi-mall-superliga.d81b909e28ccd58241ed.png"
          alt="Albi Mall Superliga"
          style={{ maxHeight: "90px", maxWidth: "100%", objectFit: "contain" }}
        />
      </section>

      <div className="results-layout">

        {/* ── E majta: 5 ndeshjet e fundit ── */}
        <div>
          <h3 style={styles.sectionTitle}>{t("results.latestMatches")}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.matches.map((m) => {
              const res = getResult(m.score, m.isHome);
              const [gf, ga] = (m.score || "").split("-").map(Number);
              return (
                <div key={m.id} style={styles.matchCard}>
                  <div style={styles.matchTop}>
                    <span style={styles.matchday}>{m.matchday}</span>
                    <span style={styles.matchDate}>{m.date}</span>
                  </div>
                  <div style={styles.matchBody}>
                    <TeamBadge
                      name={m.isHome ? "FC Malisheva" : m.opponent}
                      label={t("results.home")}
                    />

                    <div style={styles.scoreBlock}>
                      <span style={styles.score}>
                        {`${gf} - ${ga}`}
                      </span>
                      {res && (
                        <span style={{ ...styles.badge, color: res.color, background: res.bg }}>
                          {res.label === "F" ? t("results.win") : res.label === "B" ? t("results.draw") : t("results.loss")}
                        </span>
                      )}
                    </div>

                    <TeamBadge
                      name={m.isHome ? m.opponent : "FC Malisheva"}
                      label={t("results.away")}
                    />
                  </div>
                  <div style={styles.competition}>{m.competition}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── E djathta: Tabela ── */}
        <div>
          <h3 style={styles.sectionTitle}>{t("results.tableTitle")}</h3>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={{ ...styles.th, textAlign: "left" }}>{t("results.col.team")}</th>
                  <th style={styles.th}>{t("results.col.played")}</th>
                  <th style={styles.th}>{t("results.col.gd")}</th>
                  <th style={styles.th}>{t("results.col.points")}</th>
                </tr>
              </thead>
              <tbody>
                {data.table.map((row) => {
                  const isMalisheva = row.team === "FC Malisheva";
                  const gdColor = row.gd > 0 ? "#16a34a" : row.gd < 0 ? "#dc2626" : "#6b7280";
                  const pos = row.position;
                  const rowBorder =
                    pos === 1             ? "3px solid #1d4ed8" :
                    pos <= 3              ? "3px solid #16a34a" :
                    pos === 8             ? "3px solid #f97316" :
                    pos >= 9              ? "3px solid #dc2626" : "none";
                  return (
                    <tr key={row.position} style={{ ...(isMalisheva ? styles.highlighted : {}), borderLeft: rowBorder }}>
                      <td style={{ ...styles.td, color: "#9ca3af", fontWeight: 500 }}>{row.position}</td>
                      <td style={{ ...styles.td, fontWeight: isMalisheva ? 700 : 500, color: isMalisheva ? "#1f4b8d" : "inherit" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {LOGOS[row.team] && (
                            <img
                              src={LOGOS[row.team]}
                              alt={row.team}
                              style={{ width: "26px", height: "26px", objectFit: "contain", flexShrink: 0 }}
                              onError={(e) => { e.target.style.display = "none"; }}
                            />
                          )}
                          <span>{row.team}</span>
                        </div>
                      </td>
                      <td style={{ ...styles.td, textAlign: "center", color: "#6b7280" }}>{row.played}</td>
                      <td style={{ ...styles.td, textAlign: "center", color: gdColor, fontWeight: 600 }}>
                        {row.gd > 0 ? `+${row.gd}` : row.gd}
                      </td>
                      <td style={{ ...styles.td, textAlign: "center", fontWeight: 700 }}>{row.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legjenda */}
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", padding: "12px 16px", borderTop: "1px solid #f3f4f6", fontSize: "0.78rem", color: "#6b7280" }}>
            {[
              { color: "#1d4ed8", label: t("results.legend.champions") },
              { color: "#16a34a", label: t("results.legend.conference") },
              { color: "#f97316", label: t("results.legend.playoff") },
              { color: "#dc2626", label: t("results.legend.relegation") },
            ].map((item) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

const styles = {
  sectionTitle: {
    fontSize: "0.78rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#1f4b8d",
    marginBottom: "14px",
    paddingBottom: "8px",
    borderBottom: "2px solid #e5e7eb",
  },
  matchCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  matchTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matchday: {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#1f4b8d",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  matchDate: {
    fontSize: "0.75rem",
    color: "#9ca3af",
  },
  matchBody: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "12px",
  },
  teamBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  teamName: {
    fontWeight: 700,
    fontSize: "0.9rem",
  },
  teamTag: {
    fontSize: "0.72rem",
  },
  scoreBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  },
  score: {
    fontSize: "1.4rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  badge: {
    fontSize: "0.68rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "999px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  competition: {
    fontSize: "0.72rem",
    color: "#9ca3af",
    borderTop: "1px solid #f3f4f6",
    paddingTop: "8px",
  },
  tableCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "0.88rem",
    minWidth: "340px",
  },
  th: {
    padding: "10px 14px",
    textAlign: "center",
    background: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#6b7280",
  },
  td: {
    padding: "11px 14px",
    borderBottom: "1px solid #f3f4f6",
  },
  highlighted: {
    background: "#eff6ff",
  },
  youBadge: {
    marginLeft: "8px",
    fontSize: "0.6rem",
    fontWeight: 700,
    background: "#1f4b8d",
    color: "#fff",
    padding: "1px 6px",
    borderRadius: "999px",
    verticalAlign: "middle",
  },
};
