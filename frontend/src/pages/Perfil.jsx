import React, { useEffect, useState } from "react"; //React necesario para crear componentes , useState permite cambiar datos que cambian
import { Link } from "react-router-dom";

export default function Perfil() {
  //Estados de la pagina
  const [user, setUser] = useState(null);
  const [ganado, setGanado] = useState([]);
  const [loading, setLoading] = useState(true);

  //Ejecuta al cargar la pagina
  useEffect(() => {
    const token = localStorage.getItem("jwt-token"); //obtiene el JWT del localStore

    if (!token) {
      alert("Debes iniciar sesión"); //si es diferente al token debe iniciar sesion
      window.location.href = "/login";
      return; 
    }

    // Obtener usuario logueado
    fetch("http://127.0.0.1:5000/users/me", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setUser(data);
        return fetch(`http://127.0.0.1:5000/ganado?vendedor_id=${data.id}`); //Obtener el ganado del usuario,usa id del usuario para pedir a backend tdo su ganado
      })
      .then((resp) => resp.json())
      .then((data) => {
        setGanado(Array.isArray(data) ? data : []); //La respuesta se guarda en ganado
      })
      .catch(() => alert("Error obteniendo el perfil"))
      .finally(() => setLoading(false));
  }, []);
 
 
  //De carga y error
  if (loading) return <h3 className="m-4">Cargando perfil...</h3>;
  if (!user) return <h3 className="m-4">No se pudo cargar el usuario</h3>;

  return (
    <div className="container mt-4">
      <h2>Mi perfil</h2>

      <div className="card mt-3 p-3 shadow">
        <h4>Datos del usuario</h4>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>

        <div className="mt-3 d-flex gap-2">
          <Link className="btn btn-success me-2" to="/editar-perfil">
            Editar perfil
          </Link>
          <button className=" btn-green-light" onClick={eliminarCuenta}>
            🗑️Eliminar
          </button>
         
        </div>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <h3>Mi ganado publicado</h3>
        <Link to="/publicar" className="btn btn-success">Publicar nuevo lote</Link>
      </div>

      <div className="row mt-3">
        {ganado.length === 0 && (
          <p className="text-muted">Aún no has publicado ningún lote.</p>
        )}

        {ganado.map((g) => (
          <div className="col-md-4 mb-3" key={g.id}>
            <div className="card shadow-sm h-100">
              <img
                src={g.image}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />

              <div className="card-body">
                <h5>{g.title}</h5>
                <p className="fw-bold text-success">{g.price_per_head} Gs/cabeza</p>
                <p className="text-muted small">{g.breed} · {g.category}</p>

                <div className="d-flex justify-content-between mt-3">
                  <Link to={`/editar-ganado/${g.id}`} className="btn btn-warning btn-sm">
                    Editar
                  </Link>

                
         

                  <button
                    className= " btn-green-light"
                    onClick={() => eliminarGanado(g.id)}
                  >
                    🗑️Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


  //envia un DElete al backend para eliminar ese lote
  function eliminarGanado(id) {
    if (!confirm("¿Seguro que quieres eliminar este lote?")) return;

    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/ganado/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token },
    })
      .then((resp) => {
        if (!resp.ok) throw new Error();
        setGanado(ganado.filter((g) => g.id !== id));
      })
      .catch(() => alert("No se pudo eliminar"));
  }

  function eliminarCuenta() {
    if (!confirm("¿Seguro que deseas eliminar tu cuenta? Esta acción es irreversible.")) return;

    const token = localStorage.getItem("jwt-token");

    fetch("http://127.0.0.1:5000/users/me", {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + token },
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
