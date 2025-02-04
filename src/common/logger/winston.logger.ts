import * as winston from 'winston';
import moment from 'moment';
import { ClsServiceManager } from 'nestjs-cls';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from 'nest-winston/dist/winston.interfaces';

const { createLogger, format, transports } = winston;
const alignedWithTime = format.combine(
  format.timestamp(),
  format.splat(),
  format.json(),
  format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  format.printf((info) => {
    const cls = ClsServiceManager.getClsService();

    if (typeof info.message === 'object') {
      info.message = JSON.stringify(Object.entries(info.message));
    }

    const timeZoneOffset = moment(info.timestamp).toISOString();

    return `${timeZoneOffset} [${(info.metadata as { context?: string })?.context || 'Unknown'}] ${info.level}: ${info.message} ${cls.getId() || ''}`;
  }),
);

const alignedWithTimeColorized = format.combine(
  format.colorize(),
  alignedWithTime,
);

const warnFilter = winston.format((info) => {
  return info.level === 'warn' ? info : false;
});

const errorFilter = winston.format((info) => {
  return info.level === 'error' ? info : false;
});

export const instance = createLogger({
  format: format.json(),
  transports: [
    new transports.File({
      filename: `logs/${moment().format('YYYYMMDD')}-info.log`,
      format: alignedWithTime,
      level: 'info',
    }),
    new transports.File({
      filename: `logs/${moment().format('YYYYMMDD')}-warn.log`,
      format: winston.format.combine(warnFilter(), alignedWithTime),
      level: 'warn',
    }),
    new transports.File({
      filename: `logs/${moment().format('YYYYMMDD')}-error.log`,
      format: winston.format.combine(errorFilter(), alignedWithTime),
      level: 'error',
    }),
    new transports.File({
      filename: `logs/${moment().format('YYYYMMDD')}-fatal.log`,
      format: alignedWithTime,
      level: 'fatal',
    }),
    new transports.Console({
      format: alignedWithTimeColorized,
      level: 'info',
    }),
  ],
});

export class WinstonConfigService implements WinstonModuleOptionsFactory {
  createWinstonModuleOptions():
    | WinstonModuleOptions
    | Promise<WinstonModuleOptions> {
    return instance;
  }
}
