import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useTranslation } from "../hooks/useTranslation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
const BACKEND = API_URL.replace(/\/api$/, "");

function resolvePhoto(photo) {
  if (!photo) return "";
  if (photo.startsWith("http")) return photo;
  return `${BACKEND}${photo}`;
}

export default function Shop() {
  const router = useRouter();
  const { t } = useTranslation();
  const [playerPhotos, setPlayerPhotos] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/team`).then((r) => {
      const map = {};
      r.data.forEach((p) => { map[p.name] = p.photo; });
      setPlayerPhotos(map);
    }).catch(() => {});
  }, []);

  const players = [
    { name: "Arlind Veliu",         number: 2  },
    { name: "Omer Bajraktari",       number: 3  },
    { name: "Dreni Kryeziu",         number: 5  },
    { name: "Besnik Ferati",         number: 6  },
    { name: "Altin Aliu",            number: 7  },
    { name: "Krenar Dulaj",          number: 9  },
    { name: "Etnik Brruti",          number: 10 },
    { name: "Rilind Hetemi",         number: 11 },
    { name: "Flamur Gashi",          number: 12 },
    { name: "Laurent Xhylani",       number: 14 },
    { name: "Valmir Nafiu",          number: 18 },
    { name: "Emir Zogaj",            number: 19 },
    { name: "Arbër Pira",            number: 20 },
    { name: "Arber Shala",           number: 21 },
    { name: "Mevlan Zeka",           number: 23 },
    { name: "Assane Diatta",         number: 24 },
    { name: "Riad Jashari",          number: 25 },
    { name: "Andreas Skovgaard",     number: 27 },
    { name: "Robert Mathieu Ndjigi", number: 28 },
    { name: "Donart Vitija",         number: 30 },
    { name: "Tiago Gomes",           number: 31 },
    { name: "Agon Xhaka",            number: 34 },
    { name: "Samuel Opeh",           number: 44 },
    { name: "Ilir Avdyli",           number: 91 },
    { name: "Dzemal Ibishi",         number: 99 },
  ];

  const jerseys = [
    { type: t("shop.home"),  subtitle: t("shop.homeJersey"), price: 15, image: "/assets/Malisheva5.jpg", description: t("shop.homeDesc") },
    { type: t("shop.away"),  subtitle: t("shop.awayJersey"), price: 10, image: "/assets/Malisheva5.jpg", description: t("shop.awayDesc") },
    { type: t("shop.third"), subtitle: t("shop.thirdJersey"), price: 8, image: "/assets/Malisheva5.jpg", description: t("shop.thirdDesc") },
  ];

  const [orders, setOrders] = useState({
    0: { playerOrCustom: "custom", customName: "", price: 15 },
    1: { playerOrCustom: "custom", customName: "", price: 10 },
    2: { playerOrCustom: "custom", customName: "", price: 8 },
  });

  const updateOrder = (index, field, value) => {
    setOrders({
      ...orders,
      [index]: { ...orders[index], [field]: value },
    });
  };

  const submitOrder = (index) => {
    const order = orders[index];
    const jersey = jerseys[index];
    let displayName = "";

    if (order.playerOrCustom === "custom") {
      displayName = order.customName || "Pa emër";
    } else {
      const selected = players.find((p) => p.name === order.playerOrCustom);
      displayName = selected
        ? `${selected.name} #${selected.number}`
        : "Pa emër";
    }

    // Ruaj porosinë në localStorage
    const orderData = {
      jerseyType: jersey.type,
      jerseyPrice: jersey.price,
      playerName: displayName,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderData));

    // Ridirekto në checkout
    router.push("/checkout");
  };

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">{t("shop.eyebrow")}</p>
        <h2>{t("shop.title")}</h2>
        <p className="section-subtitle">{t("shop.subtitle")}</p>
      </section>

      <div className="jerseys-grid">
        {jerseys.map((jersey, index) => (
          <div key={index} className="jersey-section">
            <div className="jersey-header">
              <h3>{jersey.type}</h3>
              <p className="jersey-subtitle">{jersey.subtitle}</p>
              <p className="jersey-price">{jersey.price}€</p>
            </div>

            <div className="jersey-image">
              {(() => {
                const sel = orders[index].playerOrCustom;
                const photo = sel !== "custom" ? playerPhotos[sel] : null;
                const hasPhoto = photo && !photo.includes("placeholder");
                return hasPhoto ? (
                  <img
                    src={resolvePhoto(photo)}
                    alt={sel}
                    onError={(e) => { e.target.src = jersey.image; }}
                  />
                ) : (
                  <img src={jersey.image} alt={jersey.type} />
                );
              })()}
              <p className="image-caption">{jersey.description}</p>
            </div>

            <div className="jersey-options">
              <label className="option-label">
                <span className="label-text">{t("shop.nameLabel")}</span>
                <select
                  value={orders[index].playerOrCustom}
                  onChange={(e) =>
                    updateOrder(index, "playerOrCustom", e.target.value)
                  }
                  className="jersey-select"
                >
                  <option value="custom">{t("shop.customOption")}</option>
                  <optgroup label={t("shop.playersGroup")}>
                    {players.map((player) => (
                      <option key={player.number} value={player.name}>
                        #{player.number} {player.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              {orders[index].playerOrCustom === "custom" && (
                <label className="option-label">
                  <span className="label-text">{t("shop.customLabel")}</span>
                  <input
                    type="text"
                    value={orders[index].customName}
                    onChange={(e) =>
                      updateOrder(index, "customName", e.target.value)
                    }
                    placeholder={t("shop.customPlaceholder")}
                    className="jersey-input"
                  />
                </label>
              )}

              <button
                onClick={() => submitOrder(index)}
                className="button order-button"
              >
                {t("shop.orderBtn")} {jersey.type}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
