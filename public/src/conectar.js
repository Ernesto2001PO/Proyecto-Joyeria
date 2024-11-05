const { Pool } = require('pg');  // Importa el paquete pg para PostgreSQL
require('dotenv').config();      // Para leer variables de entorno desde .env

// Configuración de la conexión usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Exporta el cliente de la conexión
module.exports = {
    query: (text, params) => pool.query(text, params),
};
