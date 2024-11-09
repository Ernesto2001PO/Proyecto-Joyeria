document.addEventListener("DOMContentLoaded", () => {
    const usuarioId = localStorage.getItem("usuario_id");
    const nombreUsuario = localStorage.getItem("usuario_nombre");

    if (usuarioId) {
        document.getElementById("usuario-info").style.display = "block"; 
        document.getElementById("nombre-usuario").textContent = `Hola, ${nombreUsuario}`;
        document.getElementById("cerrar-sesion").style.display = "inline-block"; 
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
