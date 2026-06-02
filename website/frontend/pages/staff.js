import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Staff() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/staff`).then((response) => setStaff(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Stafi</p>
        <h2>Stafi Teknik i FC Malisheva</h2>
        <p className="section-subtitle">
          Një ekip teknik profesional që udhëheq përgatitjet e skuadrës dhe
          mbështet strategjinë në fushë.
        </p>
      </section>

      <section className="cards-grid">
        {staff.map((member) => (
          <article key={member.id} className="card">
            <img src={member.photo} alt={member.name} />
            <div className="card-body">
              <h3>{member.name}</h3>
              <p className="section-subtitle">{member.role}</p>
              <p>{member.email}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
