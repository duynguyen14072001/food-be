import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class WinstonLogger {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = process.cwd() + '/logs';
    const date = new Date().toISOString().slice(0, 10);

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

  error(message: string, trace: string) {
    this.logger.error(`${message} - ${trace}`);
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
