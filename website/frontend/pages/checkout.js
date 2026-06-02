import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Checkout() {
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [step, setStep] = useState("payment-method"); // payment-method, customer-info, review, confirmation
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const [message, setMessage] = useState("");

  // Lexo porosinë nga localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      router.push("/shop");
    }
  }, [router]);

  const handleCustomerChange = (field, value) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  const handleCardChange = (field, value) => {
    setCardData({ ...cardData, [field]: value });
  };

  const goToCustomerInfo = () => {
    if (!paymentMethod) {
      setMessage("Zgjidh metodën e pagesës");
      return;
    }
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
      setMessage("Ploteso të gjitha fushat e kërkuara");
      return;
    }

    if (paymentMethod === "card") {
      if (
        !cardData.cardNumber ||
        !cardData.cardHolder ||
        !cardData.expiryDate ||
        !cardData.cvv
      ) {
        setMessage("Ploteso të gjitha të dhënat e kartës");
        return;
      }
    }

    setMessage("");
    setStep("review");
  };

  const confirmOrder = () => {
    setStep("confirmation");
    setMessage(
      `✅ Porosia u regjistrua me sukses! Shënim i veçantë: Shtrim i Stripe do të shtuar në të ardhmen.`,
    );

    // Pastro localStorage
    setTimeout(() => {
      localStorage.removeItem("currentOrder");
      setTimeout(() => {
        router.push("/shop");
      }, 3000);
    }, 4000);
  };

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
        {/* Progress Indicator */}
        <div className="progress-bar">
          <div
            className={`step ${step === "payment-method" ? "active" : step === "customer-info" || step === "review" || step === "confirmation" ? "completed" : ""}`}
          >
            <span>1</span>
            <p>Metoda</p>
          </div>
          <div
            className={`step ${step === "customer-info" ? "active" : step === "review" || step === "confirmation" ? "completed" : ""}`}
          >
            <span>2</span>
            <p>Të dhënat</p>
          </div>
          <div
            className={`step ${step === "review" ? "active" : step === "confirmation" ? "completed" : ""}`}
          >
            <span>3</span>
            <p>Përmbledhja</p>
          </div>
          <div className={`step ${step === "confirmation" ? "active" : ""}`}>
            <span>4</span>
            <p>Konfirmo</p>
          </div>
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
                    <span className="option-title">
                      💵 Pagesa në Dorëzim (Cash)
                    </span>
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
                    <span className="option-title">💳 Kreditë Kartë</span>
                    <p>Pagesa online me kartë</p>
                  </div>
                </label>
              </div>

              <button
                onClick={goToCustomerInfo}
                className="button"
                style={{ marginTop: "24px" }}
              >
                Vazhdo →
              </button>
            </div>
          )}

          {/* Step 2: Customer Information */}
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
                      onChange={(e) =>
                        handleCustomerChange("firstName", e.target.value)
                      }
                      placeholder="Emri juaj"
                    />
                  </label>
                  <label>
                    <span>Mbiemri *</span>
                    <input
                      type="text"
                      value={customerData.lastName}
                      onChange={(e) =>
                        handleCustomerChange("lastName", e.target.value)
                      }
                      placeholder="Mbiemri juaj"
                    />
                  </label>
                </div>

                <label>
                  <span>Adresa *</span>
                  <input
                    type="text"
                    value={customerData.address}
                    onChange={(e) =>
                      handleCustomerChange("address", e.target.value)
                    }
                    placeholder="Rruga, numri i shtëpisë"
                  />
                </label>

                <div className="form-row">
                  <label>
                    <span>Qyteti *</span>
                    <input
                      type="text"
                      value={customerData.city}
                      onChange={(e) =>
                        handleCustomerChange("city", e.target.value)
                      }
                      placeholder="Qyteti"
                    />
                  </label>
                  <label>
                    <span>Numri i telefonit *</span>
                    <input
                      type="tel"
                      value={customerData.phone}
                      onChange={(e) =>
                        handleCustomerChange("phone", e.target.value)
                      }
                      placeholder="+383 XX XXX XXX"
                    />
                  </label>
                </div>

                {/* Card Information (if payment method is card) */}
                {paymentMethod === "card" && (
                  <>
                    <h4 style={{ marginTop: "24px", marginBottom: "16px" }}>
                      Të dhënat e kartës
                    </h4>

                    <label>
                      <span>Numri i kartës *</span>
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) =>
                          handleCardChange(
                            "cardNumber",
                            e.target.value.replace(/\s/g, "").slice(0, 16),
                          )
                        }
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                      />
                    </label>

                    <label>
                      <span>Emri në kartë *</span>
                      <input
                        type="text"
                        value={cardData.cardHolder}
                        onChange={(e) =>
                          handleCardChange(
                            "cardHolder",
                            e.target.value.toUpperCase(),
                          )
                        }
                        placeholder="EMRI MBIEMRI"
                      />
                    </label>

                    <div className="form-row">
                      <label>
                        <span>Skadimi (MM/YY) *</span>
                        <input
                          type="text"
                          value={cardData.expiryDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, "");
                            if (value.length >= 2) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            handleCardChange("expiryDate", value);
                          }}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </label>
                      <label>
                        <span>CVV *</span>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) =>
                            handleCardChange(
                              "cvv",
                              e.target.value.replace(/\D/g, "").slice(0, 3),
                            )
                          }
                          placeholder="123"
                          maxLength="3"
                        />
                      </label>
                    </div>
                  </>
                )}
              </form>

              <div className="form-actions" style={{ marginTop: "24px" }}>
                <button
                  onClick={() => setStep("payment-method")}
                  className="button secondary"
                >
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
                <h4>Dorëzimi në</h4>
                <div className="review-address">
                  <p>
                    {customerData.firstName} {customerData.lastName}
                  </p>
                  <p>{customerData.address}</p>
                  <p>{customerData.city}</p>
                  <p>{customerData.phone}</p>
                </div>
                <button
                  onClick={() => setStep("customer-info")}
                  className="button secondary"
                  style={{ marginTop: "12px" }}
                >
                  Ndrysho →
                </button>
              </div>

              <div className="review-section">
                <h4>Metoda e pagesës</h4>
                <p>
                  {paymentMethod === "cash"
                    ? "💵 Pagesa në Dorëzim"
                    : "💳 Kreditë Kartë"}
                </p>
              </div>

              <div className="review-total">
                <h3>Total: {order.jerseyPrice}€</h3>
              </div>

              <div className="form-actions" style={{ marginTop: "24px" }}>
                <button
                  onClick={() => setStep("customer-info")}
                  className="button secondary"
                >
                  ← Prapa
                </button>
                <button onClick={confirmOrder} className="button">
                  Konfirmo Porosinë ✓
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && (
            <div className="checkout-step confirmation">
              <div className="confirmation-icon">✓</div>
              <h3>Porosia u Regjistrua!</h3>
              <p>
                Faleminderit për porositë tuaj. Do t'ju kontaktojmë shumë
                shpejt.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--muted)",
                  marginTop: "16px",
                }}
              >
                Po ridirekciono në dyqan...
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
