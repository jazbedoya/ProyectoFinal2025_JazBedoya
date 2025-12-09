import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!resp.ok) {
        if (resp.status === 401) throw new Error("Credenciales inválidas");
        throw new Error("Error en el login");
      }

      const data = await resp.json();

      localStorage.setItem("jwt-token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Bienvenido " + data.user.name);
      window.location.href = "/catalogo";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-bg">

      {/* Overlay para oscurecer un poco el fondo */}
      <div className="overlay"></div>

      <div className="login-container animate-fade">
        <div className="card login-card shadow-lg">

          <div className="text-center">
            <img
              src="/logo.png"
              alt="GanadoPY"
              style={{ width: "70px", marginBottom: "10px" }}
            />
            <h3 className="fw-bold" style={{ color: "#136a31" }}>GanadoPY</h3>
            <p className="text-muted">Iniciar sesión</p>
          </div>

          <form onSubmit={loginUser}>
            <div className="mt-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mt-3">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-success w-100 mt-4">Entrar</button>
          </form>

          <p className="text-center mt-3">
            ¿No tienes cuenta?{" "}
            <a href="/signup" className="fw-bold text-success">
              Registrarse
            </a>
          </p>
        </div>
      </div>

      {/* ESTILOS MODERNOS */}
      <style>{`
        .login-bg {
          position: relative;
          width: 100%;
          height: 100vh;
          background-image: url('/campo2.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(20, 70, 30, 0.3);
          backdrop-filter: blur(3px);
        }

        .login-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 420px;
          padding: 20px;
        }

        .login-card {
          border-radius: 15px;
          padding: 30px;
          background: #ffffffee;
          backdrop-filter: blur(4px);
        }

        /* Animación suave */
        .animate-fade {
          animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
