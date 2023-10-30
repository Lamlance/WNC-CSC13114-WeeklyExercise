import { createLogger, format, transports } from "winston";
import { default as pm2_io } from "@pm2/io";
import DailyRotateFile from "winston-daily-rotate-file";

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
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new transports.File({ filename: "./logs/combined.log" }),
    new DailyRotateFile({
      filename: "./logs/%DATE%/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "2m",
      maxFiles: "14d",
    }),
    minuteTransport,
    dailyTransport,
  ],
});

export { logger as WinstonLogger };
