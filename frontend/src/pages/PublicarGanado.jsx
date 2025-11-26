import React, { useState } from "react";

export default function PublicarGanado() {
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
    image: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("jwt-token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    fetch("http://127.0.0.1:5000/ganado", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Error al publicar");
        return resp.json();
      })
      .then(() => {
        alert("Lote publicado correctamente");
        window.location.href = "/perfil";
      })
      .catch(() => alert("No se pudo publicar el lote"));
  }

  return (
    <div className="container mt-4">
      <h2>Publicar nuevo lote</h2>

      <form className="card p-4 shadow mt-3" onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
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
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio por cabeza (Gs)</label>
          <input
            type="number"
            name="price_per_head"
            className="form-control"
            value={form.price_per_head}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Raza</label>
          <input
            name="breed"
            className="form-control"
            value={form.breed}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Categoría</label>
          <input
            name="category"
            className="form-control"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Edad (meses)</label>
          <input
            type="number"
            name="age"
            className="form-control"
            value={form.age}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Peso total del lote (kg)</label>
          <input
            type="number"
            name="kg"
            className="form-control"
            value={form.kg}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Departamento</label>
          <input
            name="department"
            className="form-control"
            value={form.department}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ciudad</label>
          <input
            name="city"
            className="form-control"
            value={form.city}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">URL de imagen</label>
          <input
            name="image"
            className="form-control"
            value={form.image}
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-success" type="submit">
          Publicar lote
        </button>
      </form>
    </div>
  );
}
