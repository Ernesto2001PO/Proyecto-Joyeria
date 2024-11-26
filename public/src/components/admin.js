document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("usuarios-link")
    .addEventListener("click", cargarUsuarios);
  document
    .getElementById("productos-link")
    .addEventListener("click", cargarProductos);
  cargarUsuarios();
  document 
    .getElementById("categorias-link")
    .addEventListener("click", cargarCategoria);

  document
    .getElementById("ordenes-link")
    .addEventListener("click", cargarOrdenes);
});

function cargarUsuarios(event) {
  if (event) event.preventDefault();
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Usuarios</div>
        <button onclick="mostrarFormularioUsuario()">Crear Usuario</button>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
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
                        <td>${usuario.rol}</td>
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

function mostrarFormularioUsuario() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Agregar Usuario</div>
        <div class="content-body">
            <form id="agregar-usuario-form">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required><br>
                <label for="correo">Correo:</label>
                <input type="email" id="correo" name="correo" required><br>
                <label for="rol">Rol:</label>
                <input type="text" id="rol" name="rol" required><br>
                <label for="contrasena">Contraseña:</label>
                <input type="password" id="contrasena" name="contrasena" required><br>
                <button type="submit">Guardar</button>
            </form>
        </div>
    `;

  document.getElementById("agregar-usuario-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const usuarioData = {
      nombre_usuario: formData.get("nombre"),
      correo: formData.get("correo"),
      contrasena: formData.get("contrasena")
    };

    fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(usuarioData)
    })
    .then((response) => response.json())
    .then((data) => {
      alert("Usuario agregado exitosamente");
      cargarUsuarios();
    })
    .catch((error) => {
      console.error("Error al agregar el usuario:", error);
    });
  }
  );

}

function editarUsuario(id) {
  fetch(`http://localhost:3000/api/usuarios/${id}`)
    .then((response) => response.json())
    .then((usuario) => {
      const content = document.getElementById("content");
      content.innerHTML = `
        <div class="content-header">Editar Usuario</div>
        <div class="content-body">
          <form id="editar-usuario-form">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value="${usuario.nombre_usuario}" required><br>
            <label for="correo">Correo:</label>
            <input type="email" id="correo" name="correo" value="${usuario.correo}" required><br>
            <label for="rol">Rol:</label>
            <input type="text" id="rol" name="rol" value="${usuario.rol}" required><br>
            <label for="contrasena">Contraseña:</label>
            <input type="password" id="contrasena" name="contrasena" required><br>
            <button type="submit">Guardar</button>
          </form>
        </div>
      `;

      document.getElementById("editar-usuario-form").addEventListener("submit", function (event) {
          event.preventDefault();

          const formData = new FormData(event.target);
          const nombre_usuario = formData.get("nombre");
          const correo = formData.get("correo");
          const rol = formData.get("rol");
          const contrasena = formData.get("contrasena");

          const usuarioData = {
            nombre_usuario,
            correo,
            rol,
            contrasena,
          };

          fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(usuarioData),
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Usuario actualizado exitosamente");
              cargarUsuarios();
            })
            .catch((error) => {
              console.error("Error al actualizar el usuario:", error);
            });
        });
    })
    .catch((error) => {
      console.error("Error al obtener el usuario:", error);
    });
}

function eliminarUsuario(id) {
  if (confirm("¿Está seguro de que desea eliminar este usuario?")) {
    fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Usuario eliminado exitosamente");
        cargarUsuarios();
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
      });
  }
}



