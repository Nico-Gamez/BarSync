const os = require('os');

let totalRequests = 0;
let totalErrors = 0;

exports.loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    totalRequests++;

    const isError = res.statusCode >= 400;
    if (isError) totalErrors++;

    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;
    const uptime = process.uptime();

    console.log(`
========================================================
🎯 MÉTRICA DE ESTA SOLICITUD
➡️ Endpoint: ${req.method} ${req.originalUrl}
✔️ Código de estado: ${res.statusCode}
✔️ Tiempo de respuesta: ${duration}ms
✔️ Éxito: ${!isError}
📅 Timestamp: ${new Date().toISOString()}

📊 MÉTRICAS GLOBALES (Desde que inició el servidor)
✔️ Total solicitudes: ${totalRequests}
✔️ Total errores: ${totalErrors}
✔️ Tasa de éxito: ${((totalRequests - totalErrors) / totalRequests * 100).toFixed(2)}%
✔️ Uso de memoria (Heap Used): ${memoryUsage.toFixed(2)} MB
✔️ Carga CPU promedio (1min): ${os.loadavg()[0].toFixed(2)}
✔️ Tiempo activo del servidor: ${Math.floor(uptime)} segundos
========================================================
    `);
  });

  next();
};

exports.getMetrics = () => ({
  totalRequests,
  totalErrors,
  successRate: ((totalRequests - totalErrors) / (totalRequests || 1)) * 100,
  errorRate: (totalErrors / (totalRequests || 1)) * 100
});
