const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS, // Nota: tú usas DB_PASS en tu env, no DB_PASSWORD
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test de conexión
db.getConnection()
    .then(connection => {
        console.log('✅ Conectado a MySQL');
        connection.release(); // MUY importante: liberar la conexión
    })
    .catch(err => {
        console.error('❌ Error de conexión a MySQL:', err);
    });

module.exports = db;
