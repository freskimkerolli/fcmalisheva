import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Results() {
  const [data, setData] = useState({ matches: [], table: [] });

  useEffect(() => {
    axios.get(`${API_URL}/results`).then((response) => setData(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Rezultatet</p>
        <h2>Performanca e FC Malisheva</h2>
        <p className="section-subtitle">
          Rezultatet e fundit të Superligës dhe tabela e renditjes e skuadrës.
          Një pasqyrë e qartë e rrugëtimit të ekipit në kampionat.
        </p>
      </section>

      <section className="results-grid">
        <div className="panel-card">
          <h3>Ndeshjet e fundit</h3>
          <p>{data.matches.length} ndeshje të shënuara në listë.</p>
        </div>
        <div className="panel-card">
          <h3>Tabela</h3>
          <p>
            Pozicioni i FC Malisheva krahasuar me ekipet e tjera të Superligës.
          </p>
        </div>
      </section>

      <div className="table-card">
        <h3>Rezultatet e fundit</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Kundërshtari</th>
                <th>Rezultati</th>
                <th>Kompeticioni</th>
                <th>Vendi</th>
              </tr>
            </thead>
            <tbody>
              {data.matches.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.opponent}</td>
                  <td>{item.score}</td>
                  <td>{item.competition}</td>
                  <td>{item.venue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-card">
        <h3>Tabela aktuale</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Ekipi</th>
                <th>Pikët</th>
                <th>Ndeshjet</th>
              </tr>
            </thead>
            <tbody>
              {data.table.map((row) => (
                <tr key={row.position}>
                  <td>{row.position}</td>
                  <td>{row.team}</td>
                  <td>{row.points}</td>
                  <td>{row.played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
