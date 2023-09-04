import { transports, format, createLogger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
const { combine, timestamp, label, printf } = format;
import path from 'path';

const logFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'DCH' }), timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        'logs',
        'winston',
        'successes',
        'DCH-%DATE%-success.log',
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

const errorLogger = createLogger({
  level: 'info',
  format: combine(label({ label: 'DCH' }), timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join('logs', 'winston', 'errors', 'DCH-%DATE%-error.log'),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  ],
});

export { logger, errorLogger };
