import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalogo() {
  const [ganado, setGanado] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGanado = async () => {
      try {
        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "./ganado");

        if (!resp.ok) throw new Error("Error al cargar el catálogo");

        const data = await resp.json();
        const lista = Array.isArray(data) ? data : data.ganado;

        setGanado(lista || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGanado();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3 fw-bold text-success">Cargando catálogo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4">
        Error al cargar catálogo: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Título */}
      <h2 className="fw-bold text-success mb-4 rural-title">
        🐂 Catálogo de Lotes Ganaderos
      </h2>

      <div className="row g-4">
        {ganado.map((g) => {
          const imageUrl =
            g.image && g.image.startsWith("http")
              ? g.image
              : "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=60";

          return (
            <div className="col-md-4" key={g.id}>
              <div className="card shadow rural-card h-100 border-0">

                {/* Imagen */}
                <div className="rural-img-wrapper">
                  <img
                    src={imageUrl}
                    className="card-img-top rural-img"
                    alt={g.title}
                  />
                </div>

                {/* Contenido */}
                <div className="card-body d-flex flex-column">

                  <h5 className="card-title fw-bold text-success rural-card-title">
                    {g.title}
                  </h5>

                  <p className="fw-bold text-success rural-price">
                    {Number(g.price_per_head).toLocaleString()} Gs/cabeza
                  </p>

                  <p className="text-muted small rural-meta">
                    {g.breed} · {g.category} · {g.department}
                  </p>

                  <Link
                    to={`/detalle/${g.id}`}
                    className="btn btn-success mt-auto rural-btn"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {ganado.length === 0 && (
          <div className="text-center text-muted mt-4">
            No hay lotes disponibles.
          </div>
        )}
      </div>

      {/* 🎨 Estilos personalizados */}
      <style>{`
        .rural-title {
          border-left: 6px solid #0b7a35;
          padding-left: 12px;
        }

        .rural-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border-radius: 12px;
          background-color: #ffffff;
        }

        .rural-card:hover {
          transform: translateY(-6px);
          box-shadow: 0px 12px 25px rgba(0,0,0,0.20);
        }

        .rural-img-wrapper {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
          overflow: hidden;
        }

        .rural-img {
          height: 240px;
          width: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .rural-card:hover .rural-img {
          transform: scale(1.05);
        }

        .rural-meta {
          font-style: italic;
        }

        .rural-btn {
          border-radius: 8px;
          font-weight: 600;
        }
      `}</style>

    </div>
  );
}
