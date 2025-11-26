//DetalleGanado.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function DetalleGanado() {
  const { id } = useParams(); //obtener id de la url, el useParams sirve para obtener parametros de la url
  const [ganado, setGanado] = useState(null); //esta en null porque todavia no cargo


  //Trae del backend los detalles del ganado
  const cargarGanado = async () => {
    try {
      const resp = await fetch(`http://127.0.0.1:5000/ganado/${id}`); //fecth a la API usando el id
      const data = await resp.json(); //Convierte respuesta en JSON
      setGanado(data); //guarda los datos en ganado
    } catch (err) {
      alert("Error al cargar el ganado");  //si algo falla muestra mensaje
    }
  };


   //envia una orden al backend para agregar ese lote al carrito
  const agregarAlCarrito = async () => {
    try {
      const token = localStorage.getItem("jwt-token"); //obtengo el token, revisa si usuario esta logueado

      const resp = await fetch("http://127.0.0.1:5000/carrito", {
        method: "POST", //envio la solicitud POST porque estoy agregando
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`, //token del usuario
        },
        body: JSON.stringify({
          ganado_id: ganado.id, //id del ganado
          quantity: 1,
        }),
      });

      if (!resp.ok) throw new Error("Error al agregar al carrito");

      alert("Agregado al carrito");
    } catch (err) {
      alert(err.message);
    }
  };

   //para cargar datos al inicio, hace que cargarganado() se ejecute una sola vez
  useEffect(() => {
    cargarGanado();
  }, []);

  if (!ganado) return <p>Cargando...</p>;

  return (
    <div className="row mt-4">
      <div className="col-md-6">
        <img src={ganado.image} alt="foto" className="img-fluid rounded shadow" />
      </div>

      <div className="col-md-6">
        <h2>{ganado.title}</h2>
        <p className="text-muted">{ganado.description}</p>

        <ul className="list-group">
          <li className="list-group-item"><strong>Raza:</strong> {ganado.breed}</li>
          <li className="list-group-item"><strong>Edad:</strong> {ganado.age} meses</li>
          <li className="list-group-item"><strong>Peso:</strong> {ganado.kg} kg</li>
          <li className="list-group-item"><strong>Precio por cabeza:</strong> ${ganado.price_per_head}</li>
          <li className="list-group-item"><strong>Ubicación:</strong> {ganado.city}, {ganado.department}</li>
        </ul>

        <button className="btn btn-success w-100 mt-3" onClick={agregarAlCarrito}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
