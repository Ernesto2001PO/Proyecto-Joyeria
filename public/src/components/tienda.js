document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/productos")
    .then((response) => response.json())
    .then((data) => {
      const gridContainer = document.querySelector(".grid-container");
      gridContainer.innerHTML = "";

      data.forEach((producto) => {
        const productHTML = `
                    <div class="grid-item">
                        <img src="/${producto.url_imagen}" alt="${
          producto.nombre
        }">
                        <h3>${producto.nombre}</h3>
                                
    
                        <p>Precio: ${parseInt(producto.precio)} Bs</p>
                        <a href="../html/items.html?id=${
                          producto.id
                        }" class="btn-more">More</a>
                    </div>
                `;
        gridContainer.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/api/productos")
    .then((response) => response.json())
    .then((data) => {
      const gridContainer = document.querySelector(".grid-container");
      gridContainer.innerHTML = "";

      data.forEach((producto) => {
        const productHTML = `
                    <div class="grid-item">
                        <img src="/${producto.url_imagen}" alt="${
          producto.nombre
        }">
                        <h3>${producto.nombre}</h3>
                        <p>Precio: ${parseInt(producto.precio)} Bs</p>
                        <a href="../html/items.html?id=${
                          producto.id
                        }" class="btn-more">More</a>
                    </div>
                `;
        gridContainer.innerHTML += productHTML;
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });

    fetch("http://localhost:3000/api/categorias")
    .then((response) => response.json())
    .then((categorias) => {
      const categoriasContainer = document.querySelector(".categoria-lista");
      categoriasContainer.innerHTML = "";

      categorias.forEach((categoria) => {
       
        const categoriaHTML = `
          <li class="categoria-item">
            <a href="#">${categoria.name}</a>
            <ul class="subcategoria-lista">${categoria.subcategorias}</ul>
          </li>
        `;
        categoriasContainer.innerHTML += categoriaHTML;
      });
    })
    .catch((error) => {
      console.error("Error al cargar las categorías:", error);
    });
});
