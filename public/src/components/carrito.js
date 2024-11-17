function generarSessionId() {
  return "session_" + Math.random().toString(36).substr(2, 9);
}

let session_id = localStorage.getItem("session_id");
if (!session_id) {
  session_id = generarSessionId();
  localStorage.setItem("session_id", session_id);
  console.log("Se ha creado un nuevo session_id:", session_id);
} else {
  console.log("Se ha recuperado el session_id existente:", session_id);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("carrito.html")) {
    cargarCarrito();
  }
});

function cargarCarrito() {
  const carritoContainer = document.getElementById("carrito-container");

  if (!carritoContainer) {
    console.warn("No se encontró el contenedor del carrito.");
    return;
  }

  const usuario_id = localStorage.getItem("usuario_id");
  let url = "";

  if (usuario_id) {
    url = `http://localhost:3000/api/carrito?usuario_id=${usuario_id}`;
  } else if (session_id) {
    url = `http://localhost:3000/api/carrito-anonimo?session_id=${session_id}`;
  }

  if (url) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudo obtener el carrito");
        }
        return response.json();
      })
      .then((carrito) => {
        console.log("Carrito cargado:", carrito);
        renderizarCarrito(carrito);
      })
      .catch((error) => {
        console.error("Error al cargar el carrito:", error);
        carritoContainer.innerHTML = "<p>Error al cargar el carrito.</p>";
      });
  } else {
    carritoContainer.innerHTML = "<p>No se encontró un carrito asociado.</p>";
  }
}

function renderizarCarrito(carrito) {
  const carritoContainer = document.getElementById("carrito-container");
  const carritoVacio = document.getElementById("carrito-vacio");

  if (!carritoContainer) {
    console.warn("No se encontró el contenedor del carrito.");
    return;
  }

  carritoContainer.innerHTML = "";

  if (carrito.items && carrito.items.length > 0) {
    carritoVacio.style.display = "none"; 

    carrito.items.forEach((item) => {
      console.log("Renderizando item:", item);

      let imagenUrl = item.url_imagen;
      if (!imagenUrl.startsWith("/")) {
        imagenUrl = "/" + imagenUrl;
      }

      const itemHTML = `
            <div class="carrito-item" data-item-id="${item.id}">
                <img src="${imagenUrl}" alt="${item.nombre}" style="width: 100px; height: 100px;">
                <h3>${item.nombre}</h3>
                <p>Precio: ${item.precio} Bs</p>
                <p>Cantidad: <span class="cantidad">${item.cantidad}</span></p>
                <button class="btn-disminuir" data-item-id="${item.id}"> - </button>
                <button class="btn-aumentar" data-item-id="${item.id}"> + </button>
                <button onclick="eliminarDelCarrito(${item.id})">Eliminar</button>
            </div>
        `;
      carritoContainer.innerHTML += itemHTML;
    });

    document.querySelectorAll(".btn-disminuir").forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-item-id");
        disminuirCantidad(itemId);
      });
    });

    document.querySelectorAll(".btn-aumentar").forEach((button) => {
      button.addEventListener("click", () => {
        const itemId = button.getAttribute("data-item-id");
        aumentarCantidad(itemId);
      });
    });
  } else {
    carritoVacio.style.display = "block"; 
    carritoContainer.innerHTML = ""; 
  }
}

function aumentarCantidad(item_id) {
  const itemElement = document.querySelector(
    `.carrito-item[data-item-id="${item_id}"]`
  );
  const cantidadElement = itemElement.querySelector(".cantidad");
  let cantidad = parseInt(cantidadElement.textContent);

  cantidad++;
  cantidadElement.textContent = cantidad;
  actualizarCantidadEnServidor(item_id, cantidad);
}

function disminuirCantidad(item_id) {
  const itemElement = document.querySelector(
    `.carrito-item[data-item-id="${item_id}"]`
  );
  const cantidadElement = itemElement.querySelector(".cantidad");
  let cantidad = parseInt(cantidadElement.textContent);

  cantidad--;
  if (cantidad <= 0) {
    eliminarDelCarrito(item_id);
  } else {
    cantidadElement.textContent = cantidad;
    actualizarCantidadEnServidor(item_id, cantidad);
  }
}

function actualizarCantidadEnServidor(item_id, cantidad) {
  const session_id = localStorage.getItem("session_id");
  const usuario_id = localStorage.getItem("usuario_id");
  let url = "";

  if (usuario_id) {
    url = `http://localhost:3000/api/carrito`;
  } else if (session_id) {
    url = `http://localhost:3000/api/carrito-anonimo`;
  }

  fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario_id, session_id, item_id, cantidad }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "No se pudo actualizar la cantidad del producto en el carrito"
        );
      }
      return response.json();
    })
    .then((data) => {
      console.log("Cantidad actualizada en el carrito:", data);
      cargarCarrito(); 
    })
    .catch((error) => {
      console.error(
        "Error al actualizar la cantidad del producto en el carrito:",
        error
      );
    });
}

function eliminarDelCarrito(item_id) {
  if (!item_id) {
    console.error("item_id es undefined");
    return;
  }

  const session_id = localStorage.getItem("session_id");
  const usuario_id = localStorage.getItem("usuario_id");
  let url = "";

  if (usuario_id) {
    url = `http://localhost:3000/api/carrito?usuario_id=${usuario_id}&item_id=${item_id}`;
  } else if (session_id) {
    url = `http://localhost:3000/api/carrito-anonimo?session_id=${session_id}&item_id=${item_id}`;
  }

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo eliminar el producto del carrito");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Producto eliminado del carrito:", data);
      cargarCarrito();
    })
    .catch((error) => {
      console.error("Error al eliminar el producto del carrito:", error);
    });
}
