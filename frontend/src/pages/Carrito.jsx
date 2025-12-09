import React, { useEffect, useState } from "react";

export default function Carrito() {
  const [carrito, setCarrito] = useState({ items: [], total: 0 });
  const [qrPago, setQrPago] = useState(null);
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const token = localStorage.getItem("jwt-token");

    fetch(import.meta.env.VITE_BACKEND_URL + "/carrito", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => resp.json())
      .then((data) => setCarrito(data));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const token = localStorage.getItem("jwt-token");

    fetch(import.meta.env.VITE_BACKEND_URL + "/carrito/${id}", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: nuevaCantidad }),
    })
      .then((resp) => resp.json())
      .then(() => cargarCarrito());
  };

  const eliminarItem = (id) => {
    const token = localStorage.getItem("jwt-token");

    fetch(import.meta.env.VITE_BACKEND_URL + "/carrito/${id}", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => resp.json())
      .then(() => cargarCarrito());
  };

  const procesarPago = () => {
    const token = localStorage.getItem("jwt-token");
    setProcesando(true);

    fetch(import.meta.env.VITE_BACKEND_URL + "/orders/checkout", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProcesando(false);
        if (data.qr_url) {
          setQrPago(data.qr_url);
          cargarCarrito();
        }
      });
  };

  return (
    <div className="container mt-4">

      {/* TÍTULO PREMIUM */}
      <h2 className="fw-bold mb-4"
        style={{ 
          color: "#2F5225",
          textShadow: "1px 1px 2px #dcd7c7"
        }}
      >
        🐂 Carrito de Compras
      </h2>

      {/* CARRITO VACÍO */}
      {carrito.items.length === 0 && !qrPago && (
        <div className="alert shadow-sm"
          style={{
            backgroundColor: "#fff7e6",
            borderLeft: "6px solid #c7882f",
          }}
        >
          Tu carrito está vacío. Agregá lotes desde el catálogo.
        </div>
      )}

      {/* LISTA DE PRODUCTOS */}
      <div className="row">
        {carrito.items.map((item) => (
          <div className="col-md-12 mb-4" key={item.id}>
            <div
              className="card border-0 shadow-lg p-3"
              style={{
                background: "#f5f0e6",
                borderRadius: "14px",
                borderLeft: "6px solid #6a4e23",
              }}
            >
              <div className="d-flex align-items-center gap-4">

                {/* Imagen del lote */}
                <img
                  src={item.ganado.image}
                  alt="ganado"
                  className="rounded shadow-sm"
                  style={{
                    width: "170px",
                    height: "130px",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />

                {/* Información */}
                <div className="w-100">
                  <h5 className="fw-bold" style={{ color: "#3e6b2f" }}>
                    {item.ganado.title}
                  </h5>

                  <p className="fw-bold" style={{ color: "#6a4e23" }}>
                    {item.ganado.price_per_head.toLocaleString()} Gs / cabeza
                  </p>

                  {/* Contador */}
                  <div className="d-flex align-items-center mb-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => cambiarCantidad(item.id, item.quantity - 1)}
                      style={{
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      -
                    </button>

                    <span className="mx-3 fw-bold fs-5">{item.quantity}</span>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => cambiarCantidad(item.id, item.quantity + 1)}
                      style={{
                        borderRadius: "50%",
                        width: "32px",
                        height: "32px",
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Botón eliminar */}
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: "#c5523c",
                      color: "white",
                    }}
                    onClick={() => eliminarItem(item.id)}
                  >
                    🗑️ Eliminar lote
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL + BOTÓN DE PAGO */}
      {carrito.items.length > 0 && (
        <div
          className="card shadow-lg mt-4 border-0 p-4"
          style={{
            background: "#efe9dd",
            borderRadius: "16px",
          }}
        >
          <h4 className="fw-bold mb-3" style={{ color: "#2F5225" }}>
            Total a pagar: {carrito.total.toLocaleString()} Gs
          </h4>

          <div className="d-flex gap-3 mb-3">
            <img src="/visa1.png" alt="Visa" style={{ height: "26px" }} />
            <img src="/mastercard1.png" alt="MC" style={{ height: "30px" }} />
          </div>

          <button
            className="w-100 py-3 fw-bold"
            onClick={procesarPago}
            disabled={procesando}
            style={{
              backgroundColor: "#3e6b2f",
              color: "white",
              borderRadius: "10px",
              fontSize: "1.2rem",
            }}
          >
            {procesando ? "Procesando..." : "💳 Proceder al pago"}
          </button>
        </div>
      )}

      {/* QR PREMIUM */}
      {qrPago && (
        <div
          className="card p-4 shadow-lg mt-4 text-center border-0"
          style={{
            background: "#faf7f0",
            borderRadius: "18px",
          }}
        >
          <h4 className="fw-bold" style={{ color: "#2F5225" }}>
            Pago generado ✔
          </h4>

          <p className="text-muted mb-3">
            Escaneá el código para completar tu compra.
          </p>

          <img
            src={qrPago}
            alt="QR pago"
            className="shadow rounded"
            style={{ width: "270px" }}
          />

          <small className="d-block mt-3 text-muted">
            (QR almacenado en Cloudinary)
          </small>
        </div>
      )}
    </div>
  );
}
