import { useState } from "react";
import { useRouter } from "next/router";

export default function Shop() {
  const router = useRouter();
  const players = [
    { name: "Albin Rama", number: 1 },
    { name: "Driton Krasniqi", number: 2 },
    { name: "Besim Salihu", number: 3 },
    { name: "Artan Gruda", number: 4 },
    { name: "Luan Berisha", number: 5 },
    { name: "Edon Hashani", number: 7 },
    { name: "Florent Hasani", number: 9 },
    { name: "Arber Zeneli", number: 10 },
  ];

  const jerseys = [
    {
      type: "Fanella vendas",
      subtitle: "Home Jersey",
      price: 15,
      image: "/assets/Malisheva5.jpg",
      description: "Fanella zyrtare e ekipit për ndeshje në shtëpi.",
    },
    {
      type: "Fanella mysafir",
      subtitle: "Away Jersey",
      price: 10,
      image: "/assets/Malisheva5.jpg",
      description: "Fanella për ndeshje larg stadiumi.",
    },
    {
      type: "Fanella e trete",
      subtitle: "Third Jersey",
      price: 8,
      image: "/assets/Malisheva5.jpg",
      description: "Fanella alternative e sezonit.",
    },
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
        <p className="eyebrow">Shop</p>
        <h2>Dyqani zyrtar i FC Malisheva</h2>
        <p className="section-subtitle">
          Zgjidh fanellën e ekipit dhe personalizo me emrin e lojtarit ose me
          emrin tënd të personalizuar.
        </p>
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
              <img src={jersey.image} alt={jersey.type} />
              <p className="image-caption">{jersey.description}</p>
            </div>

            <div className="jersey-options">
              <label className="option-label">
                <span className="label-text">Emri / Lojtari:</span>
                <select
                  value={orders[index].playerOrCustom}
                  onChange={(e) =>
                    updateOrder(index, "playerOrCustom", e.target.value)
                  }
                  className="jersey-select"
                >
                  <option value="custom">Emër i personalizuar</option>
                  <optgroup label="Lojtarët e ekipit">
                    {players.map((player) => (
                      <option key={player.number} value={player.name}>
                        {player.name} #{player.number}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>

              {orders[index].playerOrCustom === "custom" && (
                <label className="option-label">
                  <span className="label-text">Emri juaj (opsionale):</span>
                  <input
                    type="text"
                    value={orders[index].customName}
                    onChange={(e) =>
                      updateOrder(index, "customName", e.target.value)
                    }
                    placeholder="Shkruani emrin tuaj"
                    className="jersey-input"
                  />
                </label>
              )}

              <button
                onClick={() => submitOrder(index)}
                className="button order-button"
              >
                Porosit {jersey.type}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
