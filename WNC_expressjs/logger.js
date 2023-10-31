import { createLogger, format, transports } from "winston";
import UDPSocketLogger from "./src/logger/UDPSocketLogger.js";
import DailyRotateFile from "winston-daily-rotate-file";
import pkg from "winston-mongodb";
import "winston-syslog";
import os from "os";
const { MongoDB } = pkg;

const papertrail = new transports.Syslog({
  host: 'logs4.papertrailapp.com',
  port: 16512,
  protocol: 'tls4',
  localhost: os.hostname(),
  eol: '\n',
});
const minuteTransport = new DailyRotateFile({
  filename: "./logs/%DATE%/application-%DATE%.log",
  frequency: "m",
  datePattern: "YYYY-MM-DD-HH-mm",
});

const dailyTransport = new DailyRotateFile({
  filename: "./logs/%DATE%/application-%DATE%.log",
  frequency: "d",
  datePattern: "YYYY-MM-DD",
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format(function (info, opts) {
      info.create_date = new Date().toUTCString();
      return info;
    })(),
    format.json(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata()
  ),
  transports: [
    //new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new UDPSocketLogger(),
    // new RabbitMQLogger({ level: "error" }),
    new transports.File({ filename: "./logs/combined.log" }),
    new DailyRotateFile({
      filename: "./logs/%DATE%/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "2m",
      maxFiles: "14d",
    }),
    new MongoDB({
      db: "mongodb+srv://", // mongodb uri
      level: "info",
      collection: "logs",
      options: { useUnifiedTopology: true },
    }),
    minuteTransport,
    dailyTransport,
    papertrail,
  ],
});

export { logger as WinstonLogger };
