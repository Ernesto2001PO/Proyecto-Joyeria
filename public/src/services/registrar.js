document
  .getElementById("registroForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const nombre_usuario = document.getElementById("nombre_usuario").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    const msgErrorNombre = document.getElementById("msg-error-nombre");
    const msgErrorCorreo = document.getElementById("msg-error-email");
    const msgErrorContrasena = document.getElementById("msg-error-contrasena");

    msgErrorNombre.innerHTML = "";
    msgErrorCorreo.innerHTML = "";
    msgErrorContrasena.innerHTML = "";

    if (nombre_usuario == "") {
      msgErrorNombre.innerHTML = "El nombre de usuario es requerido";
      return;
    }

    if (/^\d+$/.test(nombre_usuario)) {
      msgErrorNombre.innerHTML =
        "El nombre de usuario no puede contener solo números";
      return;
    }

    if (correo == "") {
      msgErrorCorreo.innerHTML = "El correo es requerido";
      return;
    }

    if (!esEmailValido(correo)) {
      msgErrorCorreo.innerHTML = "El correo no es válido";
      return;
    }

    if (contrasena == "") {
      msgErrorContrasena.innerHTML = "La contraseña es requerida";
      return;
    }

    if (contrasena.length < 8) {
      msgErrorContrasena.innerHTML =
        "La contraseña debe tener al menos 8 caracteres";
      return;
    }

    // Verificar si el nombre de usuario o el correo ya están registrados
    const responseCheck = await fetch(
      "http://localhost:3000/api/usuarios/check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_usuario, correo }),
      }
    );

    if (responseCheck.ok) {
      const checkData = await responseCheck.json();
      if (checkData.exists) {
        msgErrorCorreo.innerHTML =
          "El nombre de usuario o correo ya está registrado";
        return;
      }
    } else {
      const errorCheckData = await responseCheck.json();
      msgErrorCorreo.innerHTML =
        "Error al verificar el usuario: " + errorCheckData.error;
      return;
    }

    const response = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_usuario, correo, contrasena }),
    });

    if (response.ok) {
      const data = await response.json();
      alert("Usuario registrado exitosamente");
      window.location.href = "../html/login.html";
    } else {
      const errorData = await response.json();
      alert("Error al registrar el usuario: " + errorData.error);
    }
  });

  

function esEmailValido(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}
