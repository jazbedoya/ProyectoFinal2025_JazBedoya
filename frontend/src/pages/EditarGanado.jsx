import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditarGanado() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price_per_head: "",
    breed: "",
    category: "",
    age: "",
    kg: "",
    department: "",
    city: "",
    image: ""
  });

  const [loading, setLoading] = useState(true);

  // guardar los datos del lote
  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/ganado/${id}`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    })
      .then(resp => resp.json())
      .then(data => {
        setForm(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Mmanejar los camnios en inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // guardar los cambios
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("jwt-token");

    fetch(`http://127.0.0.1:5000/ganado/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(form)
    })
      .then(resp => {
        if (!resp.ok) throw new Error("Error actualizando");
        alert("Lote actualizado correctamente");
        navigate("/perfil");
      })
      .catch(() => alert("No se pudo actualizar"));
  };

  if (loading) return <h3 className="m-4">Cargando...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: "#0B7A35" }}>
        Editar Lote
      </h2>

      <form className="card p-4 shadow mt-3" onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={form.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Precio por cabeza</label>
            <input
              type="number"
              name="price_per_head"
              className="form-control"
              value={form.price_per_head}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Raza</label>
            <input
              type="text"
              name="breed"
              className="form-control"
              value={form.breed}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Categoría</label>
            <input
              type="text"
              name="category"
              className="form-control"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Edad (meses)</label>
            <input
              type="number"
              name="age"
              className="form-control"
              value={form.age}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              name="kg"
              className="form-control"
              value={form.kg}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Departamento</label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={form.department}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              name="city"
              className="form-control"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen (URL)</label>
          <input
            type="text"
            name="image"
            className="form-control"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success w-100">
          Guardar Cambios
        </button>

      </form>
    </div>
  );
}
