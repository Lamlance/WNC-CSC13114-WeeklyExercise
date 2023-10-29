import { createLogger, format, transports } from "winston";
import { default as pm2_io } from "@pm2/io";
import DailyRotateFile from "winston-daily-rotate-file";

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
  ],
});

export { logger as WinstonLogger };
