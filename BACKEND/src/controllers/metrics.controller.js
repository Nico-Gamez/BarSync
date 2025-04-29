const os = require('os');
const process = require('process');
const { getMetrics } = require('../middlewares/logger.middleware');

exports.getSystemMetrics = (req, res) => {
  const loggerMetrics = getMetrics();

  const uptimeSeconds = process.uptime();
  const memoryUsage = process.memoryUsage();
  const cpuLoad = os.loadavg(); // [1min, 5min, 15min]
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  const metrics = {
    ...loggerMetrics,
    uptimeSeconds,
    memoryMB: {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      external: (memoryUsage.external / 1024 / 1024).toFixed(2),
      totalMemMB: (totalMem / 1024 / 1024).toFixed(2),
      freeMemMB: (freeMem / 1024 / 1024).toFixed(2)
    },
    cpuLoadAverage: {
      '1min': cpuLoad[0],
      '5min': cpuLoad[1],
      '15min': cpuLoad[2]
    },
    timestamp: new Date().toISOString()
  };

  res.status(200).json(metrics);
};
