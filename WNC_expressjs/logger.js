import { createLogger, format, transports } from "winston";
import { default as pm2_io } from "@pm2/io";
import RabbitMQLogger from "./src/logger/RabbitMQLogger.js";

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.json()
  ),
  transports: [
    new transports.Console({ consoleWarnLevels: ["error"], level: "error" }),
    new transports.File({ filename: "./logs/error.log", level: "error" }),
    new RabbitMQLogger({ level: "error" }),
  ],
});

export { logger as WinstonLogger };
