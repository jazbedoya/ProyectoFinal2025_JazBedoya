import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Componentes/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Catalogo from "./pages/Catalogo";
import DetalleGanado from "./pages/DetalleGanado";
import Carrito from "./pages/Carrito";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import PublicarGanado from "./pages/PublicarGanado";

// Ruta protegida: solo deja entrar si hay un token válido
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt-token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      
      <Navbar />

      <div className="container mt-4">
        <Routes>

          <Route path="/" element={<Navigate to="/catalogo" />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/detalle/:id" element={<DetalleGanado />} />
          <Route path="/editar-perfil" element={<EditarPerfil />} />
          <Route path="/publicar" element={<PublicarGanado />} />


          {/* Rutas protegidas */}
          <Route
            path="/carrito"
            element={
              <PrivateRoute>
                <Carrito />
              </PrivateRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}
