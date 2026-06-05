import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const BACKEND = API_URL.replace(/\/api$/, "");

function calcAge(birthDate) {
  if (!birthDate) return "—";
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}

const POSITION_GROUPS = {
  "Portierë":   ["Portier"],
  "Mbrojtës":   ["Qendërmbrojtës", "Mbrojtës i Majtë", "Mbrojtës i Djathtë"],
  "Mesfushorë": ["Mesfushor Mbrojtës", "Mesfushor Qendror", "Krahësor i Majtë", "Krahësor i Djathtë"],
  "Sulmues":    ["Sulmues Qendror"],
};

function resolvePhoto(photo) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  return `${BACKEND}${photo}`;
}

function PlayerPhoto({ name, photo }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  if (!photo || photo.includes("placeholder") || failed) {
    return (
      <div style={{ width: "52px", height: "52px", borderRadius: "50%", flexShrink: 0, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>
        {initials}
      </div>
    );
  }
  return (
    <img
      src={resolvePhoto(photo)}
      alt={name}
      onError={() => setFailed(true)}
      style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

export default function Team() {
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/team`).then((r) => setPlayers(r.data));
  }, []);

  const groups = Object.entries(POSITION_GROUPS).map(([label, positions]) => ({
    label,
    players: players
      .filter((p) => positions.includes(p.position))
      .sort((a, b) => a.number - b.number),
  })).filter((g) => g.players.length > 0);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{t("team.eyebrow")}</p>
        <h2>{t("team.title")}</h2>
        <p className="section-subtitle">{t("team.subtitle")}</p>
      </section>

      <section className="section-panels">
        <div className="panel-card">
          <h3>{t("team.activeSquad")}</h3>
          <p>{players.length} {t("team.activeSub")}</p>
        </div>
        <div className="panel-card">
          <h3>{t("team.competition")}</h3>
          <p>{t("team.competitionSub")}</p>
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.label} style={{ marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
            {t(`team.groups.${group.label}`)}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
            {group.players.map((p) => (
              <div key={p.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ minWidth: "40px", textAlign: "center", position: "relative" }}>
                  <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--primary)", opacity: 0.85 }}>
                    {p.number}
                  </span>
                  {p.captain && (
                    <span style={{ position: "absolute", top: "-4px", right: "-8px", background: "var(--primary)", color: "#fff", fontSize: "0.6rem", fontWeight: 800, width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      C
                    </span>
                  )}
                </div>
                <PlayerPhoto name={p.name} photo={p.photo} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: "0.97rem", marginBottom: "6px" }}>{p.name}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t("team.position")}: {p.position}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t("team.age")}: {calcAge(p.birthDate)} {t("team.years")}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{t("team.nationality")}: {p.nationality}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
