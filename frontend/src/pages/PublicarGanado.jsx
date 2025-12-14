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
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 👉 SUBIR IMAGEN
  async function uploadImage(token) {
    const fd = new FormData();
    fd.append("file", imageFile);

    const resp = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/upload-image",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: fd,
      }
    );

    if (!resp.ok) {
      throw new Error("Error al subir imagen");
    }

    const data = await resp.json();
    return data.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("jwt-token");

      let imageUrl = null;

      if (imageFile) {
        imageUrl = await uploadImage(token);
      }

      const payload = {
        ...form,
        price_per_head: Number(form.price_per_head),
        age: form.age ? Number(form.age) : null,
        kg: form.kg ? Number(form.kg) : null,
        image: imageUrl,
      };

      const resp = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/ganado",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const err = await resp.json();
        alert(err.msg || "Error al publicar");
        return;
      }

      alert("Lote publicado correctamente!");
      window.location.href = "/perfil";
    } catch (err) {
      alert("Error al publicar el lote");
    } finally {
      setLoading(false);
    }
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
              value={form[key]}
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

        <button className="btn btn-success w-100" disabled={loading}>
          {loading ? "Publicando..." : "Publicar lote"}
        </button>
      </form>
    </div>
  );
}
