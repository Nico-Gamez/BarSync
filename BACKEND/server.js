require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./src/config/db');
const { loggerMiddleware } = require('./src/middlewares/logger.middleware');

const routes = require('./src/routes/index'); // 👈 Importa solo el index.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

// Test conexión con MySQL (usando pool)
db.getConnection()
  .then(connection => {
    console.log('✅ Conectado a MySQL');
    connection.release(); // Liberar conexión después de probar
  })
  .catch(err => {
    console.error('❌ Error al conectar a MySQL:', err);
    process.exit(1);
  });

// Rutas base
app.get('/', (req, res) => {
  res.send('🚀 API BarSync funcionando');
});

// Montar rutas principales
app.use('/api', routes); // 👈 Montar index.js bajo /api

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
