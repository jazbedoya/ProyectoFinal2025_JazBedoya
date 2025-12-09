import React, {useState} from "react";

const Signup = () => {
    //Estados para los inputs
    // cada uno tiene su funcion para actualizar

     const [name, setName] = useState("");        
     const [email, setEmail] = useState("");      
     const [password, setPassword] = useState(""); 
     const [loading, setLoading] = useState(false);
     //async porque voy a usar fecth
    const signupUser = async (e) =>{
        e.preventDefault();
        setLoading(true);


        try{
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/users",{   //envia la peticion al backend
                method: "POST",
                headers:{"Content-type": "application/json"} ,
                body: JSON.stringify({name,email,password}),
            });

            console.log(resp);
            
            //manejo de errores

            if(!resp.ok){
                if(resp.status === 400 || resp.status ===409)
                     throw new Error ("Datos invalidos o usuario ya existente");

                throw new Error("Error en el registro");
            }

        const data = await resp.json();  //Convierte la respuest el json, redirige al usuario a la pagina login
        alert("Usuario registrado con exito");
        window.location.href = "/login";

           }catch (err){
            alert(err.message);
           }
        };


        return (
  <div
    className="signup-page"
    style={{
      minHeight: "100vh",
      backgroundColor: "#b7c7b0", // Fondo verde suave
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "20px"
    }}
  >
    <div
      className="card shadow"
      style={{
        width: "380px",
        borderRadius: "12px",
        padding: "25px",
        backgroundColor: "white"
      }}
    >
      <div className="text-center mb-3">
        <img
          src="/logo.png"
          alt="GanadoPY"
          style={{ width: "60px", marginBottom: "10px" }}
        />
        <h3 className="fw-bold" style={{ color: "#0b7a35" }}>
          GanadoPY
        </h3>
        <p className="text-muted">Crear cuenta</p>
      </div>

      <form onSubmit={signupUser}>
        <div className="mt-3">
          <label>Nombre</label>
          <input
            className="form-control"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <button className="btn btn-success w-100 mt-4">
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="text-center mt-3">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" style={{ color: "#0b7a35", fontWeight: "bold" }}>
          Inicia sesión
        </a>
      </p>
    </div>
  </div>
);
}

export default Signup;