// Módulos del sistema para obtener información de CPU, memoria y tiempo de ejecución
const os = require('os');
const process = require('process');

// Función importada desde el middleware que contiene las métricas acumuladas
const { getMetrics } = require('../middlewares/logger.middleware');

// Controlador para obtener métricas del sistema
exports.getSystemMetrics = (req, res) => {
  // Obtener métricas de solicitudes (total, errores, latencia, etc.)
  const loggerMetrics = getMetrics();

  // Tiempo total que el proceso ha estado activo (en segundos)
  const uptimeSeconds = process.uptime();

  // Información detallada de uso de memoria del proceso
  const memoryUsage = process.memoryUsage();

  // Carga promedio del CPU en los últimos 1, 5 y 15 minutos
  const cpuLoad = os.loadavg();

  // Memoria total y memoria libre del sistema
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  // Armar el objeto final con todas las métricas
  const metrics = {
    ...loggerMetrics, // Incluir métricas del middleware (latencia, throughput, errores)
    uptimeSeconds,    // Tiempo total que el servidor lleva ejecutándose
    memoryMB: {       // Conversión de valores de bytes a MB con dos decimales
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      external: (memoryUsage.external / 1024 / 1024).toFixed(2),
      totalMemMB: (totalMem / 1024 / 1024).toFixed(2),
      freeMemMB: (freeMem / 1024 / 1024).toFixed(2)
    },
    cpuLoadAverage: { // Promedio de carga del CPU en intervalos estándar
      '1min': cpuLoad[0],
      '5min': cpuLoad[1],
      '15min': cpuLoad[2]
    },
    timestamp: new Date().toISOString() // Marca de tiempo de la medición
  };

  // Responder al cliente con las métricas en formato JSON
  res.status(200).json(metrics);
};
