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
      style={{ backgroundColor: "#E8F5E9", position: "sticky", top: 0, zIndex: 1000 }}
    >
      <div className="container-fluid">

        {/* LOGO + TEXT */}
        <span
          className="navbar-brand d-flex align-items-center"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/catalogo")}
        >
          <img
            src="/logo.png"
            alt="GanadoPY"
            style={{
              height: "40px",
              width: "40px",
              marginRight: "10px",
            }}
          />

          <span style={{ fontWeight: "bold", fontSize: "1.3rem", color: "#136a31" }}>
            GanadoPY
          </span>
        </span>

        {/* HAMBURGUER MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAV LINKS */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link className="nav-link nav-link-hover" to="/catalogo">
                Catálogo
              </Link>
            </li>

            {token && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-hover" to="/carrito">
                    Carrito
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link nav-link-hover" to="/perfil">
                    Mi perfil
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* RIGHT SIDE BUTTONS */}
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
              <button
                className="btn btn-danger"
                onClick={logout}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .nav-link {
          font-weight: 500;
          color: #333 !important;
          transition: 0.2s ease-in-out;
        }

        .nav-link-hover:hover {
          color: #0b7a35 !important;
          transform: translateY(-1px);
        }

        .navbar-brand span:hover {
          opacity: 0.85;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
