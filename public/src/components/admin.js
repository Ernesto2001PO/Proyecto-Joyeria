document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("usuarios-link")
    .addEventListener("click", cargarUsuarios);
  document
    .getElementById("productos-link")
    .addEventListener("click", cargarProductos);
  cargarUsuarios();
});

function cargarUsuarios(event) {
  if (event) event.preventDefault();
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Usuarios</div>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="usuarios-table">
                </tbody>
            </table>
        </div>
    `;

  fetch("http://localhost:3000/api/usuarios")
    .then((response) => response.json())
    .then((usuarios) => {
      const usuariosTable = document.getElementById("usuarios-table");
      usuariosTable.innerHTML = "";

      usuarios.forEach((usuario) => {
        const row = `
                    <tr>
                        <td>${usuario.nombre_usuario}</td>
                        <td>${usuario.correo}</td>
                        <td>
                            <button id="editar"    onclick="editarUsuario(${usuario.id})">Editar</button>
                            <button  id="eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
        usuariosTable.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error al cargar los usuarios:", error);
    });
}

function cargarProductos(event) {
  if (event) event.preventDefault();
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Productos</div>
        <button onclick="mostrarFormularioProducto()">Crear Producto</button>

        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="productos-table">
                </tbody>
            </table>
        </div>
    `;
  fetch("http://localhost:3000/api/productos")
    .then((response) => response.json())
    .then((productos) => {
      const productosTable = document.getElementById("productos-table");
      productosTable.innerHTML = "";


      productos.forEach((producto) => {
        const urlImagen = `http://localhost:3000/${producto.url_imagen}`.replace(/([^:]\/)\/+/g, "$1");

        const row = `
                    <tr>
                        <td><img src="${urlImagen}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>
                            <button     id="editar"onclick="editarProducto(${producto.id})">Editar</button>
                            <button     id="eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>

                        </td>
                    </tr>
                `;
        productosTable.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error al cargar los productos:", error);
    });
}

function mostrarFormularioProducto() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Agregar Producto</div>
        <div class="content-body">
            <form id="agregar-producto-form">
                <label for="imagen">Imagen:</label>
                <input type="file" id="imagen" name="imagen" accept="image/*"><br>
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required><br>
                <label for="descripcion">Descripción:</label>
                <input type="text" id="descripcion" name="descripcion" required><br>
                <label for="precio">Precio:</label>
                <input type="number" id="precio" name="precio" required><br>
                <label for="stock">Stock:</label>
                <input type="number" id="stock" name="stock" required><br>
                <label for="categoria">Categoría:</label>
                <select id="categoria" name="categoria" required>
                    <!-- Opciones de categorías -->
                </select><br>
                <button type="submit">Guardar</button>
            </form>
        </div>
    `;

  -fetch("http://localhost:3000/api/categorias")
    .then((response) => response.json())
    .then((categorias) => {
      const categoriaSelect = document.getElementById("categoria");
      categorias.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.name;
        categoriaSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error al cargar las categorías:", error);
    });

  document
    .getElementById("agregar-producto-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(event.target);

      fetch("http://localhost:3000/api/productos", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          alert("Producto agregado exitosamente");
          cargarProductos();
        })
        .catch((error) => {
          console.error("Error al agregar el producto:", error);
        });
    });
}

function editarProducto(id) {
  fetch(`http://localhost:3000/api/productos/${id}`)
    .then((response) => response.json())
    .then((producto) => {
      const content = document.getElementById("content");
      content.innerHTML = `
                <div class="content-header"><h2>Editar Producto</h2></div>
                <div class="content-body">
                    <form id="editar-producto-form">
                        <label for="imagen">Imagen:</label>
                        <input type="file" id="imagen" name="imagen" accept="image/*"><br>
                        <label for="nombre">Nombre:</label>
                        <input type="text" id="nombre" name="nombre" value="${producto.nombre}" required><br>
                        <label for="descripcion">Descripción:</label>
                        <input type="text" id="descripcion" name="descripcion" value="${producto.descripcion}" required><br>
                        <label for="precio">Precio:</label>
                        <input type="number" id="precio" name="precio" value="${producto.precio}" step="0.01" required><br>
                        <label for="stock">Stock:</label>
                        <input type="number" id="stock" name="stock" value="${producto.stock}" required><br>
                        <label for="categoria">Categoría:</label>
                        <select id="categoria" name="categoria" required>
                            <!-- Opciones de categorías -->
                        </select><br>
                        <button type="submit">Guardar</button>
                    </form>
                </div>
            `;

      fetch("http://localhost:3000/api/categorias")
        .then((response) => response.json())
        .then((categorias) => {
          const categoriaSelect = document.getElementById("categoria");
          categorias.forEach((categoria) => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.name;
            if (categoria.id === producto.categoria_id) {
              option.selected = true;
            }
            categoriaSelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Error al cargar las categorías:", error);
        });

      document
        .getElementById("editar-producto-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();

          const formData = new FormData(event.target);
          const nombre = formData.get("nombre");
          const descripcion = formData.get("descripcion");
          const precio = parseFloat(formData.get("precio"));
          const stock = formData.get("stock");
          const categoria_id = formData.get("categoria");
          const imagen = formData.get("imagen");

          const productoData = {
            imagen,
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id,
          };

          fetch(`http://localhost:3000/api/productos/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(productoData),
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Producto actualizado exitosamente");
              cargarProductos(); 
            })
            .catch((error) => {
              console.error("Error al actualizar el producto:", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error al obtener el producto:", error);
    });
}

function eliminarProducto(id) {
  if (confirm("¿Está seguro de que desea eliminar este producto?")) {
    fetch(`http://localhost:3000/api/productos/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Producto eliminado exitosamente");
        cargarProductos();
      })
      .catch((error) => {
        console.error("Error al eliminar el producto:", error);
      });
  }
}
