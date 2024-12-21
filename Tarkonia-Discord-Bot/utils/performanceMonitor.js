import { performance } from 'perf_hooks';
import logger from './logger.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(operation) {
    return performance.now();
  }

  endTimer(operation, startTime) {
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, { count: 0, totalTime: 0, avgTime: 0, maxTime: 0 });
    }

    const metric = this.metrics.get(operation);
    metric.count++;
    metric.totalTime += duration;
    metric.avgTime = metric.totalTime / metric.count;
    metric.maxTime = Math.max(metric.maxTime, duration);

    logger.info(`Performance: ${operation} took ${duration.toFixed(2)}ms`);
  }

  getMetrics() {
    return Array.from(this.metrics.entries()).map(([operation, metric]) => ({
      operation,
      count: metric.count,
      avgTime: metric.avgTime.toFixed(2),
      maxTime: metric.maxTime.toFixed(2),
    }));
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

