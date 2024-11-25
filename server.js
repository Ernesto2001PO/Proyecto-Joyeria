const express = require("express");
const multer = require('multer');
const path = require('path');
const cors = require("cors");
const app = express();
const db = require("./public/src/services/conectar");


const uploadDirectory = path.resolve(process.env.UPLOADS_PATH || 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(uploadDirectory));




const PORT = process.env.PORT || 3000;

app.use(cors()); 

app.use(express.json());
app.use(express.static("public"));



//===========RUTAS===================
// localhost:3000/api/productos
app.get("/api/productos", async (req, res) => {
  try {
    const resultado = await db.query(`
            SELECT p.id,p.nombre,p.descripcion,p.precio,p.stock,p.categoria_id,p.creado_en,ip.url_imagen
            FROM producto p
            LEFT JOIN imagenproducto ip ON p.id = ip.producto_id
        `);
    res.json(resultado.rows);
  } catch (err) {
    console.error("Error al consultar la base de datos:", err);
    res.status(500).json({ error: "Error al consultar la base de datos" });
  }
});

app.get('/api/productos/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const resultado = await db.query(
          'SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, p.categoria_id, ip.url_imagen FROM producto p LEFT JOIN imagenproducto ip ON p.id = ip.producto_id WHERE p.id = $1',
          [id]
      );
      if (resultado.rows.length === 0) {
          return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.status(200).json(resultado.rows[0]);
  } catch (err) {
      console.error('Error al obtener el producto:', err);
      res.status(500).json({ error: 'Error al obtener el producto' });
  }
});

// localhost:3000/api/usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const resultado = await db.query("SELECT * FROM usuario");
    res.json(resultado.rows);
  } catch (err) {
    console.error("Error al consultar la base de datos:", err);
    res.status(500).jsons({ error: "Error al consultar la base de datos" });
  }
});

app.get("/api/categorias", async (req, res) => {
  try {
    const resultado = await db.query(
      "SELECT id, name, descripcion, categoria_padre_id FROM categoria"
    );
    const categorias = {};

    resultado.rows.forEach((categoria) => {
      if (!categoria.categoria_padre_id) {
        categorias[categoria.id] = {
          id: categoria.id,
          name: categoria.name,
          descripcion: categoria.descripcion,
          subcategorias: [],
        };
      }
    });
    resultado.rows.forEach((categoria) => {
      if (categoria.categoria_padre_id) {
        const categoriaPadre = categorias[categoria.categoria_padre_id];
        if (categoriaPadre) {
          categoriaPadre.subcategorias.push({
            id: categoria.id,
            name: categoria.name,
            descripcion: categoria.descripcion,
          });
        }
      }
    });
    const categoriasArray = Object.values(categorias);
    res.json(categoriasArray);
  } catch (err) {
    console.error("Error al obtener categorías:", err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// localhost:3000/api/carrito
app.get("/api/carrito", async (req, res) => {
  try {
    const { usuario_id } = req.query;

    if (!usuario_id) {
      return res
        .status(400)
        .json({ error: "Se requiere usuario_id para obtener el carrito" });
    }

    const carrito = await db.query(
      "SELECT * FROM carrito WHERE usuario_id = $1",
      [usuario_id]
    );

    if (carrito.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró un carrito para este usuario" });
    }

    const carrito_id = carrito.rows[0].id;

    const items = await db.query(
      `SELECT ic.id, ic.cantidad, p.nombre, p.precio,ip.url_imagen
             FROM itemcarrito ic
             INNER JOIN producto p ON ic.producto_id = p.id
            LEFT JOIN imagenproducto ip ON p.id = ip.producto_id
             WHERE ic.carrito_id = $1`,
      [carrito_id]
    );

    res.status(200).json({
      carrito_id,
      items: items.rows,
    });
  } catch (err) {
    console.error("Error al obtener el carrito:", err);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// localhost:3000/api/carrito-anonimo
app.get("/api/carrito-anonimo", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "session_id es requerido" });
    }

    const carrito = await db.query(
      "SELECT id FROM carrito WHERE session_id = $1",
      [session_id]
    );

    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const carrito_id = carrito.rows[0].id;

    const items = await db.query(
      `SELECT ic.id, ic.cantidad, p.nombre, p.precio, ip.url_imagen
             FROM itemcarrito ic
             INNER JOIN producto p ON ic.producto_id = p.id
             LEFT JOIN imagenproducto ip ON p.id = ip.producto_id
             WHERE ic.carrito_id = $1`,
      [carrito_id]
    );

    res.status(200).json({
      carrito_id,
      items: items.rows,
    });
  } catch (err) {
    console.error("Error al obtener el carrito anónimo:", err);
    res.status(500).json({ error: "Error al obtener el carrito anónimo" });
  }
});

// localhost:3000/api/carrito/:id
app.get("/api/item_carrito/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const resultado = await db.query(
      `
        Select * FROM itemcarrito WHERE carrito_id = $1
        `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    res.json(resultado.rows);
  } catch (err) {
    console.error("Error al obtener item del carrito:", err);
    res.status(500).json({ error: "Error al obtener item del carrito" });
  }
});


