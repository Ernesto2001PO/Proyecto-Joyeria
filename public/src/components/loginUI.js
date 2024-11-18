document.addEventListener("DOMContentLoaded", () => {
  const usuarioId = localStorage.getItem("usuario_id");
  const nombreUsuario = localStorage.getItem("usuario_nombre");
  const icono_usuario = document.getElementById("icono-usuario");

  if (usuarioId) {
    document.getElementById("usuario-info").style.display = "block";
    document.getElementById(
      "nombre-usuario"
    ).textContent = `Hola, ${nombreUsuario}`;
    document.getElementById("cerrar-sesion").style.display = "inline-block";

    icono_usuario.href = "#";
    icono_usuario.onclick = (event) => {
      event.preventDefault();
      alert("Ya has iniciado sesión ID: " + nombreUsuario);
    };

  } else {
    document.getElementById("nombre-usuario").textContent = "";
    document.getElementById("usuario-info").style.display = "none";
    document.getElementById("cerrar-sesion").style.display = "none";
    console.error("Usuario no autenticado");
  }
});

function cerrarSesion() {
  localStorage.removeItem("usuario_id");
  localStorage.removeItem("usuario_nombre");

  document.getElementById("nombre-usuario").textContent = "";
  document.getElementById("usuario-info").style.display = "none";
  document.getElementById("cerrar-sesion").style.display = "none";

  window.location.reload();
}
