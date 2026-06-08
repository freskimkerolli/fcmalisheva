import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("payment-method");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!router.isReady) return;

    const { success, canceled } = router.query;

    if (success === "true") {
      localStorage.removeItem("currentOrder");
      setStep("confirmation");
      return;
    }

    if (canceled === "true") {
      setMessage("Pagesa u anulua. Mund të provosh përsëri.");
      router.replace("/checkout", undefined, { shallow: true });
    }

    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else if (success !== "true") {
      router.push("/shop");
    }
  }, [router.isReady, router.query]);

  const handleCustomerChange = (field, value) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  const goToCustomerInfo = () => {
    setMessage("");
    setStep("customer-info");
  };

  const goToReview = () => {
    if (
      !customerData.firstName ||
      !customerData.lastName ||
      !customerData.address ||
      !customerData.city ||
      !customerData.phone
    ) {
      setMessage("Plotëso të gjitha fushat e kërkuara");
      return;
    }
    setMessage("");
    setStep("review");
  };

  const confirmOrder = async () => {
    if (paymentMethod === "card") {
      setLoading(true);
      setMessage("");
      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jerseyType: order.jerseyType,
            jerseyPrice: order.jerseyPrice,
            playerName: order.playerName,
            customerName: `${customerData.firstName} ${customerData.lastName}`,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gabim");
        window.location.href = data.url;
      } catch (err) {
        setMessage(`Gabim: ${err.message}`);
        setLoading(false);
      }
      return;
    }

    // Cash on delivery
    setStep("confirmation");
    localStorage.removeItem("currentOrder");
  };

  if (step === "confirmation") {
    return (
      <>
        <section className="page-header">
          <p className="eyebrow">Checkout</p>
          <h2>Përfundo porosinë tuaj</h2>
        </section>
        <div className="checkout-container">
          <div className="checkout-content">
            <div className="checkout-step confirmation">
              <div className="confirmation-icon">✓</div>
              <h3>Porosia u Konfirmua!</h3>
              <p>Faleminderit për porosinë tuaj. Do t'ju kontaktojmë shumë shpejt.</p>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "16px" }}>
                Po ridrejtohesh në dyqan...
              </p>
            </div>
          </div>
        </div>
        {setTimeout(() => router.push("/shop"), 4000) && null}
      </>
    );
  }

  if (!order) {
    return <div className="page-container">Po ngarkohet...</div>;
  }

  return (
    <>
      <section className="page-header">
        <p className="eyebrow">Checkout</p>
        <h2>Përfundo porosinë tuaj</h2>
      </section>

      {message && <div className="checkout-message">{message}</div>}

      <div className="checkout-container">
        {/* Progress */}
        <div className="progress-bar">
          {[
            { key: "payment-method", label: "Metoda", n: 1 },
            { key: "customer-info", label: "Të dhënat", n: 2 },
            { key: "review", label: "Përmbledhja", n: 3 },
          ].map(({ key, label, n }, i, arr) => {
            const steps = arr.map((s) => s.key);
            const currentIdx = steps.indexOf(step);
            const thisIdx = i;
            const isActive = step === key;
            const isCompleted = currentIdx > thisIdx;
            return (
              <div key={key} className={`step ${isActive ? "active" : isCompleted ? "completed" : ""}`}>
                <span>{n}</span>
                <p>{label}</p>
              </div>
            );
          })}
        </div>

        <div className="checkout-content">
          {/* Step 1: Payment Method */}
          {step === "payment-method" && (
            <div className="checkout-step">
              <h3>Zgjidh metodën e pagesës</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-title">💵 Pagesa në Dorëzim (Cash)</span>
                    <p>Paguaj kur të marrësh porosinë</p>
                  </div>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="option-content">
                    <span className="option-title">💳 Kartë Krediti / Debiti</span>
                    <p>Pagesa e sigurt online me Stripe — Visa, Mastercard etj.</p>
                  </div>
                </label>
              </div>

              <button onClick={goToCustomerInfo} className="button" style={{ marginTop: "24px" }}>
                Vazhdo →
              </button>
            </div>
          )}

          {/* Step 2: Customer Info */}
          {step === "customer-info" && (
            <div className="checkout-step">
              <h3>Të dhënat e dorëzimit</h3>
              <form className="checkout-form">
                <div className="form-row">
                  <label>
                    <span>Emri *</span>
                    <input
                      type="text"
                      value={customerData.firstName}
                      onChange={(e) => handleCustomerChange("firstName", e.target.value)}
                      placeholder="Emri juaj"
                    />
                  </label>
                  <label>
                    <span>Mbiemri *</span>
                    <input
                      type="text"
                      value={customerData.lastName}
                      onChange={(e) => handleCustomerChange("lastName", e.target.value)}
                      placeholder="Mbiemri juaj"
                    />
                  </label>
                </div>

                <label>
                  <span>Adresa *</span>
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) => handleCustomerChange("address", e.target.value)}
                    placeholder="Rruga, numri i shtëpisë"
                  />
                </label>

                <div className="form-row">
                  <label>
                    <span>Qyteti *</span>
                    <input
                      type="text"
                      value={customerData.city}
                      onChange={(e) => handleCustomerChange("city", e.target.value)}
                      placeholder="Qyteti"
                    />
                  </label>
                  <label>
                    <span>Numri i telefonit *</span>
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) => handleCustomerChange("phone", e.target.value)}
                      placeholder="+383 XX XXX XXX"
                    />
                  </label>
                </div>

                {paymentMethod === "card" && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "14px 16px",
                      background: "rgba(15,116,255,0.06)",
                      border: "1px solid rgba(15,116,255,0.2)",
                      borderRadius: "12px",
                      fontSize: "0.88rem",
                      color: "var(--primary)",
                    }}
                  >
                    💳 Të dhënat e kartës do të futet te faqja e sigurt e <strong>Stripe</strong> në hapin tjetër.
                  </div>
                )}
              </form>

              <div className="form-actions" style={{ marginTop: "24px" }}>
                <button onClick={() => setStep("payment-method")} className="button secondary">
                  ← Prapa
                </button>
                <button onClick={goToReview} className="button">
                  Vazhdo →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === "review" && (
            <div className="checkout-step">
              <h3>Përmbledhja e porosisë</h3>

              <div className="review-section">
                <h4>Artikulli</h4>
                <div className="review-item">
                  <div>
                    <p className="review-label">{order.jerseyType}</p>
                    <p className="review-subtext">{order.playerName}</p>
                  </div>
                  <p className="review-price">{order.jerseyPrice}€</p>
                </div>
              </div>

              <div className="review-section">
                <h4>Dorëzimi</h4>
                <div className="review-address">
                  <p>{customerData.firstName} {customerData.lastName}</p>
                  <p>{customerData.address}</p>
                  <p>{customerData.city}</p>
                  <p>{customerData.phone}</p>
                </div>
                <button onClick={() => setStep("customer-info")} className="button secondary" style={{ marginTop: "12px" }}>
                  Ndrysho →
                </button>
              </div>

              <div className="review-section">
                <h4>Metoda e pagesës</h4>
                <p>{paymentMethod === "cash" ? "💵 Pagesa në Dorëzim" : "💳 Kartë Krediti / Debiti (Stripe)"}</p>
              </div>

              <div className="review-total">
                <h3>Total: {order.jerseyPrice}€</h3>
              </div>

              <div className="form-actions" style={{ marginTop: "24px" }}>
                <button onClick={() => setStep("customer-info")} className="button secondary">
                  ← Prapa
                </button>
                <button onClick={confirmOrder} className="button" disabled={loading}>
                  {loading ? "Po ridrejton te Stripe..." : paymentMethod === "card" ? "💳 Paguaj me Stripe" : "Konfirmo Porosinë ✓"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
