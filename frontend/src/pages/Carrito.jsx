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

    fetch("http://127.0.0.1:5000/carrito", {
      headers: { "Authorization": "Bearer " + token }
    })
      .then(resp => resp.json())
      .then(data => setCarrito(data));
  };

  const cambiarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/carrito/${id}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity: nuevaCantidad })
    })
      .then(resp => resp.json())
      .then(() => cargarCarrito());
  };

  const eliminarItem = (id) => {
    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/carrito/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token }
    })
      .then(resp => resp.json())
      .then(() => cargarCarrito());
  };

  // ---------------- API EXTERNA CLOUDINARY ----------------
  const procesarPago = () => {
    const token = localStorage.getItem("jwt-token");
    setProcesando(true);

    fetch("http://127.0.0.1:5000/orders/checkout", {
      method: "POST",
      headers: { "Authorization": "Bearer " + token }
    })
      .then(resp => resp.json())
      .then(data => {
        setProcesando(false);

        if (data.qr_url) {
          setQrPago(data.qr_url);
          cargarCarrito();
        }
      })
      .catch(() => setProcesando(false));
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: "#0B7A35" }}>Mi Carrito</h2>

      {carrito.items.length === 0 && !qrPago && (
        <div className="alert alert-info mt-3">
          Tu carrito está vacío. Ve al catálogo para agregar lotes.
        </div>
      )}

      {carrito.items.map((item) => (
        <div className="card p-3 mb-3 shadow-sm" key={item.id}>
          <div className="d-flex align-items-center">
            <img
              src={item.ganado.image}
              alt="ganado"
              style={{
                width: "150px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

            <div className="ms-3 w-100">
              <h5>{item.ganado.title}</h5>

              <p className="text-success fw-bold">
                {item.ganado.price_per_head.toLocaleString()} Gs / cabeza
              </p>

              <div className="d-flex align-items-center mb-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => cambiarCantidad(item.id, item.quantity - 1)}
                >
                  -
                </button>

                <span className="mx-2 fw-bold">{item.quantity}</span>

                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => cambiarCantidad(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => eliminarItem(item.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}

      {carrito.items.length > 0 && (
        <div className="card p-4 shadow-lg mt-4">
          <h4 className="fw-bold">
            Total: {carrito.total.toLocaleString()} Gs
          </h4>

          <div className="d-flex gap-3 mt-3 mb-3">
            <img src="/visa1.png" alt="Visa" style={{ height: "20px" }} />
            <img src="/mastercard1.png" alt="Mastercard" style={{ height: "25px" }} />
          </div>

          <button
            className="btn btn-success w-100 py-2"
            onClick={procesarPago}
            disabled={procesando}
          >
            {procesando ? "Procesando..." : "Proceder al pago"}
          </button>
        </div>
      )}

      {qrPago && (
        <div className="card p-4 shadow-lg mt-4 text-center">
          <h4 className="fw-bold">Pago generado</h4>
          <p>Escaneá este QR para completar el pago.</p>
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <img 
              src={qrPago}
              alt="QR de pago"
              style={{ width: "250px", margin: "0 auto" }}
            />
          </div>


          

          <small className="text-muted mt-3 d-block">
            (QR almacenado con Cloudinary — API externa)
          </small>
        </div>
      )}
    </div>
  );
}
