document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
  cargarCategorias();
});

function cargarProductos() {
  fetch("http://localhost:3000/api/productos")
    .then((response) => response.json())
    .then((data) => {
      const gridContainer = document.querySelector(".grid-container");
      gridContainer.innerHTML = "";


      data.forEach((producto) => {
        const productHTML = `
          <div class="grid-item">
            <img src="/${producto.url_imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: ${parseInt(producto.precio)} Bs</p>
            <a href="../html/items.html?id=${
              producto.id
            }" class="btn-more">Detalles</a>
          </div>
        `;
        gridContainer.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
}

function cargarCategoria() {
  fetch("http://localhost:3000/api/categorias")
    .then((response) => response.json())
    .then((categorias) => {
      const categoriasContainer = document.getElementById(
        "categorias-container"
      );

      categorias.forEach((categoria) => {
        const categoriaHTML = `
          <li class="categoria-item">
            <a href="#" data-categoria-id="${categoria.id}">${categoria.name}</a>
          </li>
        `;
        categoriasContainer.innerHTML += categoriaHTML;
      });

      document.querySelectorAll(".categoria-item a").forEach((enlace) => {
        enlace.addEventListener("click", (event) => {
          event.preventDefault();
          const categoriaId = enlace.getAttribute("data-categoria-id");
          cargarProductosPorCategoria(categoriaId);
        });
      });
    })
    .catch((error) => {
      console.error("Error al cargar las categorías:", error);
    });
}

function cargarProductosPorCategoria(categoria_id) {
  const productosContainer = document.querySelector(".grid-container");
  productosContainer.innerHTML = "";
  fetch(`http://localhost:3000/api/productos/categoria/${categoria_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        alert("Error al cargar los productos: " + data.error);
      } else {
        console.log("Productos:", data);
        data.forEach((producto) => {
          const productoHTML = `
          <div class="grid-item">
            <img src="/${producto.url_imagen}" alt="${producto.nombre}" ">
            <h3>${producto.nombre}</h3>
            <p>${producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: ${producto.stock}</p>
            <a href="../html/items.html?id=${producto.id}" class="btn-more">Detalles</a>
          </div>
        `;
          productosContainer.innerHTML += productoHTML;
        });
      }
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
}
