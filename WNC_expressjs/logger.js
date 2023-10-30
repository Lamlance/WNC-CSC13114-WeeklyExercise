import { createLogger, format, transports } from "winston";
import { default as pm2_io } from "@pm2/io";
import DailyRotateFile from "winston-daily-rotate-file";
import pkg from "winston-mongodb";
const { MongoDB } = pkg;
import "winston-syslog";
import os from "os";


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
    format.json(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.metadata()
  ),
  transports: [
    new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/combined.log" }),
    new transports.Syslog({
      host: 'logs4.papertrailapp.com',
      port: 16512,
      protocol: 'tls4',
      localhost: os.hostname(),
      eol: '\n',
    }),
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
  ],
});

export { logger as WinstonLogger };
