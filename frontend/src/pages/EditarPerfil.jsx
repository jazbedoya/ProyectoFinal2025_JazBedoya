import React, { useEffect, useState } from "react";

export default function EditarPerfil() {
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    fetch("http://127.0.0.1:5000/users/me", {
      headers: { "Authorization": "Bearer " + token },
    })
      .then(resp => resp.json())
      .then(data => {
        setForm({ name: data.name, email: data.email });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h3 className="m-4">Cargando...</h3>;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("jwt-token");

    fetch("http://127.0.0.1:5000/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
      },
      body: JSON.stringify(form),
    })
      .then(resp => {
        if (!resp.ok) throw new Error();
        alert("Datos actualizados");
        window.location.href = "/perfil";
      })
      .catch(() => alert("Error actualizando datos"));
  }

  return (
    
        <div className="container mt-4">
            <h2 className="fw-bold mb-3" style={{ color: "#0B7A35" }}>
            Editar Perfil
            </h2>

        <form className="card p-4 shadow mt-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">Guardar cambios</button>
      </form>
    </div>
  );
}
