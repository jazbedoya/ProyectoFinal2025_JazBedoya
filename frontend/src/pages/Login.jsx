import React, {useState} from "react"; //useState , guardar lo que el usuario escribe en los inputs

export default function Login() {
    const [email, setEmail] = useState(""); //cada vez que el usuario escriba en los inputs , se va actualizando los estados
    const[password, setPassword]= useState("");

    const loginUser= async (e) =>{
        e.preventDefault();

    try{
        const resp = await fetch("http://127.0.0.1:5000/token",{ //await espera que el servidor responda y guarda respuesta en resp 
            method: "POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify({email,password}),

        });

        console.log(resp);

        if (!resp.ok){
            if (resp.status === 401) throw new Error("Credenciales invalidas");
            throw new Error ("Error en el login");

        }

        const data = await resp.json(); //aca el backend me devolvera el toke, y el user eso es lo que guarda data

        //Guardar el token, localstorage  permite guardar datos en el navegador
        localStorage.setItem("jwt-token", data.token)
        localStorage.setItem("user",JSON.stringify(data.user)) //para saber si el usuario esta logueado, envia el token en el headers Authorization a otras rutas protegidas

        alert("Bienvenido"+ data.user.name);
        window.location.href ="/catalogo";
      }catch(err){
        alert(err.message)
      }
        
    };

    return(
         <div className="col-md-5 mx-auto mt-4">

      <div className="card shadow">
        <div className="card-body">

          <h3 className="text-center">Iniciar sesión</h3>

          <form onSubmit={loginUser}>
            <div className="mt-3">
              <label>Email</label>
              <input type="email" className="form-control" onChange={(e)=>setEmail(e.target.value)} required />
            </div>

            <div className="mt-3">
              <label>Contraseña</label>
              <input type="password" className="form-control" onChange={(e)=>setPassword(e.target.value)} required />
            </div>

            <button className="btn btn-success w-100 mt-4">Entrar</button>
          </form>

          <p className="text-center mt-3">
            ¿No tienes cuenta? <a href="/signup">Registrarse</a>
          </p>
        </div>
      </div>
    </div>
  );
}
