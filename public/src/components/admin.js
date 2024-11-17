document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('usuarios-link').addEventListener('click', cargarUsuarios);
    document.getElementById('productos-link').addEventListener('click', cargarProductos);
    cargarUsuarios(); 
});

function cargarUsuarios(event) {
    if (event) event.preventDefault();
    const content = document.getElementById('content');
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

    fetch('http://localhost:3000/api/usuarios')
        .then(response => response.json())
        .then(usuarios => {
            const usuariosTable = document.getElementById('usuarios-table');
            usuariosTable.innerHTML = '';

            usuarios.forEach(usuario => {
                const row = `
                    <tr>
                        <td>${usuario.nombre_usuario}</td>
                        <td>${usuario.correo}</td>
                        <td>
                            <button onclick="editarUsuario(${usuario.id})">Editar</button>
                            <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
                usuariosTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los usuarios:', error);
        });
}

function cargarProductos(event) {
    if (event) event.preventDefault();
    const content = document.getElementById('content');
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

    fetch('http://localhost:3000/api/productos')
        .then(response => response.json())
        .then(productos => {
            const productosTable = document.getElementById('productos-table');
            productosTable.innerHTML = ''; 

            productos.forEach(producto => {
                const row = `
                    <tr>
                        <td><img src="/${producto.url_imagen}" alt="${producto.nombre}" style="width: 100px; height: auto;"></td>
                        <td>${producto.nombre}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.precio}</td>
                        <td>${producto.stock}</td>
                        <td>
                            <button onclick="editarProducto(${producto.id})">Editar</button>
                            <button onclick="eliminarProducto(${producto.id})">Eliminar</button>

                        </td>
                    </tr>
                `;
                productosTable.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
}



function editarUsuario(id) {
    const nombre_usuario = prompt('Ingrese el nuevo nombre de usuario:');
    const correo = prompt('Ingrese el nuevo correo:');

    if (nombre_usuario && correo) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre_usuario, correo })
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario actualizado exitosamente');
            cargarUsuarios(); 
        })
        .catch(error => {
            console.error('Error al actualizar el usuario:', error);
        });
    }
}

function eliminarUsuario(id) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        fetch(`http://localhost:3000/api/usuarios/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Usuario eliminado exitosamente');
            cargarUsuarios(); 
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error);
        });
    }
}



function mostrarFormularioProducto() {
    const content = document.getElementById('content');
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

    // Cargar las categorías en el select
    fetch('http://localhost:3000/api/categorias')
        .then(response => response.json())
        .then(categorias => {
            const categoriaSelect = document.getElementById('categoria');
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.name;
                categoriaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error al cargar las categorías:', error);
        });

    document.getElementById('agregar-producto-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const imagen = formData.get('imagen');
        const nombre = formData.get('nombre');
        const descripcion = formData.get('descripcion');
        const precio = formData.get('precio');
        const stock = formData.get('stock');
        const categoria_id = formData.get('categoria');

        const productoData = {
            imagen,
            nombre,
            descripcion,
            precio,
            stock,
            categoria_id
        };

        fetch('http://localhost:3000/api/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto agregado exitosamente');
            cargarProductos(); // Recargar la lista de productos
        })
        .catch(error => {
            console.error('Error al agregar el producto:', error);
        });
    });
}




function editarProducto(id) {
    const nombre = prompt('Ingrese el nuevo nombre del producto:');
    const descripcion = prompt('Ingrese la nueva descripción:');
    const precio = prompt('Ingrese el nuevo precio:');
    const stock = prompt('Ingrese el nuevo stock:');

    if (nombre && descripcion && precio && stock) {
        fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, descripcion, precio, stock })
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto actualizado exitosamente');
            cargarProductos(); 
        })
        .catch(error => {
            console.error('Error al actualizar el producto:', error);
        });
    }
}

function eliminarProducto(id) {
    if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        fetch(`http://localhost:3000/api/productos/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Producto eliminado exitosamente');
            cargarProductos(); 
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }
}