//==========================================================
function cargarCategoria(event){
  if (event) event.preventDefault();
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Categorias</div>
        <button onclick="mostrarFormularioCategoria()">Crear Categoria</button>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="categorias-table">
                </tbody>
            </table>
        </div>
  `
  fetch("http://localhost:3000/api/categorias")
    .then((response) => response.json())
    .then((categorias) => {
      const categoriasTable = document.getElementById("categorias-table");
      categoriasTable.innerHTML = "";
      categorias.forEach((categoria) => {
        const row = `
                    <tr>
                        <td>${categoria.name}</td>
                        <td>${categoria.descripcion}</td>
                        <td>
                            <button id="editar" onclick="editarCategoria(${categoria.id})">Editar</button>
                            <button id="eliminar" onclick="eliminarCategoria(${categoria.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
        categoriasTable.innerHTML += row;
      });
      
    })
    .catch((error) => {
      console.error("Error al cargar las categorias:", error);
    });
}

function mostrarFormularioCategoria() {
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Agregar Categoria</div>
        <div class="content-body">
            <form id="agregar-categoria-form">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" name="nombre" required><br>
                <label for="descripcion">Descripción:</label>
                <input type="text" id="descripcion" name="descripcion" required><br>
                <button type="submit">Guardar</button>
            </form>
        </div>
    `;

  document.getElementById("agregar-categoria-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const categoriaData = {
      name: formData.get("nombre"),
      descripcion: formData.get("descripcion")
    };

    fetch("http://localhost:3000/api/categorias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(categoriaData)
    })
    .then((response) => response.json())
    .then((data) => {
      alert("Categoria agregada exitosamente");
      cargarCategorias(); 
    })
    .catch((error) => {
      console.error("Error al agregar la categoria:", error);
    });
  });
}

function editarCategoria(id) {
  fetch(`http://localhost:3000/api/categorias/${id}`)
  .then((response) => response.json())
    .then((categoria) => {
      const content = document.getElementById("content");
      content.innerHTML = `
        <div class="content-header">Editar Categoria</div>
        <div class="content-body">
          <form id="editar-categoria-form">
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" value="${categoria.name}" required><br>
            <label for="descripcion">Descripción:</label>
            <input type="text" id="descripcion" name="descripcion" value="${categoria.descripcion}" required><br>
            <button type="submit">Guardar</button>
          </form>
        </div>
      `;

      document
        .getElementById("editar-categoria-form")
        .addEventListener("submit", function (event) {
          event.preventDefault();

          const formData = new FormData(event.target);

          const name = formData.get("nombre");
          const descripcion = formData.get("descripcion");

          const categoriaData = {
            name,
            descripcion,
          };

          fetch(`http://localhost:3000/api/categorias/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(categoriaData),
          })
            .then((response) => response.json())
            .then((data) => {
              alert("Categoria actualizada exitosamente");
              cargarCategorias();
            })
            .catch((error) => {
              console.error("Error al actualizar la categoria:", error);
      });
    });
  })

}

function eliminarCategoria(id) {
  if (confirm("¿Está seguro de que desea eliminar esta categoria?")) {
    fetch(`http://localhost:3000/api/categorias/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Categoria eliminada exitosamente");
        cargarCategorias();
      })
      .catch((error) => {
        console.error("Error al eliminar la categoria:", error);
      });
  }
}
  
//==========================================================
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


function cargarOrdenes(event){
  if (event) event.preventDefault();
  const content = document.getElementById("content");
  content.innerHTML = `
        <div class="content-header">Ordenes</div>
        <div class="content-body">
            <table>
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Productos</th>
                        <th>Total</th>
                        <th>Fecha</th>

                    </tr>
                </thead>
                <tbody id="ordenes-table">
                </tbody>
            </table>
        </div>
    `;
  fetch("http://localhost:3000/api/ordenes")
    .then((response) => response.json())
    .then((ordenes) => {
      const ordenesTable = document.getElementById("ordenes-table");
      ordenesTable.innerHTML = "";

      ordenes.forEach((orden) => {
        const row = `
                    <tr>
                        <td>${orden.nombre_usuario}</td>
                        <td>${orden.estado}</td>
                        <td>${orden.total}</td>
                        <td>${orden.creado_en}</td>

                    </tr>
                `;
        ordenesTable.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Error al cargar las ordenes:", error);
    });
}