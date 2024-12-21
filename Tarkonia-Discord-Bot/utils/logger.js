import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = 'logs';
const errorLogFile = path.join(logDir, 'error.log');
const combinedLogFile = path.join(logDir, 'combined.log');

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: errorLogFile, level: 'error' }),
    new winston.transports.File({ filename: combinedLogFile }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export function getLogs(logType = 'combined', lines = 50) {
  const logFile = logType === 'error' ? errorLogFile : combinedLogFile;
  const content = fs.readFileSync(logFile, 'utf8');
  const logEntries = content.trim().split('\n');
  return logEntries.slice(-lines).join('\n');
}

export function clearLogs(logType = 'combined') {
  const logFile = logType === 'error' ? errorLogFile : combinedLogFile;
  fs.writeFileSync(logFile, '');
}

export default logger;

