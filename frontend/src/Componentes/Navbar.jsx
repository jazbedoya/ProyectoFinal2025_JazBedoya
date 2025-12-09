import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt-token");

  const logout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm px-4"
      style={{
        background: "linear-gradient(90deg, #dcebdc, #f3efe5)", // degradado verde-marrón suave
        borderBottom: "3px solid #8b6f47",
        position: "sticky",
        top: 0,
        zIndex: 1000
      }}
    >
      <div className="container-fluid">

        {/* LOGO */}
        <span
          className="navbar-brand d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/catalogo")}
        >
          <img
            src="/logo.png"
            alt="GanadoPY"
            style={{
              height: "42px",
              width: "42px",
              marginRight: "10px",
            }}
          />

          <span
            style={{
              fontWeight: "800",
              fontSize: "1.35rem",
              color: "#0b5f2a",
              letterSpacing: "1px"
            }}
          >
            GanadoPY
          </span>
        </span>

        {/* BOTÓN MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link nav-hover" to="/catalogo">
                Catálogo
              </Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/carrito">
                    Carrito
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-hover" to="/perfil">
                    Mi perfil
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* BOTONES DERECHA */}
          <div className="d-flex">
            {!token && (
              <>
                <Link className="btn btn-outline-success me-2" to="/login">
                  Iniciar sesión
                </Link>

                <Link className="btn btn-success" to="/signup">
                  Registrarse
                </Link>
              </>
            )}

            {token && (
              <button className="btn btn-danger" onClick={logout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ESTILOS EXTRA */}
      <style>{`
        .nav-link {
          font-weight: 600;
          color: #3b3b3b !important;
          transition: 0.25s ease-in-out;
        }

        .nav-hover:hover {
          color: #0b7a35 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
