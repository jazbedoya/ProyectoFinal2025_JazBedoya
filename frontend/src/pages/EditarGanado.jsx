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

  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");

    fetch(import.meta.env.VITE_BACKEND_URL + "/ganado/${id}")
      .then(resp => resp.json())
      .then(data => {
        setForm(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // PREVIEW
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // SUBIR A CLOUDINARY
  async function uploadToCloudinary() {
    const token = localStorage.getItem("jwt-token");
    const fd = new FormData();
    fd.append("file", imageFile);

    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/upload-image", {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: fd
    });

    const data = await resp.json();
    return data.url;
  }

  // GUARDAR CAMBIOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwt-token");

    let finalImage = form.image;

    // si el usuario sube una nueva imagen → subirla
    if (imageFile) {
      finalImage = await uploadToCloudinary();
    }

    const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/ganado/${id}", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ ...form, image: finalImage })
    });

    if (!resp.ok) return alert("Error actualizando");

    alert("Lote actualizado correctamente");
    navigate("/perfil");
  };

  if (loading) return <h3 className="m-4">Cargando...</h3>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: "#0B7A35" }}>
        Editar Lote
      </h2>

      <form className="card p-4 shadow mt-3" onSubmit={handleSubmit}>

        {/* ---------- CAMPOS NORMALES ---------- */}
        {[
          "title", "description", "price_per_head",
          "breed", "category", "age", "kg",
          "department", "city"
        ].map((key) => (
          <div className="mb-3" key={key}>
            <label className="form-label">{key}</label>
            <input
              name={key}
              className="form-control"
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        {/* ---------- IMAGEN ACTUAL ---------- */}
        <div className="mb-3">
          <label className="form-label">Imagen actual</label>
          <img
            src={form.image}
            alt="actual"
            width="250"
            className="img-thumbnail d-block mb-2"
          />
        </div>

        {/* ---------- SUBIR NUEVA IMAGEN ---------- */}
        <div className="mb-3">
          <label className="form-label">Subir nueva imagen (opcional)</label>
          <input type="file" className="form-control" onChange={handleImageChange} />
        </div>

        {/* Preview nueva imagen */}
        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            width="250"
            className="img-thumbnail mb-3"
          />
        )}

        <button className="btn btn-success w-100">
          Guardar Cambios
        </button>

      </form>
    </div>
  );
}
