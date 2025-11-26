
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalogo() {
  

  // Lista de lotes de ganado que viene del backend
  const [ganado, setGanado] = useState([]);

  // Bandera para saber si estamos cargando
  const [loading, setLoading] = useState(true);

  // Para guardar un mensaje de error si algo falla
  const [error, setError] = useState(null);

  
  // PEDIR LOS LOTES AL BACKEND
  useEffect(() => {
    // Función asíncrona para poder usar async/await
    const fetchGanado = async () => {
      try {
        // Llamada a tu backend (Flask) en /ganado
        const resp = await fetch("http://127.0.0.1:5000/ganado");

        // Si la respuesta NO es 200–299 lanzo un error
        if (!resp.ok) {
          throw new Error("Error al cargar el catálogo");
        }

        // Convierto la respuesta a JSON
        const data = await resp.json();

        
        const lista = Array.isArray(data) ? data : data.ganado;

        console.log("Ganado cargado:", lista); // Para ver en consola qué llega

        // Guardo la lista en el estado 
        setGanado(lista || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        // Siempre, haya éxito o error, dejamos de estar "cargando"
        setLoading(false);
      }
    };

    fetchGanado();
  }, []); // [] => se ejecuta una sola vez al montar el componente

  
  // VISTAS SEGÚN ESTADO (CARGANDO / ERROR / NORMAL)
  

  if (loading) {
 
    return <p>Cargando catálogo...</p>;
  }

  if (error) {
    // Si hubo un error, lo mostramos
    return (
      <div className="alert alert-danger mt-3" role="alert">
        Ocurrió un error cargando el catálogo: {error}
      </div>
    );
  }


  // RENDER DEL CATÁLOGO
  
  return (
    <div>
      {/* Título principal */}
      <h2 className="mb-4">Catálogo de Lotes</h2>

  
      <div className="row">
        {ganado.map((g) => {
        
          const imageUrl =
            g.image && g.image.startsWith("http")
              ? g.image
              : "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60";

          return (
            <div className="col-md-4 mb-4" key={g.id}>
              <div className="card shadow-sm h-100">
                {/* Imagen del lote */}
                <img
                  src={imageUrl}
                  alt={g.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                {/* Cuerpo de la tarjeta */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{g.title}</h5>

                  <p className="text-success fw-bold mb-1">
                    {g.price_per_head} Gs/cabeza
                  </p>

                  <p className="text-muted small mb-3">
                    {g.breed} · {g.category} · {g.department}
                  </p>

                  {/* Botón "Ver detalle" pegado abajo */}
                  <div className="mt-auto">
                    <Link
                      className="btn btn-outline-success w-100"
                      to={`/detalle/${g.id}`}
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Si no hay lotes (lista vacía) mostramos un mensaje */}
        {ganado.length === 0 && (
          <p className="text-muted">No hay lotes disponibles por ahora.</p>
        )}
      </div>
    </div>
  );
}
