const os = require("os");

// Marcar el tiempo de inicio del servidor (para medir uptime y throughput)
let startTime = Date.now();

// Contadores globales de solicitudes y errores
let totalRequests = 0;
let totalErrors = 0;

// Acumulador de latencias individuales para calcular promedio
let totalLatency = 0;

// Middleware personalizado para registrar métricas de cada solicitud
exports.loggerMiddleware = (req, res, next) => {
  // Marcar el inicio de la solicitud
  const start = Date.now();

  // Ejecutar al finalizar la respuesta
  res.on("finish", () => {
    // Calcular latencia individual (tiempo de respuesta)
    const duration = Date.now() - start;
    totalRequests++;

    // Identificar si fue un error según el código de estado HTTP
    const isError = res.statusCode >= 400;
    if (isError) totalErrors++;

    // Acumular duración para calcular latencia promedio
    totalLatency += duration;
    const averageLatency = (totalLatency / totalRequests).toFixed(2);

    // Calcular tiempo transcurrido desde el arranque del servidor
    const elapsedSeconds = (Date.now() - startTime) / 1000;

    // Throughput: solicitudes por segundo desde que inició el servidor
    const throughput = (totalRequests / elapsedSeconds).toFixed(2);

    // Obtener uso de memoria actual del proceso (en MB)
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

    // Obtener tiempo total que el servidor ha estado activo (en segundos)
    const uptime = process.uptime();

    // Imprimir reporte de métricas en consola
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
✔️ Tasa de éxito: ${(
      ((totalRequests - totalErrors) / totalRequests) *
      100
    ).toFixed(2)}%
✔️ Throughput estimado: ${throughput} req/s
✔️ Latencia promedio: ${averageLatency}ms
✔️ Uso de memoria (Heap Used): ${memoryUsage.toFixed(2)} MB
✔️ Carga CPU promedio (1min): ${os.loadavg()[0].toFixed(2)}
✔️ Tiempo activo del servidor: ${Math.floor(uptime)} segundos
========================================================
`);
  });

  next();
};

// Exportar métricas para consulta externa (por ejemplo desde un endpoint)
exports.getMetrics = () => ({
  totalRequests,
  totalErrors,
  averageLatency: totalLatency / (totalRequests || 1),
  successRate: ((totalRequests - totalErrors) / (totalRequests || 1)) * 100,
  errorRate: (totalErrors / (totalRequests || 1)) * 100,
});
