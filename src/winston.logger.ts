import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WinstonLogger {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = process.cwd() + '/logs';
    const date = new Date().toISOString().slice(0, 10);

    // Create logs directory if it does not exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    // Delete log files older than 2 days
    this.cleanOldLogs(logDir, 2);

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}]: ${message}`;
        }),
      ),
      transports: [
        new winston.transports.File({
          filename: `app_log-${date}.log`,
          dirname: logDir,
        }),
      ],
    });

    if (process.env.APP_ENV !== 'production') {
      this.logger.add(new winston.transports.Console());
    }
  }

  private cleanOldLogs(directory: string, days: number) {
    const now = Date.now();
    const ageLimit = days * 24 * 60 * 60 * 1000;

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error('Error reading log directory:', err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(directory, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error getting file stats:', err);
            return;
          }

          const fileAge = now - stats.mtime.getTime();
          if (fileAge > ageLimit) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error('Error deleting old log file:', err);
              } else {
                console.log(`Deleted old log file: ${file}`);
              }
            });
          }
        });
      });
    });
  }

  error(message: string, trace: string = '') {
    this.logger.error(`${message}${trace ? '-' + trace : ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  info(message: string) {
    this.logger.info(message);
  }
}
