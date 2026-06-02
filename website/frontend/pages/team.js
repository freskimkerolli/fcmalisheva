import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Team() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/team`).then((response) => setPlayers(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Ekipi</p>
        <h2>Rosteri i FC Malisheva</h2>
        <p className="section-subtitle">
          Shiko lojtarët tanë kryesorë dhe të dhënat individuale të ekipit. Një
          përbërje konkurruese që synon lart në Superligë dhe Conference League.
        </p>
      </section>

      <section className="section-panels">
        <div className="panel-card">
          <h3>Skuadra aktive</h3>
          <p>{players.length} lojtarë të regjistruar për sezonin aktual.</p>
        </div>
        <div className="panel-card">
          <h3>Garë</h3>
          <p>Superliga e Kosovës dhe Conference League.</p>
        </div>
      </section>

      <section className="cards-grid">
        {players.map((player) => (
          <article key={player.id} className="card">
            <img src={player.photo} alt={player.name} />
            <div className="card-body">
              <h3>{player.name}</h3>
              <p className="section-subtitle">
                {player.position} | Nr. {player.number}
              </p>
              <p>{player.nationality}</p>
              <p>
                {player.height} / {player.weight}
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
