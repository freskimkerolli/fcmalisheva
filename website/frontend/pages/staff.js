import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const BACKEND = API_URL.replace(/\/api$/, "");

function resolvePhoto(photo) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  return `${BACKEND}${photo}`;
}

export default function Staff() {
  const { t } = useTranslation();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/staff`).then((response) => setStaff(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{t("staff.eyebrow")}</p>
        <h2>{t("staff.title")}</h2>
        <p className="section-subtitle">{t("staff.subtitle")}</p>
      </section>

      <section className="cards-grid">
        {staff.map((member) => (
          <article key={member.id} className="card">
            <img
              src={resolvePhoto(member.photo)}
              alt={member.name}
              style={{ width: "100%", height: "280px", objectFit: "cover", objectPosition: "top", borderRadius: "12px" }}
            />
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
