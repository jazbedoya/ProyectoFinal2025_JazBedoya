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
  });

  const [imageFile, setImageFile] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("jwt-token");

    const fd = new FormData();

    Object.keys(form).forEach((key) => {
      fd.append(key, form[key]);
    });

    if (imageFile) {
      fd.append("image", imageFile);
    }

    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/ganado", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: fd,
    });

    if (!resp.ok) return alert("Error al publicar");

    alert("Lote publicado correctamente!");
    window.location.href = "/perfil";
  }

  return (
    <div className="container mt-4">
      <h2>Publicar nuevo lote</h2>

      <form className="card p-4 shadow mt-3" onSubmit={handleSubmit}>

        {Object.keys(form).map((key) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key}</label>
            <input
              className="form-control"
              name={key}
              onChange={handleChange}
              required={key === "title" || key === "price_per_head"}
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Imagen del lote</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="img-thumbnail mb-3"
            width="250"
          />
        )}

        <button className="btn btn-success w-100">Publicar lote</button>
      </form>
    </div>
  );
}
