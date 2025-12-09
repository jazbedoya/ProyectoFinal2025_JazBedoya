import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Perfil() {
  const [user, setUser] = useState(null);
  const [ganado, setGanado] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    if (!token) {
      alert("Debes iniciar sesión");
      window.location.href = "/login";
      return;
    }

    fetch(import.meta.env.VITE_BACKEND_URL + "/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUser(data);
        return fetch(import.meta.env.VITE_BACKEND_URL + "/ganado?vendedor_id=${data.id}");
      })
      .then((resp) => resp.json())
      .then((data) => setGanado(Array.isArray(data) ? data : []))
      .catch(() => alert("Error obteniendo el perfil"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3 className="m-4 text-success">Cargando perfil...</h3>;
  if (!user) return <h3 className="m-4">No se pudo cargar el usuario</h3>;

  return (
    <div className="container mt-4">

      <h2 className="fw-bold rural-title">👤 Mi perfil</h2>

      {/* Tarjeta del usuario */}
      <div className="card mt-3 p-4 shadow rural-card">

        <h4 className="fw-bold text-success mb-3">Datos del usuario</h4>

        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>

        <div className="mt-3 d-flex gap-3">
          <Link className="btn btn-success rural-btn" to="/editar-perfil">
            ✏️ Editar perfil
          </Link>

          <button className="btn btn-outline-danger rural-btn" onClick={eliminarCuenta}>
            🗑️ Eliminar cuenta
          </button>
        </div>
      </div>

      {/* Ganado publicado */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3 className="fw-bold text-success">🐄 Mi ganado publicado</h3>

        <Link to="/publicar" className="btn btn-success rural-btn">
          ➕ Publicar nuevo lote
        </Link>
      </div>

      <div className="row mt-3 g-4">
        {ganado.length === 0 && (
          <p className="text-muted">Aún no has publicado ningún lote.</p>
        )}

        {ganado.map((g) => (
          <div className="col-md-4" key={g.id}>
            <div className="card shadow rural-card h-100">

              <div className="rural-img-wrapper">
                <img
                  src={g.image}
                  className="card-img-top rural-img"
                  alt={g.title}
                />
              </div>

              <div className="card-body d-flex flex-column">

                <h5 className="fw-bold text-success">{g.title}</h5>

                <p className="fw-bold text-success">
                  {Number(g.price_per_head).toLocaleString()} Gs/cabeza
                </p>

                <p className="text-muted small">
                  {g.breed} · {g.category}
                </p>

                <div className="d-flex justify-content-between mt-auto">

                  <Link to={`/editar-ganado/${g.id}`} className="btn btn-warning btn-sm rural-btn">
                    ✏️ Editar
                  </Link>

                  <button
                    className="btn btn-outline-danger btn-sm rural-btn"
                    onClick={() => eliminarGanado(g.id)}
                  >
                    🗑️ Eliminar
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🎨 Estilos personalizados */}
      <style>{`
        .rural-title {
          border-left: 6px solid #0b7a35;
          padding-left: 12px;
        }

        .rural-card {
          border-radius: 12px;
          background: #ffffff;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .rural-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 12px 28px rgba(0,0,0,0.18);
        }

        .rural-btn {
          border-radius: 8px;
          font-weight: 600;
        }

        .rural-img-wrapper {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          overflow: hidden;
        }

        .rural-img {
          height: 220px;
          width: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .rural-card:hover .rural-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );

  // ---- Funciones ---- //

  function eliminarGanado(id) {
    if (!confirm("¿Seguro que quieres eliminar este lote?")) return;

    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/ganado/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => {
        if (!resp.ok) throw new Error();
        setGanado(ganado.filter((g) => g.id !== id));
      })
      .catch(() => alert("No se pudo eliminar el lote"));
  }

  function eliminarCuenta() {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta?")) return;

    const token = localStorage.getItem("jwt-token");

    fetch("http://127.0.0.1:5000/users/me", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    })
      .then((resp) => {
        if (!resp.ok) throw new Error();
        alert("Cuenta eliminada correctamente");
        localStorage.removeItem("jwt-token");
        window.location.href = "/signup";
      })
      .catch(() => alert("No se pudo eliminar la cuenta"));
  }
}
