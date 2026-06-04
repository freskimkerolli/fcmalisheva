import { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Gallery() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/gallery`).then((response) => setItems(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{t("gallery.eyebrow")}</p>
        <h2>{t("gallery.title")}</h2>
        <p className="section-subtitle">{t("gallery.subtitle")}</p>
      </section>

      <section className="gallery-grid">
        {items.map((item, index) => (
          <div key={index} className="gallery-card">
            <img src={item} alt={`${t("gallery.eyebrow")} ${index + 1}`} />
          </div>
        ))}
      </section>
    </>
  );
}