// localhost:3000/api/ordenes/:usuario_id
app.get('/api/ordenes/:usuario_id', async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const resultado = await db.query(
      `SELECT o.id, o.total, o.estado, o.creado_en, io.producto_id, io.cantidad, io.precio, p.nombre
       FROM orden o
       JOIN itemorden io ON o.id = io.orden_id
       JOIN producto p ON io.producto_id = p.id
       WHERE o.usuario_id = $1`,
      [usuario_id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron órdenes para este usuario' });
    }
    res.status(200).json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener las órdenes:', err);
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
});

// localhost:3000/api/item_orden/:id
app.get("/api/item_orden/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const resultado = await db.query(
      "SELECT * FROM itemorden WHERE orden_id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    res.json(resultado.rows);
  } catch (err) {
    console.error("Error al obtener item de la orden:", err);
    res.status(500).json({ error: "Error al obtener item del carrito" });
  }
});

// localhost:3000/api/orden/:id
app.get("/api/productos/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const resultado = await db.query(
      "SELECT p.*, ip.url_imagen FROM producto p LEFT JOIN imagenproducto ip ON p.id = ip.producto_id WHERE p.id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error("Error al obtener el producto:", err);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// localhost:3000/api/productos/categoria/:categoria_id
app.get('/api/productos/categoria/:categoria_id', async (req, res) => {
  try {
    const { categoria_id } = req.params;
    const resultado = await db.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.stock, ip.url_imagen
       FROM producto p
       LEFT JOIN imagenproducto ip ON p.id = ip.producto_id
       WHERE p.categoria_id = $1`,
      [categoria_id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para esta categoría' });
    }
    res.status(200).json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener los productos por categoría:', err);
    res.status(500).json({ error: 'Error al obtener los productos por categoría' });
  }
});

//===================POST====================================
// POST localhost:3000/api/usuarios
app.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre_usuario, correo, contrasena } = req.body;
    const resultado = await db.query(
      "INSERT INTO usuario (nombre_usuario,correo,contrasena,rol,creado_en) VALUES ($1,$2,$3,$4,NOW()) RETURNING *",
      [nombre_usuario, correo, contrasena, "cliente"]
    );
    res
      .status(201)
      .json({ mensaje: "Usuario creado", usuario: resultado.rows[0] });
  } catch (err) {
    console.error("Error al insertar en la base de datos:", err);
    res.status(500).json({ error: "Error al insertar en la base de datos" });
  }
});

// POST localhost:3000/api/usuarios/check
app.post("/api/usuarios/check", async (req, res) => {
  try {
    const { nombre_usuario, correo } = req.body;
    const resultado = await db.query(
      "SELECT * FROM usuario WHERE nombre_usuario = $1 OR correo = $2",
      [nombre_usuario, correo]
    );
    res.json({ exists: resultado.rows.length > 0 });
  } catch (err) {
    console.error("Error al verificar el usuario:", err);
    res.status(500).json({ error: "Error al verificar el usuario" });
  }
});

// POST localhost:3000/api/productos
app.post('/api/productos', upload.single('imagen'), async (req, res) => {
  try {
      const { nombre, descripcion, precio, stock, categoria_id } = req.body;
      const imagen = req.file ? `uploads/${req.file.filename}` : null;

      const resultadoProducto = await db.query(
          'INSERT INTO producto (nombre, descripcion, precio, stock, categoria_id, creado_en) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *',
          [nombre, descripcion, precio, stock, categoria_id]
      );

      const productoId = resultadoProducto.rows[0].id;

      if (imagen) {
          await db.query(
              'INSERT INTO imagenproducto (producto_id, url_imagen) VALUES ($1, $2)',
              [productoId, imagen]
          );
      }

      res.status(201).json({ mensaje: 'Producto creado', producto: resultadoProducto.rows[0] });
  } catch (err) {
      console.error('Error al insertar en la base de datos:', err);
      res.status(500).json({ error: 'Error al insertar en la base de datos' });
  }
});


// POST localhost:3000/api/login
app.post("/api/login", async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    const resultado = await db.query(
      "SELECT * FROM usuario WHERE correo = $1 AND contrasena = $2",
      [correo, contrasena]
    );

    if (resultado.rows.length === 0) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
    res.json({
      mensaje: "Bienvenido",
      usuario: {
        id: resultado.rows[0].id,
        nombre_usuario: resultado.rows[0].nombre_usuario,
        correo: resultado.rows[0].correo,
        rol: resultado.rows[0].rol,
      },
    });
  } catch (err) {
    console.error("Error al hacer el login:", err);
    res.status(500).json({ error: "Error al hacer el login" });
  }
});

// POST localhost:3000/api/carrito
app.post("/api/carrito", async (req, res) => {
  try {
    const { usuario_id, producto_id, cantidad = 1 } = req.body;

    let carrito = await db.query(
      "SELECT id FROM carrito WHERE usuario_id = $1",
      [usuario_id]
    );

    if (carrito.rows.length === 0) {
      const nuevoCarrito = await db.query(
        "INSERT INTO carrito (usuario_id, creado_en) VALUES ($1, NOW()) RETURNING *",
        [usuario_id]
      );
      carrito = nuevoCarrito;
    }

    const carrito_id = carrito.rows[0].id;

    const itemExistente = await db.query(
      "SELECT * FROM itemcarrito WHERE carrito_id = $1 AND producto_id = $2",
      [carrito_id, producto_id]
    );

    if (itemExistente.rows.length > 0) {
      const nuevaCantidad = itemExistente.rows[0].cantidad + cantidad;
      await db.query(
        "UPDATE itemcarrito SET cantidad = $1, agregado_en = NOW() WHERE id = $2",
        [nuevaCantidad, itemExistente.rows[0].id]
      );
      res.status(200).json({
        mensaje: "Cantidad actualizada en el carrito",
        item: { producto_id, cantidad: nuevaCantidad },
      });
    } else {
      const resultado = await db.query(
        "INSERT INTO itemcarrito (carrito_id, producto_id, cantidad, agregado_en) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [carrito_id, producto_id, cantidad]
      );
      res.status(201).json({
        mensaje: "Producto agregado al carrito",
        item: resultado.rows[0],
      });
    }
  } catch (err) {
    console.error("Error al agregar producto al carrito:", err);
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

// POST localhost:3000/api/carrito-anonimo
app.post("/api/carrito-anonimo", async (req, res) => {
  try {
    const { session_id, producto_id, cantidad } = req.body;

    if (!session_id) {
      return res
        .status(400)
        .json({ error: "session_id es requerido para carritos anónimos." });
    }

    let carrito = await db.query(
      "SELECT id FROM carrito WHERE usuario_id IS NULL AND session_id = $1",
      [session_id]
    );

    if (carrito.rows.length === 0) {
      const nuevoCarrito = await db.query(
        "INSERT INTO carrito (usuario_id, session_id, creado_en) VALUES (NULL, $1, NOW()) RETURNING *",
        [session_id]
      );
      carrito = nuevoCarrito;
    }

    const carrito_id = carrito.rows[0].id;

    const itemExistente = await db.query(
      "SELECT * FROM itemcarrito WHERE carrito_id = $1 AND producto_id = $2",
      [carrito_id, producto_id]
    );

    if (itemExistente.rows.length > 0) {
      const nuevaCantidad = itemExistente.rows[0].cantidad + cantidad;
      await db.query(
        "UPDATE itemcarrito SET cantidad = $1, agregado_en = NOW() WHERE id = $2",
        [nuevaCantidad, itemExistente.rows[0].id]
      );
      res.status(200).json({
        mensaje: "Cantidad actualizada en el carrito anónimo",
        item: { producto_id, cantidad: nuevaCantidad },
      });
    } else {
      const resultado = await db.query(
        "INSERT INTO itemcarrito (carrito_id, producto_id, cantidad, agregado_en) VALUES ($1, $2, $3, NOW()) RETURNING *",
        [carrito_id, producto_id, cantidad]
      );

      res.status(201).json({
        mensaje: "Producto agregado al carrito anónimo",
        item: resultado.rows[0],
      });
    }
  } catch (err) {
    console.error("Error al agregar producto al carrito anónimo:", err);
    res
      .status(500)
      .json({ error: "Error al agregar producto al carrito anónimo" });
  }
});


// POST localhost:3000/api/orden
app.post("/api/orden", async (req, res) => {
  try {
    const { usuario_id } = req.body;
    const carrito = await db.query(
      "SELECT * FROM carrito WHERE usuario_id = $1",
      [usuario_id]
    );

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id es requerido." });
    }

    if (carrito.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró un carrito para este usuario." });
    }
    const carrito_id = carrito.rows[0].id;

    const itemsCarrito = await db.query(
      `
            SELECT ic.producto_id,p.nombre,ic.cantidad, p.precio
            FROM itemcarrito ic
            JOIN producto p ON ic.producto_id = p.id
            WHERE ic.carrito_id = $1
        `,
      [carrito_id]
    );

    if (itemsCarrito.rows.length === 0) {
      return res.status(400).json({ error: "El carrito está vacío." });
    }
    const total = itemsCarrito.rows.reduce(
      (acc, item) => acc + item.cantidad * item.precio,
      0
    );

    const nuevaOrden = await db.query(
      "INSERT INTO orden (usuario_id, total, estado, creado_en) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [usuario_id, total, "pendiente"]
    );

    const orden_id = nuevaOrden.rows[0].id;

    for (const item of itemsCarrito.rows) {
      await db.query(
        "INSERT INTO itemorden (orden_id, producto_id, cantidad, precio) VALUES ($1, $2, $3, $4)",
        [orden_id, item.producto_id, item.cantidad, item.precio]
      );
    }

    await db.query("DELETE FROM itemcarrito WHERE carrito_id = $1", [
      carrito_id,
    ]);

    res.status(201).json({
      mensaje: "Orden registrada exitosamente",
      orden: nuevaOrden.rows[0],
    });
  } catch (err) {
    console.error("Error al registrar la orden:", err);
    res.status(500).json({ error: "Error al registrar la orden" });
  }
});

// POST localhost:3000/api/transferir-carrito
app.post('/api/transferir-carrito', async (req, res) => {
  try {
    const { session_id, usuario_id } = req.body;

    if (!session_id || !usuario_id) {
      return res.status(400).json({ error: 'session_id y usuario_id son requeridos' });
    }

    // Obtener el carrito anónimo
    const carritoAnonimo = await db.query(
      'SELECT id FROM carrito WHERE session_id = $1 AND usuario_id IS NULL',
      [session_id]
    );

    if (carritoAnonimo.rows.length === 0) {
      return res.status(404).json({ error: 'Carrito anónimo no encontrado' });
    }

    const carritoAnonimoId = carritoAnonimo.rows[0].id;

    await db.query(
      'UPDATE carrito SET usuario_id = $1, session_id = NULL WHERE id = $2',
      [usuario_id, carritoAnonimoId]
    );

    res.status(200).json({ mensaje: 'Carrito transferido exitosamente' });
  } catch (err) {
    console.error('Error al transferir el carrito:', err);
    res.status(500).json({ error: 'Error al transferir el carrito' });
  }
});



//===================PUT======================================
app.put("/api/carrito", async (req, res) => {
  try {
    const { usuario_id, item_id, cantidad } = req.body;

    if (!usuario_id || !item_id || cantidad === undefined) {
      return res
        .status(400)
        .json({ error: "usuario_id, item_id y cantidad son requeridos" });
    }

    const carrito = await db.query(
      "SELECT id FROM carrito WHERE usuario_id = $1",
      [usuario_id]
    );

    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const carrito_id = carrito.rows[0].id;

    const result = await db.query(
      "UPDATE itemcarrito SET cantidad = $1 WHERE carrito_id = $2 AND id = $3 RETURNING *",
      [cantidad, carrito_id, item_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res
      .status(200)
      .json({
        mensaje: "Cantidad actualizada en el carrito",
        item: result.rows[0],
      });
  } catch (err) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito:",
      err
    );
    res
      .status(500)
      .json({
        error: "Error al actualizar la cantidad del producto en el carrito",
      });
  }
});

app.put("/api/carrito-anonimo", async (req, res) => {
  try {
    const { session_id, item_id, cantidad } = req.body;

    if (!session_id || !item_id || cantidad === undefined) {
      return res
        .status(400)
        .json({ error: "session_id, item_id y cantidad son requeridos" });
    }

    // Obtener el carrito anónimo
    const carrito = await db.query(
      "SELECT id FROM carrito WHERE session_id = $1",
      [session_id]
    );

    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const carrito_id = carrito.rows[0].id;

    const result = await db.query(
      "UPDATE itemcarrito SET cantidad = $1 WHERE carrito_id = $2 AND id = $3 RETURNING *",
      [cantidad, carrito_id, item_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito anónimo" });
    }

    res
      .status(200)
      .json({
        mensaje: "Cantidad actualizada en el carrito anónimo",
        item: result.rows[0],
      });
  } catch (err) {
    console.error(
      "Error al actualizar la cantidad del producto en el carrito anónimo:",
      err
    );
    res
      .status(500)
      .json({
        error:
          "Error al actualizar la cantidad del producto en el carrito anónimo",
      });
  }
});

//http://localhost:3000/api/productos/${id}
app.put('/api/productos/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { nombre, descripcion, precio, stock, categoria_id } = req.body;
      const imagen = req.file ? req.file.filename : null;

      const resultadoProducto = await db.query(
          'UPDATE producto SET nombre = $1, descripcion = $2, precio = $3, stock = $4, categoria_id = $5 WHERE id = $6 RETURNING *',
          [nombre, descripcion, precio, stock, categoria_id, id]
      );

      if (imagen) {
          await db.query(
              'UPDATE imagenproducto SET url_imagen = $1 WHERE producto_id = $2',
              [imagen, id]
          );
      }

    res.status(200).json({ mensaje: 'Producto actualizado', producto: resultadoProducto.rows[0] });
  } catch (err) {
      console.error('Error al actualizar el producto:', err);
      res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});

//===================DELETE======================================

// DELETE localhost:3000/api/productos/:id
app.delete("/api/productos/:id", (req, res) => {
  try {
    const id = req.params.id;
    resultado = db.query("DELETE FROM producto WHERE id = $1", [id]);
    resultado;
    res.status(200).send({ succes: true });
  } catch (err) {
    console.error("Error al eliminar el producto ", err);
    C;
    res.status(500).json({ error: "Error al eliminar el producto " });
  }
});

app.delete("/api/carrito", async (req, res) => {
  try {
    const { usuario_id, item_id } = req.query;

    if (!usuario_id || !item_id) {
      return res
        .status(400)
        .json({ error: "usuario_id y item_id son requeridos" });
    }

    // Obtener el carrito del usuario
    const carrito = await db.query(
      "SELECT id FROM carrito WHERE usuario_id = $1",
      [usuario_id]
    );

    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const carrito_id = carrito.rows[0].id;

    // Eliminar el producto del carrito
    const result = await db.query(
      "DELETE FROM itemcarrito WHERE carrito_id = $1 AND id = $2 RETURNING *",
      [carrito_id, item_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito" });
    }

    res
      .status(200)
      .json({
        mensaje: "Producto eliminado del carrito",
        item: result.rows[0],
      });
  } catch (err) {
    console.error("Error al eliminar producto del carrito:", err);
    res.status(500).json({ error: "Error al eliminar producto del carrito" });
  }
});

app.delete("/api/carrito-anonimo", async (req, res) => {
  try {
    const { session_id, item_id } = req.query;

    if (!session_id || !item_id) {
      return res
        .status(400)
        .json({ error: "session_id y item_id son requeridos" });
    }

    // Obtener el carrito anónimo
    const carrito = await db.query(
      "SELECT id FROM carrito WHERE session_id = $1",
      [session_id]
    );

    if (carrito.rows.length === 0) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const carrito_id = carrito.rows[0].id;

    // Eliminar el producto del carrito anónimo
    const result = await db.query(
      "DELETE FROM itemcarrito WHERE carrito_id = $1 AND id = $2 RETURNING *",
      [carrito_id, item_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito anónimo" });
    }

    res
      .status(200)
      .json({
        mensaje: "Producto eliminado del carrito anónimo",
        item: result.rows[0],
      });
  } catch (err) {
    console.error("Error al eliminar producto del carrito anónimo:", err);
    res
      .status(500)
      .json({ error: "Error al eliminar producto del carrito anónimo" });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
