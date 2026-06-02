import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function Gallery() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/gallery`).then((response) => setItems(response.data));
  }, []);

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Galeria</p>
        <h2>Momentet më të mira të FC Malisheva</h2>
        <p className="section-subtitle">
          Shfleto fotot zyrtare të ekipit, stolit dhe tifozërisë. Këtu do të
          gjeni ndjesinë e stadiumit dhe historinë vizuale të klubit.
        </p>
      </section>

      <section className="gallery-grid">
        {items.map((item, index) => (
          <div key={index} className="gallery-card">
            <img src={item} alt={`Galeria ${index + 1}`} />
          </div>
        ))}
      </section>
    </>
  );
}
